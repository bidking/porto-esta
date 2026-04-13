import Section from "./Section";
import { motion } from "motion/react";
import { Server, Database, Code, Shield, Cpu, Cloud } from "lucide-react";

const skills = [
  { name: "Nginx", icon: Server, color: "text-green-400" },
  { name: "Docker", icon: Cloud, color: "text-blue-400" },
  { name: "Proxmox", icon: Cpu, color: "text-orange-400" },
  { name: "Laravel", icon: Code, color: "text-red-400" },
  { name: "SQL", icon: Database, color: "text-yellow-400" },
  { name: "Security", icon: Shield, color: "text-purple-400" },
];

export default function Skills() {
  return (
    <Section id="skills" className="items-center">
      <h2 className="text-4xl font-bold mb-16 tracking-tight text-center">Tech Orbit</h2>
      
      <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border border-white/5 animate-pulse" />
          <div className="absolute w-96 h-96 rounded-full border border-white/5" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="glass p-8 rounded-3xl flex flex-col items-center gap-4 interactive group"
            >
              <skill.icon className={`w-12 h-12 ${skill.color} transition-transform group-hover:rotate-12`} />
              <span className="font-medium text-white/80">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
