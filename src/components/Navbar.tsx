import { motion } from "motion/react";

export default function Navbar() {
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
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="glass px-8 py-4 rounded-full flex items-center gap-8">
        <a href="#hero" className="text-xl font-bold tracking-tighter interactive">STA</a>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <a 
              key={item.name} 
              href={item.href}
              className="text-xs font-medium uppercase tracking-widest text-white/50 hover:text-white transition-colors interactive"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
