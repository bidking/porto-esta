/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Hero from "./components/Hero";
import About from "./components/About";
import CareerTimeline from "./components/CareerTimeline";
import Projects from "./components/Projects";
import ScrollVelocity from "./components/ui/ScrollVelocity";
import Skills from "./components/Skills";
import DevOpsDashboard from "./components/DevOpsDashboard";
import CommentSection from "./components/CommentSection";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import GeminiAssistant from "./components/GeminiAssistant";
import { ThemeProvider } from "./lib/ThemeContext";
import GradualBlur from "./components/ui/GradualBlur";

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-transparent selection:bg-blue-500/30 dark:selection:bg-white/20">
      <Navbar />
      <GeminiAssistant />

      {/* Global Gradual Blur Overlay */}
      <GradualBlur
        target="page"
        position="bottom"
        height="7rem"
        strength={3}
        divCount={5}
        curve="bezier"
        exponential={true}
        zIndex={50}
        opacity={1}
      />
      
      <div className="relative z-10">
        <Hero />
        <About />
        <CareerTimeline />
        <Projects />
        <div className="py-20 dark:bg-zinc-950/50 bg-zinc-200/50 transition-colors duration-300">
          <ScrollVelocity 
            texts={['DevOps Architect', 'System Administrator']} 
            velocity={100} 
            className="dark:text-white text-zinc-900 font-black italic tracking-tighter transition-colors duration-300"
          />
        </div>
        <Skills />
        <DevOpsDashboard />
        <CommentSection />
        <Contact />
      </div>
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] dark:bg-blue-500/10 bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] dark:bg-purple-500/10 bg-purple-500/5 blur-[120px] rounded-full" />
      </div>
      
      <footer className="py-12 text-center dark:text-white/20 text-zinc-400 text-xs font-mono uppercase tracking-[0.2em] transition-colors duration-300">
        &copy; 2026 Esta Nur Aliansyah &bull; Built with Gemini AI &bull; iOS 26 Aesthetic
      </footer>
    </main>
  );
}

