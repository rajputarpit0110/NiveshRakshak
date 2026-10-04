import React from 'react';
import { DashboardHero } from './dashboard/DashboardHero';
import { KpiCards } from './dashboard/KpiCards';
import { JourneyPipeline } from './dashboard/JourneyPipeline';
import { ModulesGrid } from './dashboard/ModulesGrid';

interface CommandCenterProps {
  onNavigate: (tab: string, prefillData?: any) => void;
  onLaunchDemo: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate, onLaunchDemo }) => {
  return (
    <div className="space-y-6">
      {/* 1. Good Morning Rohan Hero with 3D Emblem & 4 Trust Badges */}
      <DashboardHero />

      {/* 2. 4 Metric Cards with Recharts mini sparkline bars */}
      <KpiCards onNavigate={onNavigate} />

      {/* 3. Your Investor Protection Journey (8 Step Pipeline) */}
      <JourneyPipeline onNavigate={onNavigate} onLaunchDemo={onLaunchDemo} />

      {/* 4. Explore Key Modules (8 Cards with tags) */}
      <ModulesGrid onNavigate={onNavigate} />
    </div>
  );
};
