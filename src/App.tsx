import React from 'react';
import { StoryProvider, useStory } from './engine/StoryContext';
import { LandingHero } from './components/landing/LandingHero';
import { StorySelectionPage } from './components/story-selection/StorySelectionPage';
import { CinematicPlayer } from './components/player/CinematicPlayer';
import { EvidenceBoard } from './components/evidence/EvidenceBoard';
import { DecisionRoom } from './components/decision/DecisionRoom';
import { EndingCutscene } from './components/ending/EndingCutscene';
import { SettingsModal } from './components/settings/SettingsModal';
import { CreditsModal } from './components/settings/CreditsModal';

const AppContent: React.FC = () => {
  const { currentPage } = useStory();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingHero />;
      case 'stories':
        return <StorySelectionPage />;
      case 'player':
        return <CinematicPlayer />;
      case 'evidence':
        return <EvidenceBoard />;
      case 'decision':
        return <DecisionRoom />;
      case 'ending':
        return <EndingCutscene />;
      default:
        return <LandingHero />;
    }
  };

  return (
    <div className="relative min-h-screen bg-cinema-bg text-slate-100 flex flex-col font-sans selection:bg-gold/30">
      {renderCurrentPage()}
      <SettingsModal />
      <CreditsModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoryProvider>
      <AppContent />
    </StoryProvider>
  );
};

export default App;

