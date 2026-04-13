import Section from "./Section";
import { motion } from "motion/react";
import { Activity, Cpu, HardDrive, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function DevOpsDashboard() {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    ram: 62,
    uptime: "99.99%",
    requests: 1240
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 20) + 30,
        ram: Math.floor(Math.random() * 10) + 55,
        requests: prev.requests + Math.floor(Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="dashboard" className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">The Pulse</h2>
        <p className="text-white/50">Real-time infrastructure orchestration metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "CPU Usage", value: `${metrics.cpu}%`, icon: Cpu, color: "text-blue-400" },
          { label: "RAM Usage", value: `${metrics.ram}%`, icon: Activity, color: "text-purple-400" },
          { label: "Uptime", value: metrics.uptime, icon: Zap, color: "text-green-400" },
          { label: "Active Req", value: metrics.requests, icon: HardDrive, color: "text-orange-400" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <span className="text-xs font-mono text-white/30">LIVE</span>
            </div>
            <div className="text-2xl font-bold mb-1">{item.value}</div>
            <div className="text-xs text-white/40 uppercase tracking-widest">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass p-8 rounded-[40px] h-[400px] relative overflow-hidden">
        <div className="absolute inset-0 flex items-end px-8 pb-8 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-500/40 to-purple-500/40 rounded-t-lg"
              initial={{ height: "20%" }}
              animate={{ height: `${Math.random() * 60 + 20}%` }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                delay: i * 0.1
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-mono text-white/60">Server Cluster: Gamatechno-Node-01</span>
          </div>
          <div className="text-sm font-mono text-white/40">
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
