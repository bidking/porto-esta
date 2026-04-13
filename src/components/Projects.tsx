import Section from "./Section";
import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "AI Gemini Integration",
    description: "A high-performance bridge between enterprise infrastructure and Google's Gemini AI, enabling real-time data orchestration.",
    tags: ["Gemini API", "Node.js", "Docker"],
    image: "https://picsum.photos/seed/ai/800/600"
  },
  {
    title: "E-Commerce Ecosystem",
    description: "Full-stack marketplace architecture with high-availability Nginx load balancing and secure SQL clustering.",
    tags: ["PHP", "Laravel", "MySQL", "Nginx"],
    image: "https://picsum.photos/seed/ecommerce/800/600"
  },
  {
    title: "Rail Ticket System",
    description: "Desktop-grade ticketing application with real-time seat synchronization and secure transaction logging.",
    tags: ["Java", "Swing", "PostgreSQL"],
    image: "https://picsum.photos/seed/train/800/600"
  }
];

export default function Projects() {
  return (
    <Section id="projects" className="max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Holographic Showcase</h2>
        <p className="text-white/50">Engineering solutions for complex problems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ y: -10 }}
            className="group glass rounded-[32px] overflow-hidden flex flex-col interactive"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/10 text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="text-xl font-bold mb-4">{project.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-8 flex-1">
                {project.description}
              </p>
              
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-full glass hover:bg-white/20 transition-colors">
                  <Github className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full glass hover:bg-white/20 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
