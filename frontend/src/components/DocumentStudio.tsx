import React, { useState } from 'react';
import { 
  FileSearch, 
  UploadCloud, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Scale, 
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';

interface DocumentStudioProps {
  onNavigate: (tab: string, prefillData?: any) => void;
}

export const DocumentStudio: React.FC<DocumentStudioProps> = ({ onNavigate }) => {
  const [uploading, setUploading] = useState(false);

  const sampleLedgerText = `CLIENT FINANCIAL LEDGER STATEMENT
Entity: Zerodha Broking Limited (SEBI Reg: INZ000031633)
Client: Rohan Sharma | UCC: 128945
Period: 01-Mar-2024 to 31-Mar-2024

DATE        PARTICULARS                                DEBIT (₹)     CREDIT (₹)
01-03-2024  Funds Transfer - HDFC Bank                             50,000.00 Cr
05-03-2024  Buy 50 TCS @ 3,920.00                   1,96,000.00 Dr
05-03-2024  STT, Stamp Duty & Turnover                    248.50 Dr
14-03-2024  Sundry Maintenance Fee / Charge             2,500.00 Dr  <<< [SUSPICIOUS]
20-03-2024  UPI Funds Transfer                                    1,60,000.00 Cr

CLOSING BALANCE: ₹11,375.50 Cr`;

  const [documentContent, setDocumentContent] = useState(sampleLedgerText);
  const [analysis, setAnalysis] = useState<any>({
    file_name: 'Zerodha_Ledger_Statement_Mar2024.pdf',
    detected_charges: [
      {
        amount: 2500,
        formatted: '₹2,500.00',
        raw_context: 'Sundry Maintenance Fee - Debit: ₹2,500.00',
        type: 'Disputed Ledger Debit'
      },
      {
        amount: 248.50,
        formatted: '₹248.50',
        raw_context: 'STT & Turnover Levies: ₹248.50',
        type: 'Statutory Levies'
      }
    ],
    findings: [
      {
        issue_id: 'iss_2500',
        title: 'Unexplained Ledger Debit (₹2,500.00)',
        severity: 'HIGH',
        description: 'Voucher dated 14-03-2024 reflects a debit of ₹2,500.00 marked as "Sundry Maintenance Fee" without prior intimation or agreed tariff sheet disclosure.',
        relevant_rule: 'SEBI Circular on Brokerage, Levies, and Ledger Debits (2023)',
        investor_right: 'Right to itemized computational explanation within 3 working days.',
        recommended_action: 'Send formal Written Dispute Notice demanding reversal or justification.'
      }
    ],
    next_best_action: 'Generate a formal Written Grievance Draft for the ₹2,500 debit.'
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.analyzeDocument(formData);
      setAnalysis(res.analysis);
      setDocumentContent(res.extractedTextPreview || sampleLedgerText);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleProceedToComplaint = () => {
    onNavigate('grievance', {
      entity: 'Zerodha Broking Limited',
      category: 'Unauthorized charges',
      amount: '2500',
      date: '2024-03-14',
      description: 'Document audit flagged an unexplained sundry debit of ₹2,500 in my trading ledger dated 14-Mar-2024 without prior tariff disclosure.'
    });
  };

  const handleResetSample = () => {
    setDocumentContent(sampleLedgerText);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="fintech-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Document Forensic Studio
            </span>
            <span className="text-xs text-slate-500 font-medium">Side-by-Side Statement Audit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Statement & Contract Note Auditor
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Upload contract notes, trading ledgers, or account statements. The AI scans line items to detect unexplained debits against SEBI tariff regulations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleResetSample}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sample Ledger</span>
          </button>
          <label className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-2 active:scale-95">
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? 'Scanning...' : 'Upload Statement'}</span>
            <input type="file" accept=".pdf,.txt,.csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Studio Workspace: Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="fintech-card p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900 truncate">
                {analysis?.file_name || 'Zerodha_Ledger_Statement_Mar2024.pdf'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              Interactive Preview
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto h-[480px] relative shadow-inner">
            <pre className="whitespace-pre">
              {documentContent}
            </pre>

            {/* Suspicious Highlight Badge */}
            <div className="absolute right-4 top-28 bg-rose-500/20 border border-rose-500 text-rose-300 text-[10px] px-2.5 py-1 rounded-md shadow-md animate-pulse">
              ⚠ Disputed Debit Detected: ₹2,500.00
            </div>
          </div>
        </div>

        {/* Right Column: AI Findings */}
        <div className="lg:col-span-6 space-y-3">
          <div className="fintech-card p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">Extracted Findings & Signals</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              1 HIGH RISK ENTRY
            </span>
          </div>

          {/* Charges Detected */}
          <div className="grid grid-cols-2 gap-3">
            {analysis?.detected_charges?.map((c: any, idx: number) => (
              <div key={idx} className="fintech-card p-4 space-y-1">
                <span className="text-[11px] font-medium text-slate-500 block">{c.type}</span>
                <span className="text-xl font-extrabold text-slate-900 block font-mono">{c.formatted}</span>
                <p className="text-[11px] text-slate-500 truncate">{c.raw_context}</p>
              </div>
            ))}
          </div>

          {/* Detailed Potential Issues */}
          <div className="space-y-3">
            {analysis?.findings?.map((f: any) => (
              <div 
                key={f.issue_id}
                className="fintech-card p-5 space-y-3 border-l-4 border-l-rose-500"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{f.title}</h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                    {f.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {f.description}
                </p>

                <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Statutory Rule:</strong> {f.relevant_rule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Your Right:</strong> {f.investor_right}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                RECOMMENDED ACTION
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {analysis?.next_best_action}
              </p>
            </div>
            <button
              onClick={handleProceedToComplaint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <span>Draft Legal Notice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
