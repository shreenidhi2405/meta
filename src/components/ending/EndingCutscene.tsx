import React, { useState } from 'react';
import { useStory } from '../../engine/StoryContext';
import { VerdictType } from '../../types/story';
import {
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Eye,
  ShieldAlert,
  User,
  Clock,
  Film,
} from 'lucide-react';

export const EndingCutscene: React.FC = () => {
  const { config, state, selectVerdict, restartExperience, setCurrentPage, setIsCreditsOpen } = useStory();
  const [activeEndingTab, setActiveEndingTab] = useState<'resolution' | 'epilogue' | 'autopsy'>('resolution');

  const selectedVerdict = state.selectedVerdict || 'manipulation';
  const verdictData = config.verdicts[selectedVerdict];
  const { clues, perspectives } = config;
  const { discoveredClueIds } = state;

  const missedClues = clues.filter((c) => !discoveredClueIds.includes(c.id));

  const allVerdicts: VerdictType[] = ['accident', 'murder', 'manipulation'];

  return (
    <div className="min-h-screen bg-cinema-bg text-slate-100 flex flex-col font-sans selection:bg-gold/30">
      {/* Top Bar */}
      <div className="bg-cinema-surface/90 border-b border-cinema-border px-6 py-4 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-gold" />
          <span className="text-xs uppercase font-mono tracking-widest text-gold-light">
            Cinematic Resolution & Case Epilogue
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreditsOpen(true)}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            Credits & Statement
          </button>
          <button
            onClick={() => restartExperience(true)}
            data-testid="replay-experience-btn"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 text-gold-light border border-gold/40 text-xs font-mono transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Experience</span>
          </button>
        </div>
      </div>

      {/* Main Resolution Container */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10 space-y-8">
        {/* Dramatic Cinematic Verdict Banner */}
        <div className="text-center space-y-3 py-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/40 border border-gold/40 text-gold-light text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audience Interpretation Recorded</span>
          </span>

          <h1 className="text-3xl md:text-5xl font-cinematic font-bold tracking-wider text-slate-100 uppercase">
            {verdictData.cinematicResolutionTitle}
          </h1>

          <p className="text-sm md:text-base text-gold-light italic max-w-2xl mx-auto font-serif">
            "{verdictData.tagline}"
          </p>
        </div>

        {/* Forensic Accuracy Rating Card */}
        <div className="bg-cinema-surface border border-cinema-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Forensic Alignment Score:
                </span>
                <span className="text-lg font-mono font-bold text-gold-light">
                  {verdictData.forensicAccuracy}%
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {verdictData.verdictRationale}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono text-slate-400 block mb-1">Clues Unlocked:</span>
            <span className="text-sm font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-lg">
              {discoveredClueIds.length} of {clues.length} Total Clues
            </span>
          </div>
        </div>

        {/* Sub-Tabs: Resolution / Epilogue / Timeline Autopsy */}
        <div className="flex items-center gap-2 border-b border-cinema-border pb-3 text-xs font-mono">
          <button
            onClick={() => setActiveEndingTab('resolution')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeEndingTab === 'resolution'
                ? 'bg-gold/20 border-gold/50 text-gold-light'
                : 'bg-cinema-surface border-cinema-border text-slate-400 hover:text-slate-200'
            }`}
          >
            The Cinematic Truth
          </button>

          <button
            onClick={() => setActiveEndingTab('epilogue')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeEndingTab === 'epilogue'
                ? 'bg-gold/20 border-gold/50 text-gold-light'
                : 'bg-cinema-surface border-cinema-border text-slate-400 hover:text-slate-200'
            }`}
          >
            Character Epilogues (3)
          </button>

          <button
            onClick={() => setActiveEndingTab('autopsy')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeEndingTab === 'autopsy'
                ? 'bg-gold/20 border-gold/50 text-gold-light'
                : 'bg-cinema-surface border-cinema-border text-slate-400 hover:text-slate-200'
            }`}
          >
            Timeline Autopsy ({missedClues.length} Missed Clues)
          </button>
        </div>

        {/* Tab 1: Resolution */}
        {activeEndingTab === 'resolution' && (
          <div className="bg-cinema-surface border border-cinema-border p-8 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-cinematic font-bold text-slate-100 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-gold" />
              <span>Full Narrative Resolution</span>
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans bg-cinema-bg/80 p-6 rounded-xl border border-cinema-border border-l-4 border-l-gold">
              {verdictData.cinematicResolutionText}
            </p>

            {/* Alternate Endings Explorer */}
            <div className="pt-6 border-t border-cinema-border">
              <h3 className="text-xs uppercase font-mono text-slate-400 tracking-wider mb-3">
                Explore Alternate Perspectives & Endings:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {allVerdicts.map((key) => {
                  const item = config.verdicts[key];
                  const isCurrent = key === selectedVerdict;

                  return (
                    <button
                      key={key}
                      onClick={() => selectVerdict(key)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-gold/15 border-gold text-gold-light'
                          : 'bg-cinema-bg hover:bg-slate-800 border-cinema-border text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase block text-slate-500 mb-1">
                        Theory #{key}
                      </span>
                      <span className="text-xs font-bold font-cinematic block mb-1 text-slate-200">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 line-clamp-2">
                        {item.tagline}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Epilogue */}
        {activeEndingTab === 'epilogue' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Witness Epilogue */}
            <div className="bg-cinema-surface border border-sky-900/50 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-sky-400 block">
                    {perspectives.witness.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    The Witness
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-cinema-border">
                {verdictData.epilogue.witness}
              </p>
            </div>

            {/* Suspect Epilogue */}
            <div className="bg-cinema-surface border border-rose-900/50 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-400 block">
                    {perspectives.suspect.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    The Suspect
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-cinema-border">
                {verdictData.epilogue.suspect}
              </p>
            </div>

            {/* Victim Epilogue */}
            <div className="bg-cinema-surface border border-amber-900/50 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-gold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gold block">
                    {perspectives.victim.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    The Deceased
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-cinema-border">
                {verdictData.epilogue.victimAftermath}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Timeline Autopsy (Missed Clues) */}
        {activeEndingTab === 'autopsy' && (
          <div className="bg-cinema-surface border border-cinema-border p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="text-base font-cinematic font-bold text-slate-100 mb-1">
                Timeline Autopsy & Missed Evidence
              </h2>
              <p className="text-xs text-slate-400">
                Review which evidence you overlooked during your initial investigation across the three perspectives.
              </p>
            </div>

            {missedClues.length === 0 ? (
              <div className="p-8 text-center bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-2">
                <span className="text-cyan-400 font-mono text-sm font-bold block">
                  ★ 100% FORENSIC MASTERY ACHIEVED ★
                </span>
                <p className="text-xs text-slate-300">
                  You discovered every piece of evidence hidden across all three timelines!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missedClues.map((clue) => (
                  <div
                    key={clue.id}
                    className="p-4 rounded-xl bg-cinema-bg border border-amber-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-cinematic font-bold text-gold-light">
                        {clue.title}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-gold" />
                        <span>00:{Math.floor(clue.appearsAt / 60).toString().padStart(2, '0')}:{(clue.appearsAt % 60).toString().padStart(2, '0')}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Hidden in <strong className="text-slate-300 capitalize">{clue.perspectiveId}</strong> perspective. {clue.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-cinema-border">
          <button
            onClick={() => setCurrentPage('evidence')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cinema-surface hover:bg-slate-800 border border-cinema-border text-xs font-mono text-slate-300"
          >
            <Layers className="w-4 h-4 text-gold" />
            <span>Review Full Evidence Board</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => restartExperience(false)}
              className="px-4 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800 text-rose-300 text-xs font-mono transition-colors"
            >
              Reset All Evidence & Restart Fresh
            </button>

            <button
              onClick={() => {
                restartExperience(true);
                setCurrentPage('player');
              }}
              data-testid="replay-cinema-btn"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-cinema-bg font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
            >
              <span>Replay in Cinematic Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

