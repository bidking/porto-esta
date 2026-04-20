import Section from "./Section";
import { motion } from "motion/react";
import LogoLoop, { LogoItem } from "./ui/LogoLoop";
import { 
  SiNginx, 
  SiDocker, 
  SiLaravel, 
  SiPhp, 
  SiPython, 
  SiPostgresql, 
  SiUbuntu, 
  SiDebian, 
  SiProxmox, 
  SiLinux, 
  SiJavascript, 
  SiTypescript,
  SiReact,
  SiTailwindcss
} from "react-icons/si";

const techLogos: LogoItem[] = [
  { node: <SiNginx />, title: "Nginx" },
  { node: <SiDocker />, title: "Docker" },
  { node: <SiProxmox />, title: "Proxmox" },
  { node: <SiLaravel />, title: "Laravel" },
  { node: <SiPhp />, title: "PHP" },
  { node: <SiPython />, title: "Python" },
  { node: <SiPostgresql />, title: "PostgreSQL" },
  { node: <SiUbuntu />, title: "Ubuntu" },
  { node: <SiDebian />, title: "Debian" },
  { node: <SiLinux />, title: "Linux" },
  { node: <SiJavascript />, title: "JavaScript" },
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiReact />, title: "React" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
];

export default function Skills() {
  return (
    <Section id="skills" className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold tracking-tight mb-4">Tech Stack</h2>
        <p className="text-white/50 max-w-2xl mx-auto">
          The tools and technologies I use to build, deploy, and manage robust infrastructures.
        </p>
      </motion.div>
      
      <div className="relative py-20 flex flex-col gap-12">
        <LogoLoop
          logos={techLogos}
          speed={40}
          direction="left"
          logoHeight={64}
          gap={80}
          hoverSpeed={10}
          scaleOnHover
          fadeOut
          fadeOutColor="#000000"
        />
        
        <LogoLoop
          logos={[...techLogos].reverse()}
          speed={30}
          direction="right"
          logoHeight={64}
          gap={80}
          hoverSpeed={5}
          scaleOnHover
          fadeOut
          fadeOutColor="#000000"
        />
      </div>
    </Section>
  );
}

