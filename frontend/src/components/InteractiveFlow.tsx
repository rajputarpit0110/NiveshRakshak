import React from 'react';
import { 
  UserCheck, 
  BrainCircuit, 
  BookMarked, 
  Scale, 
  CheckSquare, 
  ArrowRight, 
  FileText, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

interface InteractiveFlowProps {
  onNavigate: (tab: string, prefillData?: any) => void;
}

export const InteractiveFlow: React.FC<InteractiveFlowProps> = ({ onNavigate }) => {
  const steps = [
    { 
      id: 'chat', 
      stepNum: 1,
      label: 'Confusion', 
      sub: 'Rights Query', 
      icon: UserCheck, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50/80',
      borderHover: 'hover:border-blue-300'
    },
    { 
      id: 'chat', 
      stepNum: 2,
      label: 'AI Grounding', 
      sub: '354 Chunks', 
      icon: BrainCircuit, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50/80',
      borderHover: 'hover:border-purple-300'
    },
    { 
      id: 'scam', 
      stepNum: 3,
      label: 'Risk Radar', 
      sub: 'Detect Fraud', 
      icon: Scale, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50/80',
      borderHover: 'hover:border-amber-300'
    },
    { 
      id: 'document', 
      stepNum: 4,
      label: 'Evidence Audit', 
      sub: 'Ledger Audit', 
      icon: CheckSquare, 
      color: 'text-cyan-600', 
      bg: 'bg-cyan-50/80',
      borderHover: 'hover:border-cyan-300'
    },
    { 
      id: 'grievance', 
      stepNum: 5,
      label: 'Complaint', 
      sub: 'Quality Score', 
      icon: FileText, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50/80',
      borderHover: 'hover:border-emerald-300'
    },
    { 
      id: 'tracker', 
      stepNum: 6,
      label: 'Lifecycle', 
      sub: '21-Day Clock', 
      icon: Clock, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50/80',
      borderHover: 'hover:border-indigo-300'
    },
    { 
      id: 'tracker', 
      stepNum: 7,
      label: 'Escalation', 
      sub: 'SCORES 2.0', 
      icon: BookMarked, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50/80',
      borderHover: 'hover:border-rose-300'
    },
    { 
      id: 'academy', 
      stepNum: 8,
      label: 'Resolution', 
      sub: 'Safety Loop', 
      icon: CheckCircle2, 
      color: 'text-teal-600', 
      bg: 'bg-teal-50/80',
      borderHover: 'hover:border-teal-300'
    }
  ];

  return (
    <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative group">
              <button
                onClick={() => onNavigate(step.id)}
                className={`w-full p-3 rounded-xl bg-white border border-slate-200/90 ${step.borderHover} hover:shadow-md hover:-translate-y-0.5 flex flex-col items-center text-center transition-all duration-200 cursor-pointer`}
              >
                {/* Step number badge */}
                <div className="w-full flex items-center justify-between mb-1 text-[10px] text-slate-400 font-mono">
                  <span>0{step.stepNum}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-500 transition-colors"></span>
                </div>

                <div className={`w-8 h-8 rounded-lg ${step.bg} flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110`}>
                  <Icon className={`w-4 h-4 ${step.color}`} />
                </div>

                <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-slate-900">
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 leading-tight font-medium">
                  {step.sub}
                </span>
              </button>

              {/* Connecting arrow for larger screens */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-slate-300">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
