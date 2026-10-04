import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CommandCenter } from './components/CommandCenter';
import { RightsChat } from './components/RightsChat';
import { GrievanceStudio } from './components/GrievanceStudio';
import { GrievanceTracker } from './components/GrievanceTracker';
import { DocumentStudio } from './components/DocumentStudio';
import { ScamRadar } from './components/ScamRadar';
import { SafetyAcademy } from './components/SafetyAcademy';
import { RightsLibrary } from './components/RightsLibrary';
import { KnowledgeHealth } from './components/KnowledgeHealth';
import { TrustCenter } from './components/TrustCenter';
import { DemoModal } from './components/DemoModal';
import { ExternalLink } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [prefillGrievance, setPrefillGrievance] = useState<any>(null);

  const handleNavigate = (tab: string, prefillData?: any) => {
    if (prefillData) {
      setPrefillGrievance(prefillData);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CommandCenter onNavigate={handleNavigate} onLaunchDemo={() => setIsDemoOpen(true)} />;
      case 'chat':
        return <RightsChat onNavigate={handleNavigate} />;
      case 'grievance':
        return <GrievanceStudio onNavigate={handleNavigate} prefillData={prefillGrievance} />;
      case 'tracker':
        return <GrievanceTracker onNavigate={handleNavigate} />;
      case 'document':
        return <DocumentStudio onNavigate={handleNavigate} />;
      case 'scam':
        return <ScamRadar />;
      case 'academy':
        return <SafetyAcademy />;
      case 'library':
        return <RightsLibrary onNavigate={handleNavigate} />;
      case 'health':
        return <KnowledgeHealth />;
      case 'trust':
        return <TrustCenter />;
      default:
        return <CommandCenter onNavigate={handleNavigate} onLaunchDemo={() => setIsDemoOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onLaunchDemo={() => setIsDemoOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {renderActiveView()}
      </main>

      {/* 1-Click Interactive Demo Modal */}
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Clean Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-900">Nivesh<span className="text-emerald-600">Rakshak</span></span>
            <span>—</span>
            <span>AI Investor Rights & Grievance Assistant</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <button 
              onClick={() => handleNavigate('trust')} 
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Trust & Safety
            </button>
            <button 
              onClick={() => handleNavigate('health')} 
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              RAG Health
            </button>
            <a 
              href="https://scores.sebi.gov.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <span>SEBI SCORES 2.0</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
