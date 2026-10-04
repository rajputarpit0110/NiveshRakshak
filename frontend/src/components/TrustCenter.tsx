import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Scale, 
  BookOpen, 
  UserCheck, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export const TrustCenter: React.FC = () => {
  const principles = [
    {
      icon: BookOpen,
      title: "Statutory RAG Grounding",
      description: "Our system strictly retrieves clauses from official SEBI Master Circulars, NSE/BSE rules, and RBI Ombudsman regulations. The AI never fabricates rules."
    },
    {
      icon: Scale,
      title: "Verifiable Source Citations",
      description: "Every regulatory guidance card provides full provenance: Document Title, Authority, Circular Reference, Section, and Page Number."
    },
    {
      icon: UserCheck,
      title: "Mandatory Human-in-the-Loop",
      description: "NiveshRakshak never auto-submits complaints. Generated complaints are drafts designed for the investor to review, edit, and dispatch."
    },
    {
      icon: Lock,
      title: "Zero Retention Privacy",
      description: "Uploaded statements and financial records are processed in memory for line-item audit and immediately discarded. Financial data is never logged."
    },
    {
      icon: ShieldCheck,
      title: "Educational Risk Indicators",
      description: "Our Scam Radar evaluates behavioral markers for awareness. It presents risk indicators objectively without defamatory assertions."
    },
    {
      icon: FileCheck2,
      title: "Anti-Hallucination Fallback",
      description: "If an inquiry cannot be matched with sufficient confidence in verified knowledge chunks, the assistant explicitly states that evidence was not found."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Responsible AI
          </span>
          <span className="text-xs text-slate-500">Ethical Framework</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Trust & Responsible AI Charter
        </h2>
        <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
          Designed on principles of radical transparency, zero hallucination, and privacy-first data handling.
        </p>
      </div>

      {/* 6 Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {principles.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {p.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {p.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Statutory Disclaimers */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Statutory Disclaimers
        </h4>
        <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
          <p>
            1. Information provided across NiveshRakshak is for educational guidance only and does not constitute formal legal counsel.
          </p>
          <p>
            2. The Scam Signal Radar detects patterns associated with fraud; detected indicators are educational alerts.
          </p>
          <p>
            3. Regulatory timelines reflect public SEBI, NSE, BSE, AMFI, and RBI norms.
          </p>
        </div>
      </div>
    </div>
  );
};
