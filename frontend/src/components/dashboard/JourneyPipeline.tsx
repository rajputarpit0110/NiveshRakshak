import React from 'react';
import { 
  Play, 
  HelpCircle, 
  ShieldCheck, 
  Scale, 
  FileSearch, 
  FileText, 
  Clock, 
  AlertOctagon, 
  CheckCircle2,
  FolderGit2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyPipelineProps {
  onNavigate: (tab: string, prefillData?: any) => void;
  onLaunchDemo: () => void;
}

export const JourneyPipeline: React.FC<JourneyPipelineProps> = ({ onNavigate, onLaunchDemo }) => {
  const steps = [
    {
      id: 'chat',
      num: '01',
      title: 'Confusion',
      subtitle: 'Ask a question',
      icon: HelpCircle,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
    },
    {
      id: 'chat',
      num: '02',
      title: 'AI Grounding',
      subtitle: 'Verified sources',
      icon: ShieldCheck,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-300',
    },
    {
      id: 'scam',
      num: '03',
      title: 'Risk Detection',
      subtitle: 'Detect issues',
      icon: Scale,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
    },
    {
      id: 'document',
      num: '04',
      title: 'Evidence',
      subtitle: 'Document audit',
      icon: FileSearch,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-300',
    },
    {
      id: 'grievance',
      num: '05',
      title: 'Complaint',
      subtitle: 'Draft & score',
      icon: FileText,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
    },
    {
      id: 'tracker',
      num: '06',
      title: 'Tracking',
      subtitle: 'Real-time status',
      icon: Clock,
      color: 'text-cyan-700',
      bg: 'bg-cyan-50',
      border: 'border-cyan-300',
    },
    {
      id: 'grievance',
      num: '07',
      title: 'Escalation',
      subtitle: 'Next steps',
      icon: AlertOctagon,
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-300',
    },
    {
      id: 'trust',
      num: '08',
      title: 'Resolution',
      subtitle: 'Close the loop',
      icon: CheckCircle2,
      color: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-300',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
              Your Investor Protection Journey
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              From confusion to complaint to resolution — click any step to get started.
            </p>
          </div>
        </div>

        {/* Demo Button matching screenshot */}
        <button
          onClick={onLaunchDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 transition-all text-xs font-semibold shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center">
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </div>
          <span>Complete Journey</span>
          <span className="text-slate-400 font-normal">~ 2 mins demo</span>
        </button>
      </div>

      {/* Pipeline 8 Steps */}
      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[760px] flex items-center justify-between relative px-2">
          
          {/* Connecting dotted line behind circles */}
          <div className="absolute left-8 right-8 top-5 h-[2px] border-t-2 border-dashed border-slate-200 z-0 pointer-events-none"></div>

          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.num}
                whileHover={{ y: -3, scale: 1.05 }}
                onClick={() => onNavigate(s.id)}
                className="relative z-10 flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                {/* Numbered Circle Icon */}
                <div className={`w-10 h-10 rounded-full ${s.bg} ${s.border} border-2 ${s.color} flex items-center justify-center shadow-xs transition-shadow group-hover:shadow-md mb-2`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Step Number & Title */}
                <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-700 tracking-wider">
                  {s.num}
                </span>
                <span className="text-xs font-extrabold text-slate-800 group-hover:text-slate-900 leading-tight">
                  {s.title}
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                  {s.subtitle}
                </span>
              </motion.button>
            );
          })}

        </div>
      </div>

    </div>
  );
};
