import Section from "./Section";
import { motion } from "motion/react";

export default function About() {
  return (
    <Section id="about" className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square rounded-3xl overflow-hidden glass p-4"
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-8xl font-bold text-white/10">STA</span>
          </div>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 tracking-tight">The Journey</h2>
          <div className="space-y-6 text-white/70 leading-relaxed">
            <p>
              My journey began at <span className="text-white font-medium">SMKN 1 Cibinong</span>, where I specialized in Software Engineering (RPL). It was here that I first discovered my passion for building systems that last.
            </p>
            <p>
              I honed my skills during an internship at <span className="text-white font-medium">Telkom Witel Bogor</span>, managing critical data and understanding the scale of enterprise infrastructure.
            </p>
            <p>
              Currently, I serve as a <span className="text-white font-medium">DevOps & System Administrator at Gamatechno</span>. I orchestrate complex environments using Nginx, Docker, and Proxmox, ensuring that every deployment is as seamless as it is secure.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
