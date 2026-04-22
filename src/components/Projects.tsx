import Section from "./Section";
import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";
import CardSwap, { Card } from "./ui/CardSwap";

const projects = [
  {
    title: "AI Gemini Integration",
    description: "A high-performance bridge between enterprise infrastructure and Google's Gemini AI, enabling real-time data orchestration.",
    tags: ["Gemini API", "Node.js", "Docker"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
  },
  {
    title: "E-Commerce Ecosystem",
    description: "Full-stack marketplace architecture with high-availability Nginx load balancing and secure SQL clustering.",
    tags: ["PHP", "Laravel", "MySQL", "Nginx"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80"
  },
  {
    title: "Rail Ticket System",
    description: "Desktop-grade ticketing application with real-time seat synchronization and secure transaction logging.",
    tags: ["Java", "Swing", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80"
  },
  {
    title: "Cloud Infrastructure",
    description: "Enterprise-grade cloud infrastructure management with automated CI/CD and monitoring.",
    tags: ["AWS", "Terraform", "Kubernetes"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
  }
];

export default function Projects() {
  return (
    <Section id="projects" className="max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-16 min-h-[600px]">
        {/* Left Content */}
        <div className="lg:w-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight dark:text-white text-zinc-900 leading-[0.9] transition-colors duration-300">
              Selected <br /> <span className="text-blue-500">Creations</span>
            </h2>
            <p className="dark:text-white/50 text-zinc-600 text-lg max-w-md mb-10 leading-relaxed transition-colors duration-300">
              Engineering high-performance solutions for complex cross-platform challenges. Flip through the stack to explore more.
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/bidking" 
                target="_blank" 
                rel="no-referrer"
                className="px-8 py-4 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
              >
                Browse GitHub
              </a>
              <button className="p-4 rounded-full glass dark:text-white text-zinc-900 border border-white/10 hover:bg-white/10 transition-all">
                <ExternalLink className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Content - CardSwap */}
        <div className="lg:w-1/2 relative w-full flex justify-center lg:justify-end h-[500px] md:h-[600px]">
          <CardSwap
            width={window.innerWidth < 768 ? 320 : 450}
            height={window.innerWidth < 768 ? 420 : 550}
            cardDistance={window.innerWidth < 768 ? 30 : 60}
            verticalDistance={window.innerWidth < 768 ? 40 : 70}
            delay={4000}
            pauseOnHover={true}
          >
            {projects.map((project, i) => (
              <Card 
                key={i} 
                className="overflow-hidden border-white/5 shadow-2xl"
              >
                <div className="relative h-full flex flex-col bg-zinc-950">
                  <div className="h-2/5 relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">Case Study 0{i+1}</span>
                      <div className="flex gap-3">
                        <button className="text-white/40 hover:text-white transition-colors">
                          <Github className="w-5 h-5" />
                        </button>
                        <button className="text-white/40 hover:text-white transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </Section>
  );
}
