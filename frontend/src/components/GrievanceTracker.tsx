import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  ShieldAlert, 
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { downloadComplaintPDF } from '../utils/pdfExport';

interface GrievanceTrackerProps {
  onNavigate: (tab: string) => void;
}

export const GrievanceTracker: React.FC<GrievanceTrackerProps> = ({ onNavigate }) => {
  const [complaint, setComplaint] = useState<any>({
    complaintId: 'INV-10234',
    entity: 'Zerodha Broking Limited',
    category: 'Unauthorized charges',
    amount: 2500,
    status: 'Under Review',
    daysRemaining: 14,
    escalationEligible: false,
    qualityScore: 88,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  const [events, setEvents] = useState<any[]>([
    {
      stage: 'Submitted',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      note: 'Formal grievance drafted and dispatched to broker compliance desk.'
    },
    {
      stage: 'Acknowledged',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      note: 'Broker ticket #ZD-883921 issued. Compliance review initiated.'
    },
    {
      stage: 'Under Review',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      note: 'Disputed ledger entry of ₹2,500 under verification against tariff schedule.'
    }
  ]);

  const stages = ['Submitted', 'Acknowledged', 'Under Review', 'Escalated', 'Resolved'];

  const handleUpdateStatus = async (newStage: string) => {
    try {
      await api.updateComplaintStatus(complaint.complaintId, newStage, `Status manually updated to ${newStage}`);
      setComplaint((prev: any) => ({
        ...prev,
        status: newStage,
        daysRemaining: newStage === 'Resolved' ? 0 : prev.daysRemaining,
        escalationEligible: newStage === 'Escalated'
      }));

      setEvents((prev: any[]) => [
        ...prev,
        {
          stage: newStage,
          timestamp: new Date().toLocaleDateString(),
          note: `Complaint stage advanced to ${newStage}.`
        }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadPDF = async () => {
    await downloadComplaintPDF({
      complaintId: complaint.complaintId || 'INV-10234',
      entity: complaint.entity || 'Zerodha Broking Limited',
      category: complaint.category || 'Unauthorized charges',
      amount: complaint.amount || 2500,
      draftText: complaint.draftText || `FORMAL COMPLAINT & DISPUTE REDRESSAL NOTICE\n\nReference: ${complaint.complaintId || 'INV-10234'}\nTarget Entity: ${complaint.entity}\nDisputed Amount: ₹${complaint.amount}\nStatus: ${complaint.status}\n\nNotice is hereby served under SEBI circular provisions regarding unresolved charges. The intermediary is requested to provide an Action Taken Report (ATR) within statutory timelines.`,
      date: complaint.createdAt ? new Date(complaint.createdAt).toISOString().split('T')[0] : undefined
    });
  };

  const currentStageIndex = stages.indexOf(complaint.status);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Dispute Tracker
            </span>
            <span className="text-xs text-slate-500">21-Day Turnaround Clock</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Complaint #{complaint.complaintId}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Against <strong>{complaint.entity}</strong> • Disputed: <strong>₹{complaint.amount?.toLocaleString()}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            PDF
          </button>
          {complaint.status !== 'Escalated' && (
            <button
              onClick={() => handleUpdateStatus('Escalated')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Escalate to SCORES
            </button>
          )}
        </div>
      </div>

      {/* 21-Day Statutory Countdown Banner */}
      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Statutory 21-Day Deadline Active</h3>
            <p className="text-xs text-slate-600">
              The broker is legally obligated to submit an Action Taken Report within 21 calendar days.
            </p>
          </div>
        </div>

        <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-center shrink-0">
          <span className="text-base font-bold text-emerald-700 block">{complaint.daysRemaining} Days</span>
          <span className="text-[10px] text-slate-500 uppercase font-medium">Remaining</span>
        </div>
      </div>

      {/* Animated Step Timeline */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Progression Stages
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stages.map((stg, idx) => {
            const isPassed = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stg} className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isPassed
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-white text-emerald-700 border-2 border-emerald-600 font-bold'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {isPassed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-xs font-bold mt-2 ${isCurrent ? 'text-emerald-700' : isPassed ? 'text-slate-900' : 'text-slate-500'}`}>
                  {stg}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {isPassed ? 'Done' : isCurrent ? 'Active' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Manual Stage Switcher for Demo */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-medium">Stage Switcher (Demo):</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {stages.map((stg) => (
              <button
                key={stg}
                onClick={() => handleUpdateStatus(stg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  complaint.status === stg
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {stg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log / Event Chronology */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          Event Chronology
        </h3>

        <div className="space-y-2">
          {events.map((ev, index) => (
            <div key={index} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{ev.stage}</span>
                  <span className="text-[10px] text-slate-400">{ev.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {ev.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
