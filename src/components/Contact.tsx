import Section from "./Section";
import { motion } from "motion/react";
import { Mail, Github, Linkedin, Instagram } from "lucide-react";

export default function Contact() {
  return (
    <Section id="contact" className="items-center text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 tracking-tight">Direct Link</h2>
        <p className="text-white/50 mb-12 leading-relaxed">
          Available for collaborations, infrastructure audits, or just a technical chat. Let's build the future of the web together.
        </p>
        
        <div className="flex justify-center gap-6 mb-16">
          {[
            { icon: Github, href: "#", label: "GitHub" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
            { icon: Instagram, href: "#", label: "Instagram" },
            { icon: Mail, href: "mailto:estaaliansyah@gmail.com", label: "Email" },
          ].map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="p-4 glass rounded-2xl interactive group"
            >
              <social.icon className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
            </motion.a>
          ))}
        </div>
        
        <div className="glass p-1 rounded-full inline-flex items-center gap-4 pr-6 pl-2">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <span className="text-sm font-medium text-white/80">Available for new opportunities</span>
        </div>
      </div>
    </Section>
  );
}
