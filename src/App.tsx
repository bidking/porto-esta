/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useMemo } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import GeminiAssistant from "./components/GeminiAssistant";
import { ThemeProvider } from "./ThemeContext";
import GradualBlur from "./components/ui/GradualBlur";
import { useTheme } from "./ThemeContext";

// Lazy load below-the-fold components
const About = lazy(() => import("./components/About"));
const CareerTimeline = lazy(() => import("./components/CareerTimeline"));
const Projects = lazy(() => import("./components/Projects"));
const ScrollVelocity = lazy(() => import("./components/ui/ScrollVelocity"));
const Skills = lazy(() => import("./components/Skills"));
const DevOpsDashboard = lazy(() => import("./components/DevOpsDashboard"));
const CommentSection = lazy(() => import("./components/CommentSection"));
const Contact = lazy(() => import("./components/Contact"));
const FlowingMenu = lazy(() => import("./components/FlowingMenu"));

const LoadingFallback = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const velocityTexts = useMemo(() => ['DevOps Architect', 'System Administrator'], []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-transparent selection:bg-purple-500/30 dark:selection:bg-white/20">
      <Navbar />
      <GeminiAssistant />

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
        
        <Suspense fallback={<LoadingFallback />}>
          <About />
          <CareerTimeline />
          <Projects />
          
          <div className="h-[400px] md:h-[600px] relative dark:bg-black bg-white transition-colors duration-300">
             <FlowingMenu 
               items={[
                 { link: '#', text: 'Infrastructure as Code', image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80' },
                 { link: '#', text: 'Cloud Orchestration', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
                 { link: '#', text: 'CI/CD Pipelines', image: 'https://images.unsplash.com/photo-1618401471353-b98aadebc255?w=800&q=80' },
                 { link: '#', text: 'Network Security', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=800&q=80' }
               ]} 
               textColor={theme === 'dark' ? '#fff' : '#18181b'}
               marqueeBgColor={theme === 'dark' ? '#fff' : '#18181b'}
               marqueeTextColor={theme === 'dark' ? '#000' : '#fff'}
               borderColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
               bgColor="transparent"
             />
          </div>

          <div className="py-20 dark:bg-zinc-950/50 bg-zinc-200/50 transition-colors duration-300">
            <ScrollVelocity 
              texts={velocityTexts} 
              velocity={100} 
              className="dark:text-white text-zinc-900 font-black italic tracking-tighter transition-colors duration-300"
            />
          </div>

          <Skills />
          <DevOpsDashboard />
          <CommentSection />
          <Contact />
        </Suspense>
      </div>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] dark:bg-purple-600/10 bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] dark:bg-purple-500/10 bg-purple-500/5 blur-[120px] rounded-full" />
      </div>
      
      <footer className="py-12 text-center dark:text-white/20 text-zinc-400 text-xs font-mono uppercase tracking-[0.2em] transition-colors duration-300">
        &copy; 2026 Esta Nur Aliansyah 
      </footer>
    </main>
  );
}

