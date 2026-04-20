import Section from "./Section";
import { motion } from "motion/react";
import Lanyard from "./ui/Lanyard";

export default function About() {
  return (
    <Section id="about" className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="h-[500px]"
        >
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-8 tracking-tight">The Journey</h2>
          <div className="space-y-6 text-white/70 leading-relaxed text-lg">
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


