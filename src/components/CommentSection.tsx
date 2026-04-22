import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Section from "./Section";
import { Send, User, Reply, X, Image as ImageIcon, Search } from "lucide-react";
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

interface Comment {
  id: string;
  text: string;
  user: string;
  photo: string;
  uid: string;
  gifUrl?: string;
  replyToId?: string;
  createdAt: any;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [gifSearch, setGifSearch] = useState("");
  const [gifResults, setGifResults] = useState<any[]>([]);
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
    });

    return () => {
      unsubscribe();
      authUnsubscribe?.();
    };
  }, []);

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
    try {
      const resp = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(gifSearch)}&limit=12`);
      const data = await resp.json();
      setGifResults(data.data || []);
    } catch (error) {
      console.error("GIF search failed", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && !selectedGif) return;

    try {
      const commentData: any = {
        text: newComment,
        user: user?.displayName || "Anonymous",
        uid: user?.uid || "anonymous",
        createdAt: serverTimestamp()
      };

      if (user?.photoURL) {
        commentData.photo = user.photoURL;
      } else {
        commentData.photo = "";
      }

      if (replyTo) {
        commentData.replyToId = replyTo.id;
      }

      if (selectedGif) {
        commentData.gifUrl = selectedGif;
      }

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
                  <img src={selectedGif} className="h-16 rounded-lg border-2 border-blue-500 shadow-lg" alt="Selected GIF" />
                  <button 
                    type="button"
                    onClick={() => setSelectedGif(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="absolute right-4 bottom-4 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsGifPickerOpen(!isGifPickerOpen)}
                  className={`p-3 rounded-xl transition-all ${isGifPickerOpen ? 'dark:bg-blue-500/20 bg-blue-50 text-blue-500' : 'dark:bg-white/5 bg-black/5 dark:text-white/40 text-zinc-400 hover:dark:bg-white/10 hover:bg-black/10'}`}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={!newComment.trim() && !selectedGif}
                  className="p-3 dark:bg-white dark:text-black bg-zinc-900 text-white rounded-xl interactive transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {isGifPickerOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={gifSearch}
                      onChange={(e) => setGifSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchGifs())}
                      placeholder="Search GIPHY..."
                      className="w-full pl-10 pr-4 py-2 text-sm dark:bg-white/5 bg-zinc-50 border dark:border-white/10 border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-white/30 text-zinc-400" />
                  </div>
                  <button 
                    type="button"
                    onClick={searchGifs}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Search
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {gifResults.map(gif => (
                    <button 
                      key={gif.id}
                      type="button"
                      onClick={() => {
                        setSelectedGif(gif.images.fixed_height.url);
                        setIsGifPickerOpen(false);
                      }}
                      className="aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all group"
                    >
                      <img src={gif.images.fixed_height.url} alt="GIF" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!user && (
            <div className="flex items-center justify-between pt-4 border-t dark:border-white/5 border-zinc-100">
              <span className="text-xs dark:text-white/30 text-zinc-400">Posting as Anonymous</span>
              <button 
                type="button"
                onClick={handleLogin}
                className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                Sign in with Google for profile pic
              </button>
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
                onReply={() => {
                  setReplyTo(comment);
                  window.scrollTo({ top: document.getElementById('comments')?.offsetTop! - 100, behavior: 'smooth' });
                }} 
              />
              
              {/* Replies */}
              <div className="ml-8 md:ml-12 space-y-4 border-l-2 dark:border-white/5 border-zinc-100 pl-4 md:pl-6">
                {getReplies(comment.id).map(reply => (
                  <CommentCard key={reply.id} comment={reply} isReply />
                ))}
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function CommentCard({ comment, onReply, isReply = false }: { comment: Comment, onReply?: () => void, isReply?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass ${isReply ? 'p-4 rounded-2xl' : 'p-6 rounded-3xl'} flex gap-4 transition-all duration-300 group`}
    >
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
          {!isReply && onReply && (
            <button 
              onClick={onReply}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-all"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
          )}
        </div>
        <p className={`${isReply ? 'text-xs' : 'text-sm'} dark:text-white/70 text-zinc-600 leading-relaxed transition-colors duration-300 break-words`}>
          {comment.text}
        </p>
        {comment.gifUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border dark:border-white/10 border-zinc-200 max-w-sm">
            <img src={comment.gifUrl} alt="Comment GIF" className="w-full object-cover" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
