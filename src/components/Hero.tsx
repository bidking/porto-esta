import { motion } from "motion/react";
import Section from "./Section";
import LiquidEther from "./ui/LiquidEther";
import GradualBlur from "./ui/GradualBlur";

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
          iterationsViscous={16}
          iterationsPoisson={16}
          resolution={0.4}
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
        
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-white/40 from-zinc-900 to-zinc-600 transition-colors duration-300">
          Esta Nur Aliansyah
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl dark:text-white/60 text-zinc-600 font-light leading-relaxed mb-12 transition-colors duration-300">
          Securing Infrastructure, Architecting Experiences. <br />
          Bridging the gap between robust engineering and visionary design.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 dark:bg-white dark:text-black bg-zinc-900 text-white rounded-full font-medium interactive transition-all duration-300"
          >
            View Projects
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 glass dark:text-white text-zinc-900 rounded-full font-medium interactive transition-all duration-300 shadow-sm"
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

      <GradualBlur
        target="parent"
        position="bottom"
        height="12rem"
        strength={3}
        divCount={10}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </Section>
  );
}
