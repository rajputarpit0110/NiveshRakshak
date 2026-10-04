import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  MessageSquare, 
  FileCheck2, 
  Clock, 
  FileSearch, 
  AlertTriangle, 
  GraduationCap, 
  BookOpen, 
  Database, 
  Menu, 
  X,
  PlayCircle,
  CheckCircle2,
  User
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLaunchDemo: () => void;
  chunkCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onLaunchDemo,
  chunkCount: initialChunkCount = 354
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveChunkCount, setLiveChunkCount] = useState<number>(initialChunkCount);

  React.useEffect(() => {
    fetch('/api/rag/health')
      .then(res => res.json())
      .then(data => {
        if (data?.stats?.total_chunks) {
          setLiveChunkCount(data.stats.total_chunks);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'chat', label: 'Rights Assistant', icon: MessageSquare },
    { id: 'grievance', label: 'Grievance Studio', icon: FileCheck2 },
    { id: 'tracker', label: 'Tracker', icon: Clock },
    { id: 'document', label: 'Document Audit', icon: FileSearch },
    { id: 'scam', label: 'Scam Radar', icon: AlertTriangle },
    { id: 'academy', label: 'Safety Academy', icon: GraduationCap },
    { id: 'library', label: 'Rights Library', icon: BookOpen },
    { id: 'health', label: 'RAG Health', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 font-bold transition-transform hover:scale-105">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  Nivesh<span className="text-emerald-600">Rakshak</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  AI OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block font-medium">Investor Protection Operating System</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Live Knowledge Pill */}
            <div 
              onClick={() => setActiveTab('health')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-[11px] text-slate-700 font-medium border border-slate-200/90 cursor-pointer hover:bg-slate-100 transition-colors shadow-2xs" 
              title="Official regulatory source chunks indexed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold">{liveChunkCount} Chunks</span>
            </div>

            {/* 1-Click Demo Journey Button */}
            <button
              onClick={onLaunchDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs hover:shadow active:scale-95"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>1-Click Demo</span>
            </button>

            {/* User Avatar Initials */}
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
              title="Rohan Sharma (UCC-78901)"
            >
              RS
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
