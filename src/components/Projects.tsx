import { useState, useEffect } from "react";
import Section from "./Section";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Web Sunatan - Azzam Azahab",
    description: "A professional landing page and booking system for specialized medical services, featuring a clean and modern design.",
    tags: ["React", "Website", "Health"],
    image: "/regenerated_image_1777353709254.png",
    link: "https://keyanu-azzam-azahab.vercel.app/"
  },
  {
    title: "Astro Eye CCTV Bogor",
    description: "Enterprise security solutions landing page. Showcasing surveillance products and installation services for the Bogor region.",
    tags: ["Astro", "Security", "CMS"],
    image: "/regenerated_image_1777353705669.png",
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
    image: "/regenerated_image_1777353702727.png",
    link: "https://web-ex-rpl.vercel.app/"
  },
  {
    title: "Indol Photobooth",
    description: "Interactive digital photobooth application with real-time filters and instant cloud sharing capabilities.",
    tags: ["Photography", "Webcam", "Social"],
    image: "/regenerated_image_1777353712167.png",
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

const gridClasses = [
  "row-span-3", // div1
  "row-span-2", // div3
  "row-span-2 col-start-1 row-start-4", // div4
  "row-span-3 col-start-2 row-start-3", // div5
  "col-span-2 col-start-3 row-start-1", // div7
  "col-span-2 row-span-2 col-start-3 row-start-2", // div8
  "row-span-2 col-start-3 row-start-4", // div9
  "row-span-2 col-start-4 row-start-4", // div10
  "row-span-2 col-start-5 row-start-1", // div11
  "row-span-3 col-start-5 row-start-3", // div13
];

export default function Projects() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
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
            Full digital matrix of engineering artifacts and creative solutions.
          </p>
        </motion.div>
      </div>

      <div className="relative w-full h-full">
        <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-5 gap-4 h-[800px] max-w-7xl mx-auto overflow-y-auto custom-scrollbar pr-2 pb-10">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`${isMobile ? "h-64" : gridClasses[i % gridClasses.length]} group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 cursor-pointer shadow-2xl hover:border-purple-500/50 transition-all duration-500`}
              onClick={() => window.open(project.link, "_blank")}
            >
              <img 
                src={project.image.startsWith('/') ? project.image : `${project.image}&w=800&auto=format&fit=crop`}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-70 grayscale group-hover:grayscale-0"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover:opacity-60 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                <h5 className="text-white font-bold text-xs md:text-sm tracking-tight mb-1 truncate uppercase">{project.title}</h5>
                <div className="flex gap-2">
                   {project.tags.slice(0, 1).map((tag, idx) => (
                     <span key={idx} className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono uppercase">
                       {tag}
                     </span>
                   ))}
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ExternalLink className="w-3.5 h-3.5 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </Section>
  );
}

