import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  FileText, 
  FileSearch, 
  ShieldAlert, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Database,
  HelpCircle,
  Lock,
  ExternalLink,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface LeftSidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeTab, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Rights Assistant', icon: MessageSquareText },
    { id: 'grievance', label: 'Grievance Studio', icon: FileText },
    { id: 'document', label: 'Document Audit', icon: FileSearch },
    { id: 'scam', label: 'Scam Radar', icon: ShieldAlert },
    { id: 'academy', label: 'Safety Academy', icon: GraduationCap },
    { id: 'library', label: 'Rights Library', icon: BookOpen },
    { id: 'tracker', label: 'Tracker', icon: Clock },
    { id: 'health', label: 'RAG Health', icon: Database },
  ];

  return (
    <aside className="w-60 lg:w-64 bg-white border-r border-slate-200/90 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-61px)]">
      {/* Navigation Links */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon 
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-emerald-700' : 'text-slate-500'
                }`} 
              />
              <span className="tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Divider / Support */}
        <div className="pt-3 mt-3 border-t border-slate-100">
          <button
            onClick={() => onNavigate('trust')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Help & Support</span>
          </button>
        </div>
      </div>

      {/* Bottom Promo Card matching the image */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/40 p-4 border border-emerald-100/80 text-left relative overflow-hidden shadow-2xs group">
        <div className="relative z-10 space-y-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white mb-2 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-white" />
          </div>
          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Your Capital</h4>
          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">Your Rights</h4>
          <h4 className="text-xs font-black text-emerald-700 leading-tight">Our Priority</h4>
        </div>

        {/* 3D Green Finance Graphic Illustration */}
        <div className="mt-3 pt-2 border-t border-emerald-200/50 flex items-end justify-between">
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>354 Chunks Active</span>
          </div>
          <div className="flex items-end gap-1 h-6">
            <span className="w-1.5 h-3 bg-emerald-300 rounded-xs"></span>
            <span className="w-1.5 h-4.5 bg-emerald-400 rounded-xs"></span>
            <span className="w-1.5 h-6 bg-emerald-600 rounded-xs"></span>
          </div>
        </div>
      </div>
    </aside>
  );
};
