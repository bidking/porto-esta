import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../ThemeContext";
import StaggeredMenu from "./StaggeredMenu";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navItems = [
    { name: "About", href: "#about", label: "About", ariaLabel: "About section", link: "#about" },
    { name: "Projects", href: "#projects", label: "Projects", ariaLabel: "Projects section", link: "#projects" },
    { name: "Skills", href: "#skills", label: "Skills", ariaLabel: "Skills section", link: "#skills" },
    { name: "Dashboard", href: "#dashboard", label: "Dashboard", ariaLabel: "Dashboard section", link: "#dashboard" },
    { name: "Comments", href: "#comments", label: "Comments", ariaLabel: "Comments section", link: "#comments" },
    { name: "Contact", href: "#contact", label: "Contact", ariaLabel: "Contact section", link: "#contact" },
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/estaaliansyah' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/esta-nur-aliansyah-5b6647307' },
    { label: 'Instagram', link: 'https://www.instagram.com/astrolynx._' }
  ];

  return (
    <>
      {/* Mobile/Tablet Menu */}
      <div className="lg:hidden">
        <StaggeredMenu 
          isFixed 
          items={navItems} 
          socialItems={socialItems}
          colors={theme === 'dark' 
            ? ['#18181b', '#27272a', '#3f3f46'] 
            : ['#f4f4f5', '#e4e4e7', '#d4d4d8']
          }
          menuButtonColor={theme === 'dark' ? '#fff' : '#000'}
          openMenuButtonColor={theme === 'dark' ? '#fff' : '#000'}
          themeNode={
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl glass transition-colors interactive"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-900" />
              )}
            </button>
          }
        />
      </div>

      {/* Desktop Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="hidden lg:block fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-max"
      >
        <div className="glass px-8 py-4 rounded-full flex items-center gap-8 transition-all duration-300">
          <a href="#hero" className="text-xl font-bold tracking-tighter interactive dark:text-white text-zinc-900 transition-colors duration-300">STA</a>
          
          <div className="flex items-center gap-6">
            {navItems.map(item => (
              <a 
                key={item.name} 
                href={item.href}
                className="text-xs font-medium uppercase tracking-widest dark:text-white/50 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors interactive"
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
    </>
  );
}
