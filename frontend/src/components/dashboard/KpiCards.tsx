import React from 'react';
import { 
  FileText, 
  FileSearch, 
  AlertTriangle, 
  GraduationCap, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface KpiCardsProps {
  onNavigate: (tab: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ onNavigate }) => {
  const chartData1 = [{ v: 2 }, { v: 4 }, { v: 6 }, { v: 8 }];
  const chartData2 = [{ v: 3 }, { v: 5 }, { v: 4 }, { v: 7 }];
  const chartData3 = [{ v: 2 }, { v: 3 }, { v: 6 }, { v: 9 }];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      
      {/* 1. Active Complaints */}
      <motion.div 
        whileHover={{ y: -2 }}
        onClick={() => onNavigate('tracker')}
        className="cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <FileText className="w-4 h-4" />
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500">Active Complaints</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">1</span>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded-md">
              ↑ 1
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-600">Under Zerodha Review</span>
          <div className="w-12 h-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData1}>
                <Bar dataKey="v" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* 2. Documents Audited */}
      <motion.div 
        whileHover={{ y: -2 }}
        onClick={() => onNavigate('document')}
        className="cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <FileSearch className="w-4 h-4" />
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500">Documents Audited</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">1</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
              ↑ 1
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-600">1 issue flagged</span>
          <div className="w-12 h-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData2}>
                <Bar dataKey="v" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* 3. Risk Alerts */}
      <motion.div 
        whileHover={{ y: -2 }}
        onClick={() => onNavigate('scam')}
        className="cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500">Risk Alerts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">1</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
              High Risk
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-600">Scam advisory flagged</span>
          <div className="w-12 h-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData3}>
                <Bar dataKey="v" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* 4. Learning Progress */}
      <motion.div 
        whileHover={{ y: -2 }}
        onClick={() => onNavigate('academy')}
        className="cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
            <GraduationCap className="w-4 h-4" />
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500">Learning Progress</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">68%</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
              ↑ 12%
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-600">3 of 6 modules completed</span>
          <div className="w-12 h-2 bg-purple-100 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full w-[68%] rounded-full"></div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};
