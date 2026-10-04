import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Clock, 
  FileText, 
  Scale, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { api, GrievanceAnalysis, ComplaintDraft } from '../services/api';
import { downloadComplaintPDF } from '../utils/pdfExport';

interface GrievanceStudioProps {
  onNavigate: (tab: string, prefillData?: any) => void;
  prefillData?: any;
}

export const GrievanceStudio: React.FC<GrievanceStudioProps> = ({ onNavigate, prefillData }) => {
  const [entity, setEntity] = useState(prefillData?.entity || 'Zerodha Broking Limited');
  const [category, setCategory] = useState(prefillData?.category || 'Unauthorized charges');
  const [amount, setAmount] = useState(prefillData?.amount || '2500');
  const [date, setDate] = useState(prefillData?.date || '2024-03-15');
  const [description, setDescription] = useState(
    prefillData?.description ||
    'Discovered an unauthorized ledger debit of ₹2,500 marked under "Sundry Admin Maintenance Fee" on 15-Mar-2024 without prior tariff disclosure, invoice, or contract note justification.'
  );

  const [evidenceList] = useState<string[]>([
    'Trading ledger extract showing ₹2,500 debit',
    'Contract note of the settlement period'
  ]);

  const [analysis, setAnalysis] = useState<GrievanceAnalysis | null>(null);
  const [draft, setDraft] = useState<ComplaintDraft | null>(null);
  const [editableDraftText, setEditableDraftText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyzeAndDraft = async () => {
    setLoading(true);
    try {
      const analyzeRes = await api.analyzeGrievance({
        entity,
        category,
        amount: parseFloat(amount) || 2500,
        date,
        description,
        attachedEvidence: evidenceList
      });
      setAnalysis(analyzeRes.grievance);

      const draftRes = await api.draftComplaint({
        entity,
        category,
        amount: parseFloat(amount) || 2500,
        date,
        description,
        clientId: 'UCC-78901',
        evidence: evidenceList,
        investorProfile: {
          name: 'Rohan Sharma',
          email: 'rohan.investor@example.com'
        }
      });
      setDraft(draftRes);
      setEditableDraftText(draftRes.draft_text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTracker = async () => {
    try {
      await api.createComplaint({
        entity,
        category,
        amount: parseFloat(amount) || 2500,
        date,
        description,
        evidence: evidenceList,
        clientId: 'UCC-78901'
      });
      onNavigate('tracker');
    } catch (e) {
      onNavigate('tracker');
    }
  };

  const handleDownloadPDF = async () => {
    await downloadComplaintPDF({
      complaintId: 'INV-10234',
      entity: entity || 'Zerodha Broking Limited',
      category: category || 'Unauthorized charges',
      amount: amount || 2500,
      draftText: editableDraftText || draft?.draft_text || description,
      date: date || new Date().toISOString().split('T')[0]
    });
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(editableDraftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setEntity('Zerodha Broking Limited');
    setCategory('Unauthorized charges');
    setAmount('2500');
    setDate('2024-03-15');
    setDescription('Discovered an unauthorized ledger debit of ₹2,500 marked under "Sundry Admin Maintenance Fee" on 15-Mar-2024 without prior tariff disclosure, invoice, or contract note justification.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="fintech-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Grievance Studio
            </span>
            <span className="text-xs text-slate-500 font-medium">SCORES 2.0 & SMART ODR Ready</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Grievance Intelligence & Complaint Drafter
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Transforms your financial grievance into a formal legal filing evaluated against statutory quality standards.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleLoadSample}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
          >
            Load Sample Incident
          </button>
          <button
            onClick={handleAnalyzeAndDraft}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{loading ? 'Evaluating...' : 'Generate Legal Draft'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Grievance Details Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="fintech-card p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              1. Incident Particulars
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Intermediary / Broker
              </label>
              <input
                type="text"
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                placeholder="e.g. Zerodha Broking Limited, Groww, Angel One"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Disputed Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Incident Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Grievance Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              >
                <option value="Unauthorized charges">Unauthorized charges / Disputed Ledger Debit</option>
                <option value="Unauthorized transaction">Unauthorized transaction without consent</option>
                <option value="Delayed redemption">Delayed Mutual Fund redemption (T+3 breached)</option>
                <option value="Broker misconduct">Broker misconduct / False promises</option>
                <option value="KYC issue">Account freezing / KYC dispute</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Factual Chronology / Narrative
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed transition-all"
              ></textarea>
            </div>

            {/* Attached Evidence Checklist */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Attached Evidence</span>
                <span className="text-[11px] text-emerald-700 font-semibold">{evidenceList.length} Attached</span>
              </label>
              <div className="space-y-1.5">
                {evidenceList.map((ev, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate flex-1 font-medium">{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence Completeness Card */}
          {analysis && (
            <div className="fintech-card p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Evidence Completeness Engine
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {analysis.evidence_completeness_pct}% Complete
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${analysis.evidence_completeness_pct}%` }}
                ></div>
              </div>

              <div className="space-y-1.5 text-xs">
                {analysis.verified_evidence.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </div>
                ))}
                {analysis.missing_evidence.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>{item} (Missing)</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tip:</strong> {analysis.next_best_action}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Draft & Quality Score */}
        <div className="lg:col-span-7 space-y-4">
          {draft ? (
            <div className="fintech-card p-5 sm:p-6 space-y-4">
              {/* Complaint Quality Score Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                    {draft.quality_evaluation?.quality_score || 88}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Complaint Quality Score</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        {draft.quality_evaluation?.rating || 'EXCELLENT'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Statutory criteria met. Evaluated against 7 legal benchmarks.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadPDF}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    Download PDF
                  </button>
                  <button
                    onClick={handleSaveToTracker}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Save & Track
                  </button>
                </div>
              </div>

              {/* Human Review Notice */}
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Mandatory Notice:</strong> AI-generated draft. Review and verify all particulars before submitting to the intermediary.
                </span>
              </div>

              {/* Editable Draft Body */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Formal Complaint Letter (Editable)
                  </label>
                  <button
                    onClick={handleCopyDraft}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
                <textarea
                  rows={13}
                  value={editableDraftText}
                  onChange={(e) => setEditableDraftText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-[13px] text-slate-800 font-mono leading-relaxed focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-2xs"
                ></textarea>
              </div>

              {/* Bottom Quick Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500 font-medium">
                  Target Statutory TAT: 21 Calendar Days
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export PDF
                  </button>
                  <button
                    onClick={handleSaveToTracker}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Initiate Tracker
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="fintech-card p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No Complaint Draft Generated Yet</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 mb-6 leading-relaxed">
                Click below to automatically analyze the incident particulars and generate a structured legal notice evaluated by the Quality Engine.
              </p>
              <button
                onClick={handleAnalyzeAndDraft}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 active:scale-95"
              >
                <FileCheck2 className="w-4 h-4" />
                Generate Sample Complaint
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
