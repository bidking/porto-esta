import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Sparkles, Send } from "lucide-react";
import { askGemini } from "@/src/services/geminiService";
import ReactMarkdown from "react-markdown";

export default function GeminiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    const aiResponse = await askGemini(userMessage);
    setMessages(prev => [...prev, { role: "ai", content: aiResponse || "No response" }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] rounded-[32px] mb-4 flex flex-col overflow-hidden shadow-2xl transition-all duration-300"
          >
            <div className="p-6 border-b dark:border-white/10 border-zinc-100 flex items-center justify-between dark:bg-zinc-800/50 bg-zinc-50 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-sm tracking-tight dark:text-white text-zinc-900 transition-colors duration-300">Astro AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 dark:hover:bg-white/10 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5 dark:text-white/40 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 dark:text-white/10 text-zinc-200 mx-auto mb-4" />
                  <p className="text-sm dark:text-white/40 text-zinc-500">Ask me anything about Sta's experience or skills.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm transition-colors duration-300 ${
                        msg.role === "user" 
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-black" 
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-white/90 border border-zinc-200 dark:border-white/10 shadow-sm"
                      }`}>
                    <div className={`prose prose-sm transition-colors duration-300 ${msg.role === "user" ? "dark:prose-invert prose-invert" : "dark:prose-invert text-inherit"}`}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="dark:glass bg-zinc-100 border dark:border-white/10 border-zinc-200 p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 dark:bg-white/40 bg-zinc-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 dark:bg-white/40 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 dark:bg-white/40 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t dark:border-white/5 border-zinc-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Astro AI..."
                  className="w-full dark:bg-white/5 bg-zinc-100 border dark:border-white/10 border-zinc-200 rounded-2xl px-4 py-3 text-sm dark:text-white text-zinc-900 focus:outline-none dark:focus:border-white/30 focus:border-zinc-400 transition-colors pr-10"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 dark:text-white/40 text-zinc-400 dark:hover:text-white hover:text-zinc-900 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full glass flex items-center justify-center shadow-xl interactive"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
