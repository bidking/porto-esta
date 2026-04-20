import { motion } from "motion/react";
import Section from "./Section";
import LiquidEther from "./ui/LiquidEther";

export default function Hero() {
  return (
    <Section id="hero" className="items-center text-center overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <LiquidEther
          colors={[ '#5227FF', '#FF9FFC', '#B497CF' ]}
          mouseForce={20}
          cursorSize={100}
          isViscous={true}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.span 
          className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-widest uppercase glass rounded-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          DevOps & System Administrator
        </motion.span>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          Esta Nur Aliansyah
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-light leading-relaxed mb-12">
          Securing Infrastructure, Architecting Experiences. <br />
          Bridging the gap between robust engineering and visionary design.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-black rounded-full font-medium interactive"
          >
            View Projects
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 glass rounded-full font-medium interactive"
          >
            Contact Me
          </motion.button>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </Section>
  );
}
