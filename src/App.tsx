/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Hero from "./components/Hero";
import About from "./components/About";
import CareerTimeline from "./components/CareerTimeline";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import DevOpsDashboard from "./components/DevOpsDashboard";
import CommentSection from "./components/CommentSection";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import FluidGlass from "./components/FluidGlass";
import GeminiAssistant from "./components/GeminiAssistant";

export default function App() {
  return (
    <main className="relative min-h-screen bg-black selection:bg-white/20">
      <FluidGlass 
        mode="lens"
        lensProps={{
          scale: 0.2,
          ior: 1.15,
          thickness: 5,
          chromaticAberration: 0.1,
          anisotropy: 0.01  
        }}
      />
      
      <Navbar />
      <GeminiAssistant />
      
      <div className="relative z-10">
        <Hero />
        <About />
        <CareerTimeline />
        <Projects />
        <Skills />
        <DevOpsDashboard />
        <CommentSection />
        <Contact />
      </div>
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>
      
      <footer className="py-12 text-center text-white/20 text-xs font-mono uppercase tracking-[0.2em]">
        &copy; 2026 Esta Nur Aliansyah &bull; Built with Gemini AI &bull; iOS 26 Aesthetic
      </footer>
    </main>
  );
}

