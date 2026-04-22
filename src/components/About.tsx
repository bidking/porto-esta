import Section from "./Section";
import { motion } from "motion/react";
import Lanyard from "./ui/Lanyard";

export default function About() {
  return (
    <Section id="about" className="max-w-none w-full !px-0">
      <div className="w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="h-[500px] md:h-[700px] lg:h-[800px] w-full max-w-[1200px] mx-auto"
        >
          <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-8 tracking-tight dark:text-white text-zinc-900 transition-colors duration-300">The Journey</h2>
          <div className="space-y-6 dark:text-white/70 text-zinc-600 leading-relaxed text-lg transition-colors duration-300">
            <p>
              My journey began at <span className="dark:text-white text-zinc-900 font-medium transition-colors duration-300">SMKN 1 Cibinong</span>, where I specialized in Software Engineering (RPL). It was here that I first discovered my passion for building systems that last.
            </p>
            <p>
              I honed my skills during an internship at <span className="dark:text-white text-zinc-900 font-medium transition-colors duration-300">Telkom Witel Bogor</span>, managing critical data and understanding the scale of enterprise infrastructure.
            </p>
            <p>
              Currently, I serve as a <span className="dark:text-white text-zinc-900 font-medium transition-colors duration-300">DevOps & System Administrator at Gamatechno</span>. I orchestrate complex environments using Nginx, Docker, and Proxmox, ensuring that every deployment is as seamless as it is secure.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}


