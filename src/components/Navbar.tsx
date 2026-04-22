import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../lib/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navItems = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Comments", href: "#comments" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-max"
    >
      <div className="glass px-6 md:px-8 py-3 md:py-4 rounded-full flex items-center gap-4 md:gap-8 transition-all duration-300">
        <a href="#hero" className="text-xl font-bold tracking-tighter interactive dark:text-white text-zinc-900 transition-colors duration-300">STA</a>
        
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map(item => (
            <a 
              key={item.name} 
              href={item.href}
              className="text-[10px] md:text-xs font-medium uppercase tracking-widest dark:text-white/50 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors interactive"
            >
              {item.name}
            </a>
          ))}
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors interactive"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-white" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-900" />
          )}
        </button>
      </div>
    </motion.nav>
  );
}
