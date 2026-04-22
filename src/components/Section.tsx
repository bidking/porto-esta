import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className, id }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-x-hidden", className)}
    >
      {children}
    </motion.section>
  );
}
