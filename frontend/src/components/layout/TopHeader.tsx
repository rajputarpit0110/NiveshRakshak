import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell
} from 'lucide-react';

interface TopHeaderProps {
  onSearch: (query: string) => void;
  onLaunchDemo?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onSearch, onLaunchDemo }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onSearch(searchQuery.trim());
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                Nivesh<span className="text-emerald-700">Rakshak</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5 hidden sm:block">
              AI Investor Protection System
            </p>
          </div>
        </div>

        {/* Center: Wide Regulatory Search Bar */}
        <div className="flex-1 max-w-2xl mx-2 sm:mx-6">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything about your rights, a suspicious investment, or a grievance..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 rounded-full pl-11 pr-20 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-2xs"
            />
            <button 
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-full text-xs font-semibold transition-all shadow-xs"
            >
              Ask
            </button>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Protection Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Protection Active</span>
          </div>

          {/* Notification Bell */}
          <button 
            title="Notifications"
            className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>

      </div>
    </header>
  );
};
