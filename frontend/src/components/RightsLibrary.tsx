import React, { useState } from 'react';
import { 
  Search, 
  Scale, 
  ArrowRight,
  Filter
} from 'lucide-react';

interface RightsLibraryProps {
  onNavigate: (tab: string, prefillData?: any) => void;
}

export const RightsLibrary: React.FC<RightsLibraryProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const rights = [
    {
      id: "right_transparency",
      title: "Right to Transparency in Charges & Tariffs",
      category: "Transparency",
      legal_basis: "SEBI Master Circular for Stock Brokers / Tariff Schedule Disclosures",
      simple_language: "Your broker cannot deduct any fee or penalty unless it was clearly listed in your agreed tariff sheet. You have the right to an itemized invoice for any deduction within 3 working days.",
      real_world_example: "If your ledger shows a debit of ₹2,500 labelled 'sundry charges', the broker is legally required to explain the calculation or reverse it.",
      what_you_can_do: "Demand an itemized billing statement via email. If not resolved within 21 days, escalate to SEBI SCORES 2.0.",
      related_grievance_types: ["Unauthorized charges"]
    },
    {
      id: "right_contract_notes",
      title: "Right to Timely Digital Contract Notes",
      category: "Information",
      legal_basis: "SEBI Circular on Electronic Contract Notes (ECN)",
      simple_language: "You are entitled to receive digitally signed contract notes within 24 hours of trade execution, showing exact trade prices, brokerage, and taxes.",
      real_world_example: "If you buy shares on Monday, your broker must email you the verified contract note by Tuesday evening.",
      what_you_can_do: "Check contract notes against trade SMS alerts. Report missing contract notes immediately to the exchange.",
      related_grievance_types: ["Unauthorized transaction"]
    },
    {
      id: "right_grievance_redressal",
      title: "Right to Time-Bound Redressal (21 Days)",
      category: "Grievance Redressal",
      legal_basis: "SEBI SCORES 2.0 Redressal Master Circular 2024",
      simple_language: "Any registered market intermediary must resolve your written complaint within 21 calendar days and furnish an Action Taken Report.",
      real_world_example: "If a broker ignores your complaint for 21 days, your case can be escalated automatically to SEBI SCORES.",
      what_you_can_do: "On day 22, lodge a complaint on scores.sebi.gov.in with your initial email proof.",
      related_grievance_types: ["Broker misconduct"]
    },
    {
      id: "right_fund_settlement",
      title: "Right to Periodic Settlement of Funds",
      category: "Fair Treatment",
      legal_basis: "SEBI Running Account Settlement Norms",
      simple_language: "Brokers must return all unutilized client cash back to your bank account on the first Friday of every month or quarter.",
      real_world_example: "Your broker cannot withhold unpledged cash balances for months to earn interest or fund internal operations.",
      what_you_can_do: "Review monthly settlement credits in your bank account. Discrepancies should be reported to exchange compliance.",
      related_grievance_types: ["Non-receipt of funds"]
    },
    {
      id: "right_fair_redemption",
      title: "Right to Timely Mutual Fund Redemption",
      category: "Fair Treatment",
      legal_basis: "SEBI Mutual Fund Regulations / AMFI Code of Conduct",
      simple_language: "Mutual funds must disburse redemption proceeds within T+3 days. Any delay legally incurs 15% annual interest paid to you.",
      real_world_example: "If your equity mutual fund redemption is credited late without a regulatory halt, the AMC must pay 15% annual interest.",
      what_you_can_do: "File a claim with the AMC Investor Relations Officer calculating interest for the delay period.",
      related_grievance_types: ["Delayed redemption"]
    }
  ];

  const categories = ['ALL', 'Transparency', 'Information', 'Grievance Redressal', 'Fair Treatment'];

  const filtered = rights.filter(r => {
    const matchCat = selectedCategory === 'ALL' || r.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.simple_language.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Statutory Rights
            </span>
            <span className="text-xs text-slate-500">SEBI & Exchange Charters</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Investor Rights Compendium
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Legal rights translated into plain English with real-world examples.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rights..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((r) => (
          <div key={r.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {r.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                {r.title}
              </h3>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Statute:</strong> {r.legal_basis}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {r.simple_language}
              </p>

              <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700">
                <strong className="text-[10px] text-emerald-800 uppercase block">Example Scenario:</strong>
                <p className="mt-0.5">{r.real_world_example}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 truncate">
                {r.what_you_can_do}
              </span>
              <button
                onClick={() => onNavigate('grievance', { category: r.related_grievance_types[0] })}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1 shrink-0 transition-colors"
              >
                <span>Enforce</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
