import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Info,
  PhoneCall,
  Search,
  ArrowRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { api, ScamAnalysis } from '../services/api';

export const ScamRadar: React.FC = () => {
  const sampleScamText = `Exclusive opportunity from "SEBI Certified Institutional Club" 🚀
We offer GUARANTEED 30% monthly fixed returns on Algorithmic Options trading.
100% safe capital with ZERO risk!
URGENT: Only 2 VIP slots left for this batch expiring in 2 hours!
Send initial investment of ₹25,000 to personal UPI: instantprofit@okaxis.
Our admin will setup AnyDesk on your phone. Download via bit.ly/exclusive-bot-apk.`;

  const [inputText, setInputText] = useState(sampleScamText);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>({
    risk_level: 'HIGH',
    risk_score: 95,
    signals_detected_count: 5,
    detected_signals: [
      {
        id: 'guaranteed_returns',
        name: 'Guaranteed / Fixed Returns Claim',
        matched_phrases: ['guaranteed', 'zero risk'],
        explanation: 'Registered market entities cannot legally promise fixed or guaranteed returns on market instruments under SEBI PFUTP regulations.',
        severity_weight: 30
      },
      {
        id: 'pressure_tactics',
        name: 'Artificial Urgency & Pressure Tactics',
        matched_phrases: ['urgent', 'only 2 slots left'],
        explanation: 'High-pressure countdown tactics are designed to prevent investors from conducting independent regulatory verification.',
        severity_weight: 15
      },
      {
        id: 'unusual_payment_methods',
        name: 'Personal UPI / Individual Account Transfer',
        matched_phrases: ['personal upi'],
        explanation: 'Regulated brokers only accept funds into designated USCNB client bank accounts, never personal UPI handles or individual accounts.',
        severity_weight: 25
      },
      {
        id: 'remote_access_requests',
        name: 'Request for Remote Access Software (AnyDesk)',
        matched_phrases: ['anydesk'],
        explanation: 'Legitimate financial firms never ask investors to install remote screen-sharing tools to configure trading bots.',
        severity_weight: 35
      }
    ],
    summary: 'High-risk signals detected. Several indicators strongly align with known fraudulent solicitation patterns.',
    recommended_actions: [
      'Do NOT transfer any money or pay withdrawal fees under any pretext.',
      'Verify SEBI registration number directly on sebi.gov.in.',
      'Never install remote screen-sharing applications (AnyDesk, TeamViewer) or download external APK files.',
      'If funds were already transferred, immediately dial 1930 or visit cybercrime.gov.in.'
    ],
    safe_harbor_disclaimer: 'Risk signals are educational indicators and do not by themselves constitute a definitive legal fraud verdict.'
  });

  const handleScan = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await api.checkScam(inputText);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="fintech-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Prevention Radar
            </span>
            <span className="text-xs text-slate-500 font-medium">Behavioral & Linguistic Pattern Analyzer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Investment Risk & Scam Detector
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Scan suspicious WhatsApp pitches, Telegram advisories, or investment offers before transferring any money.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 flex items-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? 'Scanning...' : 'Scan Pitch for Risks'}</span>
        </button>
      </div>

      {/* Input Box */}
      <div className="fintech-card p-5 space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-700">
            Paste Pitch, Telegram Message, or Solicitation Content
          </label>
          <button
            onClick={() => setInputText(sampleScamText)}
            className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Load Sample Telegram Pitch</span>
          </button>
        </div>
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste message text here..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white leading-relaxed font-mono transition-all"
        ></textarea>
        <p className="text-[11px] text-slate-400">
          Evaluates against 10 statutory red flags: guaranteed returns, unverified UPIs, AnyDesk requests, and fake SEBI claims.
        </p>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="space-y-5">
          {/* Risk Level Gauge Bar */}
          <div className={`p-5 sm:p-6 rounded-2xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            analysis.risk_level === 'HIGH'
              ? 'bg-gradient-to-r from-rose-50 via-rose-100/40 to-white border-rose-200'
              : analysis.risk_level === 'MEDIUM'
              ? 'bg-gradient-to-r from-amber-50 via-amber-100/40 to-white border-amber-200'
              : 'bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-white border-emerald-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                analysis.risk_level === 'HIGH'
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                    analysis.risk_level === 'HIGH'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {analysis.risk_level} RISK LEVEL ({analysis.risk_score} / 100)
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  {analysis.summary}
                </h3>
              </div>
            </div>

            <div className="shrink-0 bg-white px-4 py-2 rounded-xl border border-slate-200 text-center shadow-2xs">
              <span className="text-2xl font-extrabold text-rose-700 block">{analysis.signals_detected_count}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Signals Flagged</span>
            </div>
          </div>

          {/* Detected Signals Breakdown */}
          <div className="fintech-card p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Flagged Risk Signals ({analysis.detected_signals.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {analysis.detected_signals.map((sig) => (
                <div key={sig.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{sig.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      Weight: {sig.severity_weight}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sig.explanation}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Matched:</span>
                    {sig.matched_phrases.map((phrase, pIdx) => (
                      <span key={pIdx} className="text-[10px] font-mono bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
                        "{phrase}"
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Protective Protocol */}
          <div className="fintech-card p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              What You Should Do (Protective Steps)
            </h3>

            <div className="space-y-2.5">
              {analysis.recommended_actions.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>

            {/* Helpline Bar */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>National Cyber Crime Helpline: <strong className="text-slate-900 font-mono">1930</strong> (Toll-Free, 24x7)</span>
              </div>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-semibold text-xs"
              >
                <span>cybercrime.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Safe Harbor Notice */}
          <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{analysis.safe_harbor_disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
