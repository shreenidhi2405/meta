import React from 'react';
import { useStory } from '../../engine/StoryContext';
import { CASE_ARCHIVES, CaseArchiveItem } from '../../data/caseArchives';
import { ArrowLeft, Play, Lock, Clock, Eye, Sparkles, FolderArchive, Film } from 'lucide-react';

export const StorySelectionPage: React.FC = () => {
  const { setCurrentPage, play } = useStory();

  const handleLaunchCase = (item: CaseArchiveItem) => {
    if (item.status === 'available') {
      setCurrentPage('player');
      play();
    }
  };

  return (
    <div className="min-h-screen bg-cinema-bg text-slate-100 flex flex-col font-sans selection:bg-gold/30">
      {/* Top Header */}
      <header className="bg-cinema-surface/90 border-b border-cinema-border px-6 py-4 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('landing')}
            data-testid="story-select-back-to-landing-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cinema-panel hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors border border-cinema-border"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
          <div className="h-6 w-px bg-cinema-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-gold" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
              Case Archives & Narrative Dossiers
            </span>
          </div>
        </div>

        <div className="text-xs font-mono text-gold-light bg-amber-950/40 border border-gold/40 px-3 py-1 rounded-full">
          DIRECTOR'S CUT // SEASON 1
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select An Investigation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-cinematic font-bold text-slate-100 tracking-wide">
            Interactive Cinematic Stories
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Every case is built with synchronized multi-character timelines, hidden clues, and divergent conclusions. Choose a file to begin.
          </p>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_ARCHIVES.map((item) => {
            const isAvailable = item.status === 'available';

            return (
              <div
                key={item.id}
                data-testid={`case-card-${item.id}`}
                className={`relative rounded-2xl border p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 ${
                  isAvailable
                    ? 'bg-cinema-surface border-cinema-border hover:border-gold/60 hover:-translate-y-1'
                    : 'bg-cinema-surface/40 border-cinema-border/50 opacity-70'
                }`}
              >
                {/* Background ambient gradient glow */}
                <div
                  style={{ background: item.posterBg }}
                  className="absolute inset-0 opacity-20 pointer-events-none"
                />

                <div className="relative z-10">
                  {/* Status & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                        isAvailable
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {isAvailable ? 'FEATURED CASE' : 'COMING SOON'}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      {item.rating}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h2 className="text-xl font-cinematic font-bold text-slate-100 mb-1">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gold-light italic font-serif mb-4">
                    "{item.tagline}"
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {item.summary}
                  </p>

                  {/* Case Metadata Pills */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-6">
                    <div className="flex items-center gap-1.5 p-2 rounded bg-black/40 border border-cinema-border text-slate-300">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>{item.runtime}</span>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded bg-black/40 border border-cinema-border text-slate-300">
                      <Eye className="w-3 h-3 text-sky-400" />
                      <span>{item.perspectivesCount} Perspectives</span>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded bg-black/40 border border-cinema-border text-slate-300">
                      <Film className="w-3 h-3 text-rose-400" />
                      <span>{item.genre.split('/')[0]}</span>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded bg-black/40 border border-cinema-border text-slate-300">
                      <Sparkles className="w-3 h-3 text-gold-light" />
                      <span>{item.difficulty}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="relative z-10 pt-4 border-t border-cinema-border/60">
                  {isAvailable ? (
                    <button
                      onClick={() => handleLaunchCase(item)}
                      data-testid="launch-featured-case-btn"
                      className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-light text-cinema-bg font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Experience</span>
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-xl bg-cinema-panel text-slate-500 font-mono text-xs flex items-center justify-center gap-2 border border-cinema-border">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked // Classified Dossier</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
