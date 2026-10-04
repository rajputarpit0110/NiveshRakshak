import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Landmark,
  Scale
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardHero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-emerald-100/50 border border-emerald-100/90 p-6 sm:p-8 shadow-2xs">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Content */}
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <span>Good Morning, Rohan!</span>
            <span className="text-base animate-bounce">👋</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Let's protect your <span className="text-emerald-700">investments</span> today.
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Get guidance, detect risks, analyze documents and resolve grievances — all in one place.
          </p>

          {/* 4 Trust Badges matching screenshot */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Verified SEBI, NSE, BSE & RBI Sources</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>No fabricated information</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Your data is private & secure</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs">
              <Scale className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>AI guidance, not legal advice</span>
            </div>
          </div>
        </div>

        {/* Right 3D Emblem Illustration matching the user's screenshot */}
        <div className="relative w-48 h-40 sm:w-56 sm:h-48 shrink-0 flex items-center justify-center">
          {/* Soft background green circle */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-200/60 to-teal-100/40 blur-md"></div>
          
          {/* Subtle architectural bank outline */}
          <div className="absolute opacity-20 text-emerald-900 pointer-events-none">
            <Landmark className="w-32 h-32" />
          </div>

          {/* Main Shield with Rupee symbol */}
          <motion.div 
            animate={{ y: [-3, 3, -3] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative z-10 w-20 h-24 rounded-2xl bg-gradient-to-b from-emerald-600 to-teal-800 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-700/30 border-2 border-emerald-300/40"
          >
            <ShieldCheck className="w-6 h-6 text-emerald-200 mb-0.5" />
            <span className="text-2xl font-black tracking-tight">₹</span>
          </motion.div>

          {/* Floating Pill Badges: SEBI, RBI, NSE, BSE */}
          <motion.div 
            animate={{ y: [-2, 2, -2] }} 
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.2 }}
            className="absolute top-2 left-6 z-20 px-2 py-0.5 rounded-md bg-white text-emerald-900 font-extrabold text-[10px] shadow-sm border border-emerald-100"
          >
            SEBI
          </motion.div>

          <motion.div 
            animate={{ y: [2, -2, 2] }} 
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-5 right-4 z-20 px-2 py-0.5 rounded-md bg-white text-emerald-900 font-extrabold text-[10px] shadow-sm border border-emerald-100"
          >
            RBI
          </motion.div>

          <motion.div 
            animate={{ y: [-2, 2, -2] }} 
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.7 }}
            className="absolute bottom-6 left-4 z-20 px-2 py-0.5 rounded-md bg-white text-emerald-900 font-extrabold text-[10px] shadow-sm border border-emerald-100"
          >
            NSE
          </motion.div>

          <motion.div 
            animate={{ y: [2, -2, 2] }} 
            transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-4 right-6 z-20 px-2 py-0.5 rounded-md bg-white text-emerald-900 font-extrabold text-[10px] shadow-sm border border-emerald-100"
          >
            BSE
          </motion.div>
        </div>

      </div>
    </div>
  );
};
