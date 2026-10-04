import React, { useState } from 'react';
import { TopHeader } from './components/layout/TopHeader';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
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
import { AnimatePresence, motion } from 'framer-motion';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [prefillGrievance, setPrefillGrievance] = useState<any>(null);
  const [searchPrefill, setSearchPrefill] = useState<string>('');

  const handleNavigate = (tab: string, prefillData?: any) => {
    if (prefillData?.query) {
      setSearchPrefill(prefillData.query);
    }
    if (prefillData) {
      setPrefillGrievance(prefillData);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopSearch = (query: string) => {
    setSearchPrefill(query);
    setActiveTab('chat');
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      
      {/* 1. Full-width Top Header matching image */}
      <TopHeader onSearch={handleTopSearch} onLaunchDemo={() => setIsDemoOpen(true)} />

      {/* 2. Main Shell Layout: Sidebar + Workspace + Optional Right Panel */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Left Fixed Navigation Sidebar */}
        <LeftSidebar activeTab={activeTab} onNavigate={handleNavigate} />

        {/* Center Main Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right Sidebar (shown on dashboard view matching the screenshot) */}
        {activeTab === 'dashboard' && (
          <div className="hidden xl:block p-6 pl-0 sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
            <RightSidebar onNavigate={handleNavigate} />
          </div>
        )}

      </div>

      {/* Interactive 2-min Demo Modal */}
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigate={handleNavigate}
      />

    </div>
  );
};
