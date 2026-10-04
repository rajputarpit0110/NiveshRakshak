import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  HelpCircle,
  FileCheck2,
  FileSearch
} from 'lucide-react';
import { api, RAGResponse } from '../services/api';
import { SourceCitation } from './SourceCitation';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  ragResponse?: RAGResponse;
  timestamp: string;
}

interface RightsChatProps {
  onNavigate: (tab: string, prefillData?: any) => void;
}

export const RightsChat: React.FC<RightsChatProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [authorityFilter, setAuthorityFilter] = useState('ALL');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "### Welcome to your Statutory Rights Assistant\n\n" +
            "I provide grounded regulatory guidance directly cited from **354 verified chunks** across SEBI, NSE, BSE, AMFI, and RBI circulars.\n\n" +
            "Ask about unexplained broker debits, demat KYC rules, contract note deadlines, or grievance escalation steps.",
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    { label: "Broker deducted ₹2,500 without explanation", q: "My broker deducted ₹2,500 without explanation. What are my rights and next steps?" },
    { label: "Turnaround timeline on SEBI SCORES 2.0", q: "What is the mandatory turnaround timeline for an intermediary to resolve a grievance on SCORES 2.0?" },
    { label: "Can an advisor guarantee a 30% monthly return?", q: "Can a SEBI registered broker or advisor guarantee a 30% monthly return?" },
    { label: "Demat account In-Person Verification (IPV) rules", q: "What are the KYC and In Person Verification procedures for opening a demat account?" }
  ];

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || query).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const filters = authorityFilter !== 'ALL' ? { authority: authorityFilter } : undefined;
      const resp = await api.askRAG(q, filters);

      const assistantMsg: Message = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: resp.answer,
        ragResponse: resp,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: "I could not find sufficient verified evidence in the official knowledge base to provide a legally authoritative answer to this query. Under NiveshRakshak safety policies, we avoid speculative answers on regulatory rights.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="fintech-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Official RAG Engine
              </span>
              <span className="text-xs text-slate-500 font-medium">354 Verified Statutory Regulations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Investor Rights & Regulatory Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Direct statutory citations with exact authority, document, and page numbers. Zero speculative or synthetic legal claims.
            </p>
          </div>

          {/* Authority Filter Selector */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
            {['ALL', 'SEBI', 'NSE', 'RBI', 'AMFI'].map((auth) => (
              <button
                key={auth}
                onClick={() => setAuthorityFilter(auth)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  authorityFilter === auth
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {auth}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Action Prompts */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Popular Queries:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.q)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs transition-colors border border-slate-200/80 flex items-center gap-1.5"
            >
              <span>{qp.label}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-5 sm:p-6 transition-all ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-xs shadow-xs'
                  : 'fintech-card text-slate-800 rounded-tl-xs w-full'
              }`}
            >
              {/* Header inside assistant message */}
              {msg.sender === 'assistant' && msg.ragResponse && (
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-900 text-xs">Verified Statutory Response</span>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">SEBI SCORES 2.0 Grounded</span>
                  </div>

                  {/* Confidence Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    msg.ragResponse.confidence === 'HIGH'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : msg.ragResponse.confidence === 'MEDIUM'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {msg.ragResponse.confidence} Confidence ({Math.round(msg.ragResponse.confidence_score * 100)}%)
                  </span>
                </div>
              )}

              {/* Text content with clean typography */}
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-2.5">
                {msg.text}
              </div>

              {/* Verified Source Citations Component */}
              {msg.ragResponse && msg.ragResponse.sources && msg.ragResponse.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Verified Source Citations ({msg.ragResponse.sources.length})
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Official Regulatory Extracts</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {msg.ragResponse.sources.map((citation) => (
                      <SourceCitation key={citation.citation_id} citation={citation} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Next Best Actions */}
              {msg.ragResponse && msg.ragResponse.recommended_action && (
                <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs text-slate-800">
                      <strong>Next Step:</strong> {msg.ragResponse.recommended_action}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onNavigate('document')}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
                    >
                      Audit Statement
                    </button>
                    <button
                      onClick={() => onNavigate('grievance')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      Draft Complaint
                    </button>
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 max-w-sm shadow-sm animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Search className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Searching 354 regulatory chunks...</p>
              <p className="text-[10px] text-slate-500">Checking SEBI Master Directions and exchange SOPs</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Modern Input Form Bar */}
      <div className="sticky bottom-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your rights, broker charges, KYC rules, or grievance escalation..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm shrink-0 active:scale-95"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
          Grounded exclusively in official regulatory source material. All responses provide verifiable provenance citations.
        </p>
      </div>
    </div>
  );
};
