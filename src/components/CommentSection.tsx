import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Section from "./Section";
import { Send, User, Reply, X, Image as ImageIcon, Search, Heart } from "lucide-react";
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, writeBatch, doc, increment, getDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

interface Comment {
  id: string;
  text: string;
  user: string;
  photo: string;
  uid: string;
  gifUrl?: string;
  replyToId?: string;
  likesCount?: number;
  createdAt: any;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [gifSearch, setGifSearch] = useState("");
  const [gifResults, setGifResults] = useState<any[]>([]);
  const [isGifLoading, setIsGifLoading] = useState(false);
  const [gifError, setGifError] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(docs);
    });

    const authUnsubscribe = auth?.onAuthStateChanged((u: any) => {
      setUser(u);
      if (u) {
        // We handle user likes separately to avoid massive snapshot listeners
        // For simplicity in this demo, we'll fetch them as they appear
      }
    });

    return () => {
      unsubscribe();
      authUnsubscribe?.();
    };
  }, []);

  // Track likes for current user
  useEffect(() => {
    if (!db) return;
    
    const deviceId = localStorage.getItem('deviceId') || '';
    const likeUid = user?.uid || (deviceId ? `anon_${deviceId}` : '');
    if (!likeUid) return;

    // Listen to likes subcollections for user
    const unsubscribers: (() => void)[] = [];
    
    comments.forEach(comment => {
      const likeDoc = doc(db, "comments", comment.id, "likes", likeUid);
      const unsub = onSnapshot(likeDoc, (doc) => {
        setUserLikes(prev => ({
          ...prev,
          [comment.id]: doc.exists()
        }));
      });
      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach(u => u());
  }, [user, comments.map(c => c.id).join(','), localStorage.getItem('deviceId')]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const searchGifs = async () => {
    if (!gifSearch.trim()) return;
    setIsGifLoading(true);
    setGifError(null);
    try {
      // Trying a more reliable public key
      const resp = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=LIV87reSOf9ouBy9fA6Yn28YkCEF0yZp&q=${encodeURIComponent(gifSearch)}&limit=12&rating=g`);
      if (resp.status === 403 || resp.status === 401) {
        throw new Error("GIPHY API Key issue or rate limited. Please try again later.");
      }
      const data = await resp.json();
      setGifResults(data.data || []);
    } catch (error: any) {
      console.error("GIF search failed", error);
      setGifResults([]);
      setGifError(error.message || "Failed to search GIFs");
    } finally {
      setIsGifLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    const isLiked = userLikes[commentId];
    // Use a device-specific ID for anonymous likes if not logged in
    const deviceId = localStorage.getItem('deviceId') || (() => {
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('deviceId', id);
      return id;
    })();
    
    const likeUid = user?.uid || `anon_${deviceId}`;
    const batch = writeBatch(db);
    const commentRef = doc(db, "comments", commentId);
    const likeRef = doc(db, "comments", commentId, "likes", likeUid);

    if (isLiked) {
      batch.update(commentRef, { likesCount: increment(-1) });
      batch.delete(likeRef);
    } else {
      batch.update(commentRef, { likesCount: increment(1) });
      batch.set(likeRef, { uid: likeUid, createdAt: serverTimestamp() });
    }

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && !selectedGif) return;

    try {
      const deviceId = localStorage.getItem('deviceId') || (() => {
        const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('deviceId', id);
        return id;
      })();
      
      const commentUid = user?.uid || `anon_${deviceId}`;

      const commentData: any = {
        text: newComment,
        user: user?.displayName || "Anonymous",
        uid: commentUid,
        createdAt: serverTimestamp(),
        likesCount: 0
      };

      if (user?.photoURL) commentData.photo = user.photoURL;
      else commentData.photo = "";

      if (replyTo) commentData.replyToId = replyTo.id;
      if (selectedGif) commentData.gifUrl = selectedGif;

      await addDoc(collection(db, "comments"), commentData);
      setNewComment("");
      setReplyTo(null);
      setSelectedGif(null);
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  const parentComments = comments.filter(c => !c.replyToId);
  const getReplies = (parentId: string) => comments.filter(c => c.replyToId === parentId).reverse();

  return (
    <Section id="comments" className="max-w-3xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4 tracking-tight dark:text-white text-zinc-900 transition-colors duration-300">The Feedback Loop</h2>
        <p className="dark:text-white/50 text-zinc-600 transition-colors duration-300">Leave a message in the glass terminal. (Anonymous allowed!)</p>
      </div>

      <div className="glass p-8 rounded-[40px] mb-8 transition-all duration-300 relative">
        {replyTo && (
          <div className="mb-4 flex items-center justify-between p-3 dark:bg-white/5 bg-black/5 rounded-2xl">
            <div className="flex items-center gap-2 text-xs dark:text-white/60 text-zinc-600">
              <Reply className="w-4 h-4" />
              <span>Replying to <span className="font-bold">{replyTo.user}</span></span>
            </div>
            <button onClick={() => setReplyTo(null)} className="p-1 dark:hover:bg-white/10 hover:bg-black/5 rounded-full">
              <X className="w-4 h-4 dark:text-white/40 text-zinc-400" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-4 items-start">
            {user ? (
              <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full border dark:border-white/10 border-zinc-200 shadow-sm" />
            ) : (
              <div className="w-12 h-12 rounded-full dark:bg-white/10 bg-black/5 flex items-center justify-center shrink-0 border dark:border-white/10 border-zinc-200">
                <User className="w-6 h-6 dark:text-white/40 text-zinc-400" />
              </div>
            )}
            <div className="flex-1 relative">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? `What's on your mind, ${user.displayName}?` : "Type your message here... (Anonymous)"}
                className="w-full h-32 dark:bg-white/5 bg-zinc-50 dark:text-white text-zinc-900 border dark:border-white/10 border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none dark:focus:border-white/30 focus:border-zinc-400 dark:shadow-none shadow-inner transition-all duration-300 resize-none"
              />
              
              {selectedGif && (
                <div className="absolute left-4 bottom-4 group">
                  <img src={selectedGif} className="h-16 rounded-lg border-2 border-blue-500 shadow-lg" alt="Selected GIF" referrerPolicy="no-referrer" />
                  <button type="button" onClick={() => setSelectedGif(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="absolute right-4 bottom-4 flex gap-2">
                <button type="button" onClick={() => setIsGifPickerOpen(!isGifPickerOpen)} className={`p-3 rounded-xl transition-all ${isGifPickerOpen ? 'dark:bg-blue-500/20 bg-blue-50 text-blue-500' : 'dark:bg-white/5 bg-black/5 dark:text-white/40 text-zinc-400 hover:dark:bg-white/10 hover:bg-black/10'}`}>
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button type="submit" disabled={!newComment.trim() && !selectedGif} className="p-3 dark:bg-white dark:text-black bg-zinc-900 text-white rounded-xl interactive transition-all disabled:opacity-50">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {isGifPickerOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <input type="text" value={gifSearch} onChange={(e) => setGifSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchGifs())} placeholder="Search GIPHY..." className="w-full pl-10 pr-4 py-2 text-sm dark:bg-white/5 bg-zinc-50 border dark:border-white/10 border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-white/30 text-zinc-400" />
                  </div>
                  <button type="button" onClick={searchGifs} className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors">Search</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar min-h-[100px]">
                  {isGifLoading ? (
                    <div className="col-span-full py-10 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs dark:text-white/40 text-zinc-400">Searching GIPHY...</span>
                    </div>
                  ) : gifError ? (
                    <div className="col-span-full py-10 text-center">
                      <span className="text-xs text-red-500">{gifError}</span>
                    </div>
                  ) : gifResults.length > 0 ? (
                    gifResults.map(gif => (
                      <button key={gif.id} type="button" onClick={() => { setSelectedGif(gif.images.fixed_height.url); setIsGifPickerOpen(false); }} className="aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all group">
                        <img src={gif.images.fixed_height.url} alt="GIF" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </button>
                    ))
                  ) : gifSearch && (
                    <div className="col-span-full py-10 text-center">
                      <span className="text-xs dark:text-white/40 text-zinc-400">No GIFs found</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!user && (
            <div className="flex items-center justify-between pt-4 border-t dark:border-white/5 border-zinc-100">
              <span className="text-xs dark:text-white/30 text-zinc-400">Posting as Anonymous</span>
              <button type="button" onClick={handleLogin} className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Sign in with Google</button>
            </div>
          )}
        </form>
      </div>

      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {parentComments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <CommentCard 
                comment={comment} 
                isLiked={!!userLikes[comment.id]}
                onLike={() => handleLike(comment.id)}
                onReply={() => {
                  setReplyTo(comment);
                  window.scrollTo({ top: document.getElementById('comments')?.offsetTop! - 100, behavior: 'smooth' });
                }} 
              />
              <div className="ml-8 md:ml-12 space-y-4 border-l-2 dark:border-white/5 border-zinc-100 pl-4 md:pl-6">
                {getReplies(comment.id).map(reply => (
                  <CommentCard 
                    key={reply.id} 
                    comment={reply} 
                    isReply 
                    isLiked={!!userLikes[reply.id]}
                    onLike={() => handleLike(reply.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function CommentCard({ comment, onReply, onLike, isLiked, isReply = false }: { comment: Comment, onReply?: () => void, onLike: () => void, isLiked: boolean, isReply?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`glass ${isReply ? 'p-4 rounded-2xl' : 'p-6 rounded-3xl'} flex gap-4 transition-all duration-300 group`}>
      {comment.photo ? (
        <img src={comment.photo} alt={comment.user} className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full border dark:border-white/10 border-zinc-200 shrink-0`} />
      ) : (
        <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full dark:bg-white/10 bg-black/5 flex items-center justify-center shrink-0`}>
          <User className={`${isReply ? 'w-4 h-4' : 'w-5 h-5'} dark:text-white/40 text-zinc-400`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isReply ? 'text-xs' : 'text-sm'} dark:text-white text-zinc-900 transition-colors duration-300`}>{comment.user}</span>
            <span className="text-[10px] dark:text-white/30 text-zinc-500 font-mono transition-colors duration-300">
              {comment.createdAt?.toDate().toLocaleDateString()}
            </span>
          </div>
        </div>
        <p className={`${isReply ? 'text-xs' : 'text-sm'} dark:text-white/70 text-zinc-600 leading-relaxed transition-colors duration-300 break-words`}>
          {comment.text}
        </p>
        {comment.gifUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border dark:border-white/10 border-zinc-200 max-w-sm">
            <img src={comment.gifUrl} alt="Comment GIF" referrerPolicy="no-referrer" className="w-full object-cover" />
          </div>
        )}
        <div className="mt-3 flex items-center gap-4">
          <button onClick={onLike} className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${isLiked ? 'text-red-500' : 'dark:text-white/30 text-zinc-400 hover:text-red-400'}`}>
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{comment.likesCount || 0}</span>
          </button>
          {!isReply && onReply && (
            <button onClick={onReply} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider dark:text-white/30 text-zinc-400 hover:dark:text-white hover:text-zinc-900 transition-all">
              <Reply className="w-3.5 h-3.5" />
              Reply
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
