import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, ShieldCheck, FileText } from 'lucide-react';
import { Citation } from '../services/api';

interface SourceCitationProps {
  citation: Citation;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ citation }) => {
  const [expanded, setExpanded] = useState(false);

  // Authority badge color
  const getAuthorityBadge = (auth: string) => {
    switch (auth.toUpperCase()) {
      case 'SEBI':
      case 'SEBI_NSE':
      case 'SEBI_EXCHANGES':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'NSE':
      case 'BSE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'RBI':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'AMFI':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const relevancePct = Math.round(citation.relevance_score * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all shadow-sm">
      <div className="p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded border ${getAuthorityBadge(citation.authority)}`}>
                {citation.authority}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Page {citation.page_number}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {relevancePct}% Match
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-800 truncate mt-0.5" title={citation.document_title}>
              {citation.document_title}
            </h4>
            {citation.section && (
              <p className="text-[11px] text-slate-500 truncate">
                {citation.section} {citation.subsection ? `› ${citation.subsection}` : ''}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1 transition-colors font-medium"
            title="Toggle excerpt"
          >
            <span>{expanded ? 'Hide' : 'Excerpt'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          
          {citation.source_url && (
            <a
              href={citation.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              title="Open Official Source"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
            "{citation.excerpt}"
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1 font-medium text-emerald-700">
              <ShieldCheck className="w-3 h-3" />
              Verified Official Text
            </span>
            <span className="truncate max-w-[200px]" title={citation.source_name}>
              {citation.source_name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
