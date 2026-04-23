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
    <Section id="projects" className="w-full px-4 md:px-10 lg:px-20 overflow-hidden relative min-h-screen flex flex-col justify-center py-20">
      <div className="z-10 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter dark:text-white text-zinc-900 mb-4 transition-colors duration-300">
            Selected <span className="text-purple-500">Creations</span>
          </h2>
          <p className="dark:text-white/40 text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto transition-colors duration-300">
            A showcase of engineering excellence and interactive design. Stacked for exploration.
          </p>
        </motion.div>
      </div>

      {/* Hero Card Stack Area */}
      <div className="relative w-full flex justify-center items-center h-[600px] md:h-[850px]">
        <CardSwap
          width={window.innerWidth < 480 ? 360 : window.innerWidth < 768 ? 640 : 1100}
          height={window.innerWidth < 480 ? 480 : window.innerWidth < 768 ? 580 : 720}
          cardDistance={window.innerWidth < 768 ? 25 : 50}
          verticalDistance={window.innerWidth < 768 ? 35 : 60}
          delay={4500}
          pauseOnHover={true}
        >
          {projects.map((project, i) => (
            <Card 
              key={i} 
              className="overflow-hidden border border-white/10 shadow-2xl rounded-2xl"
            >
              <div className="relative h-full flex flex-col bg-[#0c0c0e]">
                {/* Browser-like Header */}
                <div className="h-14 border-bottom border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 mr-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/50" />
                       <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                       <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-xs font-mono font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                       {project.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex gap-1 mr-4">
                       {project.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-white/30 border border-white/5">
                            {tag}
                          </span>
                       ))}
                    </div>
                    <div className="flex items-center gap-2 border-l border-white/10 pl-4 relative z-50">
                      <a 
                        href="https://github.com/estaaliansyah" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all transform hover:scale-110 pointer-events-auto"
                        title="View Source"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a 
                        href="https://github.com/estaaliansyah" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all transform hover:scale-110 pointer-events-auto"
                        title="Live Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Visual Content Section */}
                <div className="flex-1 relative overflow-hidden group">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Content Overlay - iOS Style */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="max-w-xl"
                     >
                        <h4 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tighter line-clamp-1">{project.title}</h4>
                        <p className="text-white/60 text-xs md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 md:mb-8">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center gap-3 md:gap-4 relative z-50">
                          <a 
                            href="https://github.com/estaaliansyah" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="group/btn relative px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-white text-black text-sm md:text-base font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] pointer-events-auto shrink-0"
                          >
                            Explore Demo
                            <ExternalLink className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1" />
                          </a>
                          
                          <a 
                            href="https://github.com/estaaliansyah" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all pointer-events-auto"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        </div>
                     </motion.div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full -z-10" />
    </Section>
  );
}
