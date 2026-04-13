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
    if (!newComment.trim() || !user) return;

    try {
      await addDoc(collection(db, "comments"), {
        text: newComment,
        user: user.displayName || "Anonymous",
        photo: user.photoURL || "",
        uid: user.uid,
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
        <h2 className="text-4xl font-bold mb-4 tracking-tight">The Feedback Loop</h2>
        <p className="text-white/50">Leave a message in the glass terminal.</p>
      </div>

      <div className="glass p-8 rounded-[40px] mb-8">
        {!user ? (
          <div className="text-center py-8">
            <p className="text-white/60 mb-6">Sign in to join the conversation</p>
            <button 
              onClick={handleLogin}
              className="px-8 py-3 bg-white text-black rounded-full font-medium interactive"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full border border-white/10" />
            <div className="flex-1 relative">
              <input 
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-6 rounded-3xl flex gap-4"
            >
              {comment.photo ? (
                <img src={comment.photo} alt={comment.user} className="w-10 h-10 rounded-full border border-white/10 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white/40" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{comment.user}</span>
                  <span className="text-[10px] text-white/30 font-mono">
                    {comment.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{comment.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}
