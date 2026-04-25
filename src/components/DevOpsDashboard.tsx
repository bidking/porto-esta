import Section from "./Section";
import { motion } from "motion/react";
import { Activity, Cpu, HardDrive, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function DevOpsDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [metrics, setMetrics] = useState({
    cpu: 45,
    ram: 62,
    uptime: "99.99%",
    requests: 1240
  });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 20) + 30,
        ram: Math.floor(Math.random() * 10) + 55,
        requests: prev.requests + Math.floor(Math.random() * 5)
      }));
    }, window.innerWidth < 768 ? 5000 : 3000);
    return () => clearInterval(interval);
  }, []);

  const barCount = isMobile ? 12 : 24;

  return (
    <Section id="dashboard" className="max-w-6xl mx-auto px-6">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4 tracking-tight dark:text-white text-zinc-900 transition-colors duration-300">The Pulse</h2>
        <p className="dark:text-white/50 text-zinc-600 transition-colors duration-300">Real-time infrastructure orchestration metrics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { label: "CPU Usage", value: `${metrics.cpu}%`, icon: Cpu, color: "text-purple-500" },
          { label: "RAM Usage", value: `${metrics.ram}%`, icon: Activity, color: "text-purple-600" },
          { label: "Uptime", value: metrics.uptime, icon: Zap, color: "text-emerald-500" },
          { label: "Active Req", value: metrics.requests, icon: HardDrive, color: "text-violet-500" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass p-4 md:p-6 rounded-2xl md:rounded-3xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.color}`} />
              <span className="text-[10px] font-mono dark:text-white/30 text-zinc-400">LIVE</span>
            </div>
            <div className="text-lg md:text-2xl font-bold mb-1 dark:text-white text-zinc-900 transition-colors duration-300">{item.value}</div>
            <div className="text-[10px] dark:text-white/40 text-zinc-500 uppercase tracking-widest transition-colors duration-300">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass p-6 md:p-8 rounded-[30px] md:rounded-[40px] h-[300px] md:h-[400px] relative overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 flex items-end px-4 md:px-8 pb-8 gap-1.5 md:gap-2">
          {Array.from({ length: barCount }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-500/40 to-violet-500/40 rounded-t-sm md:rounded-t-lg"
              initial={{ height: "20%" }}
              animate={{ height: `${Math.random() * 60 + 20}%` }}
              transition={{ 
                duration: isMobile ? 3 : 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-mono dark:text-white/60 text-zinc-600 transition-colors duration-300">Server Cluster: Gamatechno-Node-01</span>
          </div>
          <div className="text-sm font-mono dark:text-white/40 text-zinc-500 transition-colors duration-300">
            $ nginx -v <br />
            nginx version: nginx/1.24.0 (Ubuntu) <br />
            $ docker ps <br />
            CONTAINER ID   IMAGE          STATUS          PORTS <br />
            7a8b9c0d1e2f   sta-portfolio  Up 45 hours     0.0.0.0:80-{"->"}80/tcp
          </div>
        </div>
      </div>
    </Section>
  );
}
