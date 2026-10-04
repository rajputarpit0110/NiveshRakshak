import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  FileSearch,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  FileText,
  Search,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { InteractiveFlow } from './InteractiveFlow';

interface CommandCenterProps {
  onNavigate: (tab: string, prefillData?: any) => void;
  onLaunchDemo: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate, onLaunchDemo }) => {
  const [quickSearch, setQuickSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;
    onNavigate('chat');
  };

  return (
    <div className="space-y-6">
      {/* Elevated Modern Hero Section */}
      <div className="relative overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Soft decorative background tint */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-6">
          {/* Top meta strip */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Protection Active</span>
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                UCC-78901 • Zerodha Broking
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                354 Statutory Chunks Verified
              </span>
            </div>
          </div>

          {/* Main Greeting & Value Proposition */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Welcome back, <span className="text-emerald-700">Rohan</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                Your capital safeguards and statutory redressal timelines are active. All guidance is grounded exclusively in verified SEBI, NSE, and RBI circulars.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onLaunchDemo}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>1-Click Investor Demo</span>
              </button>
            </div>
          </div>

          {/* Quick Regulatory Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Ask any question... (e.g. 'Can my broker deduct fees without a contract note?')"
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl pl-11 pr-24 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* AI Next Best Action Card (Elevated Left-Accent Card) */}
        <div className="relative z-10 mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-white border border-emerald-200/90 border-l-4 border-l-emerald-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  RECOMMENDED ACTION
                </span>
                <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  72% Evidence Ready
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                Upload broker fee schedule for complaint #INV-10234
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Attaching your agreed schedule of charges legally binds the broker under SEBI's 2023 Brokerage Transparency Circular.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('document')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Evidence
            </button>
            <button
              onClick={() => onNavigate('tracker')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shadow-2xs"
            >
              View Timeline
            </button>
          </div>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Safety Score */}
        <div 
          onClick={() => onNavigate('academy')}
          className="fintech-card-hover p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Investor Safety Score</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">82</span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '82%' }}></div>
          </div>
          <p className="text-[11px] text-emerald-700 mt-2 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +6 pts since last adaptive challenge
          </p>
        </div>

        {/* Metric 2: Active Grievances */}
        <div 
          onClick={() => onNavigate('tracker')}
          className="fintech-card-hover p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Active Dispute</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">1</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              #INV-10234
            </span>
          </div>
          <p className="text-xs text-slate-700 mt-2 font-medium">
            Under Zerodha Review
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5 font-medium">
            14 days remaining before SCORES
          </p>
        </div>

        {/* Metric 3: Statements Audited */}
        <div 
          onClick={() => onNavigate('document')}
          className="fintech-card-hover p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Statements Audited</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">1</span>
            <span className="text-xs text-slate-400 font-medium">Ledger file</span>
          </div>
          <p className="text-xs text-slate-700 mt-2 font-medium">
            1 Potential Issue Flagged
          </p>
          <p className="text-[11px] text-rose-600 mt-0.5 font-semibold">
            ₹2,500 Unexplained debit
          </p>
        </div>

        {/* Metric 4: Risk Alerts */}
        <div 
          onClick={() => onNavigate('scam')}
          className="fintech-card-hover p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-medium">Scam Radar</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">1</span>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              High Risk
            </span>
          </div>
          <p className="text-xs text-slate-700 mt-2 font-medium truncate">
            Telegram advisory flagged
          </p>
          <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
            Protected • Zero funds lost
          </p>
        </div>
      </div>

      {/* Interactive System Flow Architecture */}
      <div className="fintech-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Interactive Investor Operating System</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any stage node to jump directly into the corresponding module.</p>
          </div>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full hidden sm:inline">
            Flow: Confusion → Complaint → Resolution
          </span>
        </div>
        <InteractiveFlow onNavigate={onNavigate} />
      </div>

      {/* Quick Launch Tool Cards (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tool 1 */}
        <div 
          onClick={() => onNavigate('chat')}
          className="fintech-card-hover p-5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <FileSearch className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
            <span>Rights Assistant</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Ask regulatory queries strictly cited from 354 verified SEBI & exchange circulars.
          </p>
        </div>

        {/* Tool 2 */}
        <div 
          onClick={() => onNavigate('document')}
          className="fintech-card-hover p-5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center justify-between">
            <span>Document Audit</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Upload contract notes or ledgers to isolate hidden fees and check statutory caps.
          </p>
        </div>

        {/* Tool 3 */}
        <div 
          onClick={() => onNavigate('scam')}
          className="fintech-card-hover p-5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
            <span>Scam Radar</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Scan suspicious pitches and check for guaranteed return claims and fake advisers.
          </p>
        </div>

        {/* Tool 4 */}
        <div 
          onClick={() => onNavigate('grievance')}
          className="fintech-card-hover p-5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center justify-between">
            <span>Grievance Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Draft formal complaints with 0–100 quality scoring and clean PDF export.
          </p>
        </div>
      </div>
    </div>
  );
};
