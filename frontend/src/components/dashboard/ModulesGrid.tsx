import React from 'react';
import { 
  MessageSquare, 
  FileText, 
  FileSearch, 
  ShieldAlert, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Database,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ModulesGridProps {
  onNavigate: (tab: string) => void;
}

export const ModulesGrid: React.FC<ModulesGridProps> = ({ onNavigate }) => {
  const modules = [
    {
      id: 'chat',
      title: 'AI Rights Assistant',
      desc: 'Ask regulatory queries with verified SEBI, NSE, BSE & RBI sources.',
      icon: MessageSquare,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      tags: ['Cited Answers', 'Source Links']
    },
    {
      id: 'grievance',
      title: 'Grievance Studio',
      desc: 'Analyze issues, get recommendations and generate formal complaints.',
      icon: FileText,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      tags: ['AI Analysis', 'PDF Export']
    },
    {
      id: 'document',
      title: 'Document Audit',
      desc: 'Upload statements or agreements to detect hidden charges and risks.',
      icon: FileSearch,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      tags: ['OCR & Extraction', 'Issue Detection']
    },
    {
      id: 'scam',
      title: 'Scam Radar',
      desc: 'Scan investment pitches and detect high-risk signals.',
      icon: ShieldAlert,
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      tags: ['Risk Analysis', 'Awareness']
    },
    {
      id: 'academy',
      title: 'Safety Academy',
      desc: 'Take quizzes, improve your safety score and learn key concepts.',
      icon: GraduationCap,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      tags: ['Adaptive Quizzes', 'Personalized Path']
    },
    {
      id: 'library',
      title: 'Rights Library',
      desc: 'Explore your investor rights in simple language with real examples.',
      icon: BookOpen,
      color: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      tags: ['Legal → Simple', 'Verified Sources']
    },
    {
      id: 'tracker',
      title: 'Complaint Tracker',
      desc: 'Track status, deadlines and escalation timelines.',
      icon: Clock,
      color: 'text-cyan-700',
      bg: 'bg-cyan-50',
      border: 'border-cyan-100',
      tags: ['Timeline View', 'Smart Alerts']
    },
    {
      id: 'health',
      title: 'RAG Health (Admin)',
      desc: 'Manage knowledge base, documents and ingestion status.',
      icon: Database,
      color: 'text-slate-700',
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      tags: ['Source Management', 'Evaluation']
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
            Explore Key Modules
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Everything you need to protect your investments
          </p>
        </div>

        <button 
          onClick={() => onNavigate('library')}
          className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          <span>View All Modules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4x2 Grid matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.id}
              whileHover={{ y: -3 }}
              onClick={() => onNavigate(m.id)}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${m.bg} ${m.border} border ${m.color} flex items-center justify-center shadow-2xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {m.title}
                </h4>

                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  {m.desc}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                {m.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
