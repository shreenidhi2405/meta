import React from 'react';
import { useStory } from '../../engine/StoryContext';
import {
  Film,
  Play,
  Layers,
  Sparkles,
  Eye,
  ShieldAlert,
  User,
  Clock,
  Compass,
  ArrowRight,
  Sliders,
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { config, setCurrentPage, play, switchPerspective, setIsSettingsOpen, setIsCreditsOpen } = useStory();

  const handleStartExperience = (perspectiveKey?: 'witness' | 'suspect' | 'victim') => {
    if (perspectiveKey) {
      switchPerspective(perspectiveKey);
    }
    setCurrentPage('player');
    play();
  };

  return (
    <div className="min-h-screen bg-cinema-bg text-slate-100 flex flex-col font-sans selection:bg-gold/30">
      {/* Top Minimal Cinema Navigation */}
      <header className="relative z-30 bg-cinema-surface/60 border-b border-cinema-border/80 px-6 py-4 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="font-cinematic font-bold tracking-widest text-slate-100 text-lg block leading-none">
              DIRECTOR'S CUT
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold-light">
              Interactive Cinema Platform
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-3 md:gap-5 text-xs font-mono">
          <button
            onClick={() => setCurrentPage('stories')}
            data-testid="landing-nav-cases-btn"
            className="text-slate-400 hover:text-gold-light transition-colors"
          >
            Case Archives
          </button>
          <button
            onClick={() => setCurrentPage('evidence')}
            data-testid="landing-nav-evidence-btn"
            className="text-slate-400 hover:text-gold-light transition-colors hidden sm:block"
          >
            Evidence Board
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-slate-400 hover:text-gold-light transition-colors p-1"
            title="Engine Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCreditsOpen(true)}
            className="text-slate-400 hover:text-gold-light transition-colors"
          >
            Credits
          </button>
          <button
            onClick={() => handleStartExperience()}
            data-testid="landing-start-exp-header-btn"
            className="px-3.5 py-1.5 rounded-lg bg-gold hover:bg-gold-light text-cinema-bg font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            Play Film
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-6 py-12 md:py-16 space-y-12">
        {/* Festival Laurels & Accolades */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-slate-400 text-center opacity-85">
          <div className="flex items-center gap-2">
            <span className="text-gold text-lg">🌿</span>
            <span className="text-[11px] font-mono uppercase tracking-widest">
              OFFICIAL SELECTION // VENICE IMMERSIVE 2026
            </span>
            <span className="text-gold text-lg">🌿</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold text-lg">🌿</span>
            <span className="text-[11px] font-mono uppercase tracking-widest">
              SPECIAL JURY PRIZE // TRIBECA NARRATIVE INNOVATION
            </span>
            <span className="text-gold text-lg">🌿</span>
          </div>
        </div>

        {/* Central Title Display */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-950/40 border border-gold/40 text-gold-light text-xs font-mono uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Desktop-First Multi-Perspective Cinema</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinematic font-black tracking-wider text-slate-100 uppercase drop-shadow-2xl">
            DIRECTOR'S CUT
          </h1>

          <p className="text-xl md:text-2xl text-gold-light font-cinematic italic tracking-wide">
            "Every perspective tells a different truth."
          </p>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
            A woman falls fourteen floors from a rain-lashed apartment rooftop under mysterious circumstances.
            Experience the same incident through three synchronized character perspectives.
            Uncover contradictory clues, compare depositions, and deliver your verdict.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleStartExperience()}
              data-testid="landing-launch-btn"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 text-cinema-bg font-mono font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.35)] flex items-center gap-3 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Launch The Last Witness</span>
            </button>

            <button
              onClick={() => setCurrentPage('stories')}
              data-testid="landing-explore-cases-btn"
              className="px-6 py-4 rounded-xl bg-cinema-surface hover:bg-slate-800 border border-cinema-border hover:border-gold/50 text-slate-200 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-gold" />
              <span>Browse All Cases</span>
            </button>
          </div>
        </div>

        {/* 3 Perspectives Interactive Preview Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-widest text-gold-light">
              Choose Your Entry Point // 3 Synchronized Viewpoints
            </span>
            <span className="hidden sm:inline">Switch perspectives at any second without losing timeline sync</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Witness Card */}
            <div
              onClick={() => handleStartExperience('witness')}
              data-testid="landing-card-witness"
              className="group bg-cinema-surface/80 border border-cinema-border hover:border-sky-400 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-sky-950/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-600/40 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-950/70 text-sky-300 border border-sky-800">
                    Camera 01
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 block mb-1 font-semibold">
                  {config.perspectives.witness.role}
                </span>
                <h3 className="text-xl font-cinematic font-bold text-slate-100 mb-2">
                  {config.perspectives.witness.name}
                </h3>
                <p className="text-xs text-slate-300 italic mb-4 font-serif">
                  "{config.perspectives.witness.quote}"
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Observing from South Tower 12B through a 600mm telephoto lens across the alleyway. Convinced he watched a cold-blooded shove.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cinema-border flex items-center justify-between text-xs font-mono text-sky-400 group-hover:text-sky-300">
                <span>Enter as Witness</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Suspect Card */}
            <div
              onClick={() => handleStartExperience('suspect')}
              data-testid="landing-card-suspect"
              className="group bg-cinema-surface/80 border border-cinema-border hover:border-rose-400 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-rose-950/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-600/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800">
                    Camera 02
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block mb-1 font-semibold">
                  {config.perspectives.suspect.role}
                </span>
                <h3 className="text-xl font-cinematic font-bold text-slate-100 mb-2">
                  {config.perspectives.suspect.name}
                </h3>
                <p className="text-xs text-slate-300 italic mb-4 font-serif">
                  "{config.perspectives.suspect.quote}"
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  On the rooftop terrace face-to-face with Elena in the storm. Claims she tripped on loose wire and he dove frantically to save her.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cinema-border flex items-center justify-between text-xs font-mono text-rose-400 group-hover:text-rose-300">
                <span>Enter as Suspect</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Victim Card */}
            <div
              onClick={() => handleStartExperience('victim')}
              data-testid="landing-card-victim"
              className="group bg-cinema-surface/80 border border-cinema-border hover:border-gold p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-amber-950/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-gold/40 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/70 text-gold-light border border-gold/40">
                    Camera 03
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-gold block mb-1 font-semibold">
                  {config.perspectives.victim.role}
                </span>
                <h3 className="text-xl font-cinematic font-bold text-slate-100 mb-2">
                  {config.perspectives.victim.name}
                </h3>
                <p className="text-xs text-slate-300 italic mb-4 font-serif">
                  "{config.perspectives.victim.quote}"
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The final retrospective sequence. A hidden audio recorder, an emergency harness, and an orchestrated framing trap that spiraled into disaster.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cinema-border flex items-center justify-between text-xs font-mono text-gold group-hover:text-gold-light">
                <span>Enter as Victim</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-cinema-border/80 text-xs">
          <div className="p-4 rounded-xl bg-cinema-surface/50 border border-cinema-border space-y-2">
            <Clock className="w-5 h-5 text-gold" />
            <h4 className="font-cinematic font-bold text-slate-200">Synchronized Master Timeline</h4>
            <p className="text-slate-400">
              One shared master clock drives all video, subtitles, and audio. Switch freely without time drift.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cinema-surface/50 border border-cinema-border space-y-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h4 className="font-cinematic font-bold text-slate-200">Interactive Forensic Clues</h4>
            <p className="text-slate-400">
              Pulsing radar hotspots emerge during key moments. Click to pause playback and collect evidence.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cinema-surface/50 border border-cinema-border space-y-2">
            <Layers className="w-5 h-5 text-rose-400" />
            <h4 className="font-cinematic font-bold text-slate-200">Detective Evidence Pinboard</h4>
            <p className="text-slate-400">
              Cross-examine contradictions side-by-side to expose bias and optical distortions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cinema-surface/50 border border-cinema-border space-y-2">
            <Film className="w-5 h-5 text-emerald-400" />
            <h4 className="font-cinematic font-bold text-slate-200">Tri-Branch Verdicts</h4>
            <p className="text-slate-400">
              Accident, Murder, or Deliberate Manipulation. Your verdict alters the cinematic epilogue.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cinema-border/80 px-6 py-4 bg-cinema-surface/40 text-center text-xs font-mono text-slate-500">
        DIRECTOR'S CUT © 2026 // Desktop-First Interactive Storytelling Engine. All Rights Reserved.
      </footer>
    </div>
  );
};

