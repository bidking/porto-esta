import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Section from "./Section";
import LiquidEther from "./ui/LiquidEther";
import ShinyText from "./ui/ShinyText";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const isMobileDevice = window.innerWidth < 768;
    setIsMobile(isMobileDevice);
    setIsLoaded(true);
    
    // Dynamically load Spline only on desktop
    if (!isMobileDevice) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.12.87/build/spline-viewer.js';
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  if (!isLoaded) return <div className="min-h-screen bg-black" />;

  return (
    <Section id="hero" className="items-center overflow-hidden relative min-h-screen flex">
      {!isMobile && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <LiquidEther
            colors={[ '#000000', '#7E22CE', '#A855F7', '#1E1B4B' ]} 
            mouseForce={20}
            cursorSize={100}
            isViscous={true}
            viscous={30}
            iterationsViscous={12}
            iterationsPoisson={12}
            resolution={0.25}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
      )}
      
      {isMobile && (
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-purple-900/20 via-black to-zinc-900/20 opacity-50" />
      )}
      
      <div className="container mx-auto px-4 md:px-6 z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 pt-10 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-left lg:-translate-y-12"
        >
          <motion.span 
            className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-widest uppercase glass rounded-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            DevOps & System Administrator
          </motion.span>
          
          <div className="mb-8">
            <ShinyText
              text="Esta Nur Aliansyah"
              speed={2}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              className="text-7xl sm:text-8xl md:text-8xl xl:text-9xl font-extrabold tracking-tighter !ml-0 !mr-auto text-left leading-[0.85] block"
            />
          </div>
          
          <p className="max-w-xl text-lg md:text-xl dark:text-white/60 text-zinc-600 font-light leading-relaxed mb-12 transition-colors duration-300">
            Securing Infrastructure, Architecting Experiences. <br />
            Bridging the gap between robust engineering and visionary design.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 dark:bg-white dark:text-black bg-zinc-900 text-white rounded-full font-medium interactive transition-all duration-300 inline-block"
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 glass dark:text-white text-zinc-900 rounded-full font-medium interactive transition-all duration-300 shadow-sm inline-block"
            >
              Contact Me
            </motion.a>
          </div>
        </motion.div>

        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="relative h-[400px] lg:h-[650px] w-full flex items-center justify-center lg:justify-end"
          >
            {/* Spline Viewer */}
            <div className="w-full h-full relative group overflow-hidden">
               {/* @ts-ignore - custom element spline-viewer */}
               <spline-viewer 
                 url="https://prod.spline.design/xjE71Vefvk1b-63x/scene.splinecode"
                 loading="lazy"
                 hint="none"
                 className="w-full h-full scale-110 lg:scale-[1.25] transition-transform duration-700 translate-x-[5%] lg:translate-x-[10%]"
                 style={{ clipPath: 'inset(0 0 50px 0)' }}
               />
            </div>
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-purple-500/50 to-transparent" />
      </motion.div>
    </Section>
  );
}
