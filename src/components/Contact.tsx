import Section from "./Section";
import { motion } from "motion/react";
import { Mail, Github, Linkedin, Instagram } from "lucide-react";

export default function Contact() {
  return (
    <Section id="contact" className="items-center text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 tracking-tight dark:text-white text-zinc-900 transition-colors duration-300">Direct Link</h2>
        <p className="dark:text-white/50 text-zinc-600 mb-12 leading-relaxed transition-colors duration-300">
          Available for collaborations, infrastructure audits, or just a technical chat. Let's build the future of the web together.
        </p>
        
        <div className="flex justify-center gap-6 mb-16">
          {[
            { icon: Github, href: "https://github.com/bidking", label: "GitHub" },
            { 
              icon: Linkedin, 
              href: "https://www.linkedin.com/in/esta-nur-aliansyah-5b6647307?utm_source=share_via&utm_content=profile&utm_medium=member_android", 
              label: "LinkedIn" 
            },
            { 
              icon: Instagram, 
              href: "https://www.instagram.com/astrolynx._?igsh=MXR0bWhqZGpvejRsYQ==", 
              label: "Instagram" 
            },
            { icon: Mail, href: "mailto:estaaliansyah@gmail.com", label: "Email" },
          ].map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="p-4 glass rounded-2xl interactive group transition-all duration-300"
            >
              <social.icon className="w-6 h-6 dark:text-white/60 text-zinc-500 dark:group-hover:text-white group-hover:text-zinc-900 transition-colors" />
            </motion.a>
          ))}
        </div>
        
        <div className="glass p-1 rounded-full inline-flex items-center gap-4 pr-6 pl-2 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <span className="text-sm font-medium dark:text-white/80 text-zinc-700 transition-colors duration-300">Available for new opportunities</span>
        </div>
      </div>
    </Section>
  );
}
