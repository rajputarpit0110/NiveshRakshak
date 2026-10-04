import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  Paperclip, 
  Send, 
  ChevronRight, 
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';

interface RightSidebarProps {
  onNavigate: (tab: string, prefillData?: any) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigate }) => {
  const [quickInput, setQuickInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);

  const promptPills = [
    "Can my broker deduct fees without notice?",
    "What is the grievance process for broker issues?",
    "Is this investment offer safe?",
    "Explain my rights for unauthorized charges"
  ];

  const handleQuickAsk = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setChatAnswer(null);
    try {
      const resp = await api.askRAG(text);
      setChatAnswer(resp.answer);
    } catch {
      onNavigate('chat', { query: text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-80 lg:w-[330px] space-y-4 shrink-0">
      
      {/* 1. Investor Safety Score (Dark Green Card) */}
      <div className="rounded-2xl bg-[#064e3b] text-white p-5 shadow-sm relative overflow-hidden">
        {/* Subtle radial aura */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-xs font-semibold text-emerald-100">Investor Safety Score</span>
          <div className="w-8 h-8 rounded-full bg-emerald-800/80 flex items-center justify-center text-amber-300 shadow-inner">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2 relative z-10">
          <span className="text-4xl font-extrabold tracking-tight">82</span>
          <span className="text-sm font-medium text-emerald-300">/ 100</span>
          <span className="ml-auto text-[10px] font-semibold bg-emerald-800/90 text-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-700/60">
            <span>↑ +6 this month</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-emerald-950/80 rounded-full h-2 mb-3 relative z-10">
          <div 
            className="bg-emerald-400 h-2 rounded-full transition-all duration-700 shadow-xs" 
            style={{ width: '82%' }}
          ></div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-100 mb-1 relative z-10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span className="font-bold">Strong</span>
        </div>

        <p className="text-[11px] text-emerald-200/90 leading-relaxed mb-4 relative z-10">
          You're doing well! Complete 2 modules to reach 90+.
        </p>

        <button 
          onClick={() => onNavigate('academy')} 
          className="text-xs font-bold text-emerald-100 hover:text-white flex items-center gap-1.5 transition-colors group relative z-10"
        >
          <span>View Detailed Report</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 2. Immediate Action Required Card */}
      <div className="rounded-2xl bg-white border border-red-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Immediate Action Required</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-red-400" />
        </div>
        
        <h5 className="text-xs font-bold text-slate-900 mb-1">
          Upload broker fee schedule
        </h5>
        
        <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
          Attaching your agreed schedule of charges will strengthen complaint #INV-10234.
        </p>

        <button 
          onClick={() => onNavigate('document', { autoSelect: 'broker_schedule' })}
          className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
        >
          Upload Now
        </button>
      </div>

      {/* 3. Your Next Best Actions */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-xs font-bold text-slate-900">Your Next Best Actions</h5>
          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onNavigate('document')}
            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                Complete evidence for #INV-10234
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                +15 score
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('academy')}
            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                Take Scam Awareness module
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                +10 score
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('scam')}
            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                Verify entity before next investment
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                +10 score
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. Chat with NiveshRakshak (Quick Chatbot Box) */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 leading-none">
              Chat with Nivesh<span className="text-emerald-700">Rakshak</span>
            </h5>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mb-3">
          Get instant guidance from verified regulations and circulars.
        </p>

        {/* Suggestion Pills */}
        <div className="space-y-1.5 mb-3">
          {promptPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAsk(pill)}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/70 hover:border-emerald-200 text-[11px] text-slate-700 hover:text-emerald-900 transition-colors line-clamp-1"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Live Answer Dropdown if asked */}
        {loading && (
          <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>Consulting 354 regulatory chunks...</span>
          </div>
        )}

        {chatAnswer && !loading && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-emerald-900 text-[11px]">
              <span>Verified Guidance</span>
              <button 
                onClick={() => setChatAnswer(null)}
                className="text-[10px] text-slate-400 hover:text-slate-600"
              >
                Dismiss
              </button>
            </div>
            <p className="text-[11px] leading-relaxed max-h-32 overflow-y-auto">
              {chatAnswer}
            </p>
            <button
              onClick={() => onNavigate('chat')}
              className="text-[10px] font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>Open in Rights Assistant for full citations</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuickAsk(quickInput);
          }}
          className="relative flex items-center"
        >
          <span className="absolute left-3 text-slate-400">
            <Paperclip className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Ask your question..."
            className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-full pl-8 pr-9 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!quickInput.trim() || loading}
            className="absolute right-1 w-7 h-7 rounded-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white flex items-center justify-center transition-all"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>

    </aside>
  );
};
