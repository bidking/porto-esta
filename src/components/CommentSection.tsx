import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Section from "./Section";
import { Send, User } from "lucide-react";
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

interface Comment {
  id: string;
  text: string;
  user: string;
  photo: string;
  createdAt: any;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(db, "comments"), {
        text: newComment,
        user: user?.displayName || "Anonymous",
        photo: user?.photoURL || "",
        uid: user?.uid || "anonymous",
        createdAt: serverTimestamp()
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  return (
    <Section id="comments" className="max-w-3xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4 tracking-tight dark:text-white text-zinc-900 transition-colors duration-300">The Feedback Loop</h2>
        <p className="dark:text-white/50 text-zinc-600 transition-colors duration-300">Leave a message in the glass terminal. (Anonymous allowed!)</p>
      </div>

      <div className="glass p-8 rounded-[40px] mb-8 transition-all duration-300">
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
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="absolute right-4 bottom-4 p-3 dark:bg-white dark:text-black bg-zinc-900 text-white rounded-xl interactive transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
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

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-6 rounded-3xl flex gap-4 transition-all duration-300"
            >
              {comment.photo ? (
                <img src={comment.photo} alt={comment.user} className="w-10 h-10 rounded-full border dark:border-white/10 border-zinc-200 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full dark:bg-white/10 bg-black/5 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 dark:text-white/40 text-zinc-400" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm dark:text-white text-zinc-900 transition-colors duration-300">{comment.user}</span>
                  <span className="text-[10px] dark:text-white/30 text-zinc-500 font-mono transition-colors duration-300">
                    {comment.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm dark:text-white/70 text-zinc-600 leading-relaxed transition-colors duration-300">{comment.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}
