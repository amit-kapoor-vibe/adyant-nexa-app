"use client";

import { motion } from "framer-motion";
import { Terminal, Zap, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient Neural Background */}
      <div className="neural-bg" />
      
      {/* Floating Particles (CSS or basic framer motion elements) */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-[100px] opacity-20"
      />
      
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-700 rounded-full blur-[120px] opacity-20"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-cyan-500/30 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-geist-mono text-sm tracking-widest text-cyan-50 uppercase">Neural Link Active</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-syne font-extrabold uppercase tracking-tighter leading-tight"
        >
          High-Performance Engine <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ice via-cyan-400 to-cyan-800 neural-glow">
            For Digital Growth
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 max-w-2xl font-geist-mono text-lg md:text-xl text-gray-400 leading-relaxed"
        >
          ADYANT NEXA is the ultimate Digital Brand OS. We engineer ultra-fast web experiences, ROI-driven meta architectures, and custom tech tools for digital domination.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center"
        >
          <button className="group relative px-8 py-4 bg-transparent border border-cyan-500 text-cyan-400 font-syne font-bold uppercase tracking-widest overflow-hidden hover:text-void transition-colors duration-300">
            <div className="absolute inset-0 w-full h-full bg-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Initialize Project
            </span>
          </button>
          
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-syne font-bold uppercase tracking-widest hover:bg-white/10 transition-colors duration-300 flex items-center gap-2 justify-center">
            <Terminal className="w-5 h-5 text-gray-400" /> Explore Systems <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        </motion.div>

        {/* Micro-interaction snippet */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 flex gap-12 font-geist-mono text-sm text-gray-500"
        >
          <div className="flex flex-col items-center">
            <span className="text-cyan-400 text-2xl font-bold">0.03s</span>
            <span>DOM Latency</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-cyan-400 text-2xl font-bold">400%</span>
            <span>ROI Scaling</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-cyan-400 text-2xl font-bold">∞</span>
            <span>Scalability</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
