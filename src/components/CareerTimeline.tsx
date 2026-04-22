import Section from "./Section";
import { motion } from "motion/react";

const timeline = [
  {
    year: "2024 - Present",
    role: "DevOps & System Administrator",
    company: "Gamatechno",
    description: "Orchestrating server infrastructure, managing Docker clusters, and optimizing Nginx configurations for high-traffic applications."
  },
  {
    year: "2023",
    role: "Data Management Intern",
    company: "Telkom Witel Bogor",
    description: "Assisted in enterprise data management and infrastructure monitoring for regional network operations."
  },
  {
    year: "2020 - 2023",
    role: "Software Engineering Student",
    company: "SMKN 1 Cibinong",
    description: "Foundation in software development, focusing on PHP, Java, and database architecture."
  }
];

export default function CareerTimeline() {
  return (
    <Section id="career" className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-16 tracking-tight text-center dark:text-white text-zinc-900 transition-colors duration-300">Vertical Glass Terminal</h2>
      
      <div className="relative border-l dark:border-white/10 border-zinc-200 ml-4 md:ml-0 md:left-1/2 transition-colors duration-300">
        {timeline.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className={`relative mb-12 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right md:left-[-50%]" : "md:pl-12 md:left-[50%]"}`}
          >
            <div className={`absolute top-0 w-4 h-4 rounded-full dark:bg-white bg-zinc-900 dark:border-black border-slate-50 border-4 z-10 transition-colors duration-300 ${i % 2 === 0 ? "right-[-8px] md:right-[-8px]" : "left-[-8px] md:left-[-8px]"}`} />
            
            <div className="glass p-8 rounded-3xl interactive transition-all duration-300">
              <span className="text-xs font-mono dark:text-white/40 text-zinc-500 mb-2 block transition-colors duration-300">{item.year}</span>
              <h3 className="text-xl font-bold mb-1 dark:text-white text-zinc-900 transition-colors duration-300">{item.role}</h3>
              <div className="text-blue-500 dark:text-blue-400 text-sm font-medium mb-4 transition-colors duration-300">{item.company}</div>
              <p className="text-sm dark:text-white/60 text-zinc-600 leading-relaxed transition-colors duration-300">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
