import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, prefillData?: any) => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      step: 1,
      tab: 'chat',
      title: 'Problem Detection: ₹2,500 Unexplained Broker Fee',
      description: 'Investor spots an unexplained ₹2,500 deduction marked as "Sundry Admin Fee" in their ledger.',
      badge: 'Step 1: Confusion',
      visual: 'Disputed Entry: ₹2,500.00 Dr (Zerodha Broking Ltd)'
    },
    {
      step: 2,
      tab: 'document',
      title: 'Document Intelligence: Line-Item Audit',
      description: 'Document Studio scans ledger extract, isolates the ₹2,500 charge, and identifies lack of statutory invoice.',
      badge: 'Step 2: Evidence Audit',
      visual: 'Extracted: Zerodha Broking | Charge: ₹2,500.00 | Date: 14-Mar-2024'
    },
    {
      step: 3,
      tab: 'chat',
      title: 'RAG Grounding: Verified Statutory Circular',
      description: 'RAG pipeline queries verified knowledge base, retrieving SEBI Circular on Charge Disclosures.',
      badge: 'Step 3: Rights Check',
      visual: 'Source: SEBI Circular on Brokerage Transparency | Relevance: 92%'
    },
    {
      step: 4,
      tab: 'grievance',
      title: 'Evidence Completeness Engine: 72% Ready',
      description: 'System checks evidence checklist: Ledger (✓), Contract Note (✓). Flags missing Agreed Tariff Sheet.',
      badge: 'Step 4: Readiness Check',
      visual: 'Evidence Completeness: 72% | Next Action: Attach signed tariff schedule'
    },
    {
      step: 5,
      tab: 'grievance',
      title: 'Complaint Drafting & Quality Score: 88/100',
      description: 'Complaint Engine drafts formal legal notice. Complaint Quality Evaluator scores it 88/100 (EXCELLENT).',
      badge: 'Step 5: Drafting',
      visual: 'Quality Score: 88/100 | Clean PDF Ready for Download'
    },
    {
      step: 6,
      tab: 'tracker',
      title: 'Statutory 21-Day Tracker & SCORES Escalation',
      description: 'Lifecycle Tracker initiates statutory 21-day timeline under SCORES 2.0 protocol with automated escalation readiness.',
      badge: 'Step 6: Resolution',
      visual: 'Complaint #INV-10234 Active | 14 Days Remaining | SEBI Escalation Ready'
    }
  ];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 4500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const activeStepData = steps[currentStep];

  const handleJumpToModule = () => {
    onClose();
    onNavigate(activeStepData.tab, {
      entity: 'Zerodha Broking Limited',
      category: 'Unauthorized charges',
      amount: '2500',
      date: '2024-03-14',
      description: 'Unexplained ledger debit of ₹2,500 marked as sundry admin charge without prior tariff sheet disclosure.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                1-Click Investor Demo
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  Demo Mode
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Scenario: Retail investor notices an unexplained ₹2,500 broker debit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="px-5 pt-4 pb-2">
          <div className="grid grid-cols-6 gap-2">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-emerald-600'
                    : idx < currentStep
                    ? 'bg-emerald-300'
                    : 'bg-slate-200'
                }`}
                title={s.title}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>Stage {currentStep + 1} of 6</span>
            <span className="text-emerald-700 font-semibold">{activeStepData.badge}</span>
          </div>
        </div>

        {/* Step Details Body */}
        <div className="p-5 space-y-3.5 flex-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-900">
              {activeStepData.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeStepData.description}
            </p>

            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{activeStepData.visual}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {isPlaying ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setIsPlaying(true);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleJumpToModule}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1"
            >
              <span>Jump to this Screen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
