import { useState, useEffect } from "react";
import Section from "./Section";
import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";
import CardSwap, { Card } from "./ui/CardSwap";

const projects = [
  {
    title: "Web Sunatan - Azzam Azahab",
    description: "A professional landing page and booking system for specialized medical services, featuring a clean and modern design.",
    tags: ["React", "Website", "Health"],
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
    link: "https://keyanu-azzam-azahab.vercel.app/"
  },
  {
    title: "Astro Eye CCTV Bogor",
    description: "Enterprise security solutions landing page. Showcasing surveillance products and installation services for the Bogor region.",
    tags: ["Astro", "Security", "CMS"],
    image: "https://images.unsplash.com/photo-1557597774-9d2739f85a76?w=800&q=80",
    link: "https://astro-eye.vercel.app"
  },
  {
    title: "All-in-One Downloader",
    description: "A high-performance media downloader utility designed for speed and simplicity across multiple platforms.",
    tags: ["Utility", "Tool", "React"],
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
    link: "https://downloaders-iota.vercel.app/"
  },
  {
    title: "Astro Weather",
    description: "Real-time weather monitoring application with precise location data and dynamic atmospheric visualizations.",
    tags: ["API", "Weather", "Dashboard"],
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80",
    link: "https://astro-weather-idi.vercel.app/"
  },
  {
    title: "RPL Cup System",
    description: "A comprehensive tournament management system for Futsal competitions, handling brackets, scores, and schedules.",
    tags: ["Tournament", "Sports", "System"],
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    link: "https://rplcup.vercel.app/"
  },
  {
    title: "Web EX-RPL SMK",
    description: "Community and alumni platform for SMK students, fostering collaboration and project sharing within the department.",
    tags: ["Education", "Community", "Vue"],
    image: "https://images.unsplash.com/photo-1523050335392-93851179ae22?w=800&q=80",
    link: "https://web-ex-rpl.vercel.app/"
  },
  {
    title: "Indol Photobooth",
    description: "Interactive digital photobooth application with real-time filters and instant cloud sharing capabilities.",
    tags: ["Photography", "Webcam", "Social"],
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    link: "https://photobooth-indol-pi.vercel.app/"
  },
  {
    title: "NGL Spam Tool",
    description: "A high-speed messaging utility for NGL platforms, demonstrating asynchronous request handling and automation.",
    tags: ["Automation", "API", "Tool"],
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
    link: "https://ngl-spam-id.vercel.app/"
  },
  {
    title: "Finance Tracker",
    description: "Personal finance management application with intuitive expense tracking and insightful data analytics.",
    tags: ["Finance", "Accounting", "React"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    link: "https://finace.vercel.app/"
  },
  {
    title: "Xternal Shop UMKM",
    description: "E-commerce platform empowering local MSMEs with modern digital storefronts and simple inventory management.",
    tags: ["UMKM", "E-commerce", "React"],
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
    link: "https://xternal-test.vercel.app/"
  }
];

export default function Projects() {
  const [cardDimensions, setCardDimensions] = useState({ width: 1100, height: 720 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setCardDimensions({ width: 340, height: 480 });
      } else if (w < 768) {
        setCardDimensions({ width: 600, height: 580 });
      } else {
        setCardDimensions({ width: 1100, height: 720 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Section id="projects" className="w-full px-4 md:px-10 lg:px-20 overflow-hidden relative min-h-screen flex flex-col justify-center py-20">
      <div className="z-10 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
      <div className="relative w-full flex justify-center items-center h-[550px] md:h-[800px]">
        <CardSwap
          width={cardDimensions.width}
          height={cardDimensions.height}
          cardDistance={window.innerWidth < 768 ? 20 : 40}
          verticalDistance={window.innerWidth < 768 ? 30 : 50}
          delay={5000}
          pauseOnHover={true}
        >
          {projects.map((project, i) => (
            <Card 
              key={i} 
              className="overflow-hidden border border-white/10 shadow-2xl rounded-2xl transition-shadow hover:shadow-purple-500/10"
            >
              <div className="relative h-full flex flex-col bg-[#0c0c0e]">
                {/* Browser-like Header */}
                <div className="h-12 border-bottom border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 mr-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                    </div>
                    <span className="text-[10px] font-mono font-medium text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-purple-500/60 animate-pulse" />
                       {project.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 mr-4">
                       {project.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[8px] px-2 py-0.5 rounded-md bg-white/5 text-white/20 border border-white/5 uppercase tracking-wider font-bold">
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
                        className="p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all transform hover:scale-110 pointer-events-auto"
                        title="View Source"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all transform hover:scale-110 pointer-events-auto"
                        title="Live Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Visual Content Section */}
                <div className="flex-1 relative overflow-hidden group">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12">
                     <div className="max-w-2xl">
                        <h4 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tighter line-clamp-1">{project.title}</h4>
                        <p className="text-white/70 text-sm md:text-lg font-light leading-relaxed line-clamp-2 md:line-clamp-3 mb-6 md:mb-10 max-w-xl">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center gap-3 md:gap-5 relative z-50">
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="group/btn relative px-5 py-2.5 md:px-8 md:py-4 rounded-xl bg-white text-black text-sm md:text-base font-bold flex items-center gap-2 transition-all hover:translate-y-[-2px] hover:shadow-[0_10px_20px_-5px_rgba(255,255,255,0.4)] active:scale-95 pointer-events-auto shrink-0"
                          >
                            Explore Demo
                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1" />
                          </a>
                          
                          <a 
                            href="https://github.com/estaaliansyah" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all pointer-events-auto hover:translate-y-[-2px]"
                          >
                            <Github className="w-5 h-5 md:w-6 md:h-6" />
                          </a>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </Section>
  );
}
