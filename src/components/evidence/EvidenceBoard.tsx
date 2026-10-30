import React, { useState } from 'react';
import { useStory } from '../../engine/StoryContext';
import { PerspectiveId } from '../../types/story';
import {
  Layers,
  ArrowLeft,
  Gavel,
  CheckCircle2,
  Lock,
  Eye,
  ShieldAlert,
  User,
  Filter,
  Play,
  FileQuestion,
} from 'lucide-react';

export const EvidenceBoard: React.FC = () => {
  const { config, state, setCurrentPage, inspectClue, seek, play } = useStory();
  const [filterPerspective, setFilterPerspective] = useState<PerspectiveId | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'board' | 'statements'>('board');

  const { clues, perspectives } = config;
  const { discoveredClueIds } = state;

  const filteredClues = clues.filter((clue) => {
    if (filterPerspective === 'all') return true;
    return clue.perspectiveId === filterPerspective;
  });

  const discoveredCount = discoveredClueIds.length;
  const totalClues = clues.length;
  const completionPercentage = Math.round((discoveredCount / totalClues) * 100);

  return (
    <div className="min-h-screen bg-cinema-bg text-slate-100 flex flex-col font-sans selection:bg-gold/30">
      {/* Top Header / Dossier Bar */}
      <div className="bg-cinema-surface/90 border-b border-cinema-border px-6 py-4 backdrop-blur-md sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('player')}
            data-testid="back-to-player-btn"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cinema-panel hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors border border-cinema-border"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cinema</span>
          </button>

          <div className="h-6 w-px bg-cinema-border hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold bg-amber-950/40 border border-gold/30 px-2 py-0.5 rounded">
                Case #{config.caseNumber}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Evidence Repository
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-cinematic font-bold text-slate-100">
              {config.title} // Crime Scene Reconstruction
            </h1>
          </div>
        </div>

        {/* Progress & Decision CTA */}
        <div className="flex items-center gap-4">
          {/* Completion Meter */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Forensic Recovery:</span>
              <span className="text-gold-light font-bold">
                {discoveredCount}/{totalClues} ({completionPercentage}%)
              </span>
            </div>
            <div className="w-36 h-2 bg-slate-900 rounded-full mt-1 overflow-hidden border border-cinema-border">
              <div
                style={{ width: `${completionPercentage}%` }}
                className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full"
              />
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('decision')}
            data-testid="proceed-to-verdict-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-cinema-bg font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95"
          >
            <Gavel className="w-4 h-4" />
            <span>Deliver Final Verdict</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="bg-cinema-surface/50 border-b border-cinema-border px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              activeTab === 'board'
                ? 'bg-gold/20 border-gold/50 text-gold-light shadow-sm'
                : 'bg-cinema-panel border-cinema-border text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Evidence Pinboard</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('statements')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              activeTab === 'statements'
                ? 'bg-gold/20 border-gold/50 text-gold-light shadow-sm'
                : 'bg-cinema-panel border-cinema-border text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Contradictory Statements</span>
            </span>
          </button>
        </div>

        {/* Perspective Filters */}
        {activeTab === 'board' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>

            <button
              onClick={() => setFilterPerspective('all')}
              className={`px-2.5 py-1 rounded border transition-colors ${
                filterPerspective === 'all'
                  ? 'bg-slate-700 border-slate-500 text-white'
                  : 'bg-cinema-bg border-cinema-border text-slate-400 hover:text-slate-200'
              }`}
            >
              All Clues ({clues.length})
            </button>

            <button
              onClick={() => setFilterPerspective('witness')}
              className={`px-2.5 py-1 rounded border flex items-center gap-1.5 transition-colors ${
                filterPerspective === 'witness'
                  ? 'bg-sky-950/70 border-sky-500 text-sky-300'
                  : 'bg-cinema-bg border-cinema-border text-slate-400 hover:text-sky-300'
              }`}
            >
              <Eye className="w-3 h-3 text-sky-400" />
              <span>Witness</span>
            </button>

            <button
              onClick={() => setFilterPerspective('suspect')}
              className={`px-2.5 py-1 rounded border flex items-center gap-1.5 transition-colors ${
                filterPerspective === 'suspect'
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                  : 'bg-cinema-bg border-cinema-border text-slate-400 hover:text-rose-300'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>Suspect</span>
            </button>

            <button
              onClick={() => setFilterPerspective('victim')}
              className={`px-2.5 py-1 rounded border flex items-center gap-1.5 transition-colors ${
                filterPerspective === 'victim'
                  ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                  : 'bg-cinema-bg border-cinema-border text-slate-400 hover:text-amber-300'
              }`}
            >
              <User className="w-3 h-3 text-gold" />
              <span>Victim</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Board Canvas */}
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'board' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClues.map((clue) => {
              const isDiscovered = discoveredClueIds.includes(clue.id);

              return (
                <div
                  key={clue.id}
                  onClick={() => {
                    if (isDiscovered) {
                      inspectClue(clue.id);
                    }
                  }}
                  data-testid={`evidence-card-${clue.id}`}
                  className={`group relative rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden shadow-xl ${
                    isDiscovered
                      ? 'bg-cinema-surface/90 border-cinema-border hover:border-gold/60 cursor-pointer hover:shadow-2xl hover:-translate-y-1'
                      : 'bg-cinema-surface/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  {/* Subtle Top Tape / Pin effect */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2.5 bg-slate-700/40 rounded-b border-b border-cinema-border" />

                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-cinema-border">
                        {clue.category}
                      </span>

                      {isDiscovered ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Examined</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-black/60 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3" />
                          <span>Undiscovered</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-cinematic font-bold text-slate-100 group-hover:text-gold-light transition-colors mb-2">
                      {clue.title}
                    </h3>

                    {/* Description or Obfuscated prompt */}
                    {isDiscovered ? (
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                        {clue.description}
                      </p>
                    ) : (
                      <div className="bg-black/50 p-3 rounded-lg border border-slate-800/80 mb-4 text-xs text-slate-500 italic">
                        Hidden forensic item at timestamp 00:{Math.floor(clue.appearsAt / 60).toString().padStart(2, '0')}:{(clue.appearsAt % 60).toString().padStart(2, '0')}. Watch from {perspectives[clue.perspectiveId].name}'s perspective to reveal.
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-cinema-border/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      Found in: <strong className="text-slate-200 capitalize">{clue.perspectiveId}</strong>
                    </span>

                    {isDiscovered ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          inspectClue(clue.id);
                        }}
                        className="text-gold hover:text-gold-light font-semibold hover:underline"
                      >
                        Inspect Dossier →
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          seek(clue.appearsAt);
                          play();
                          setCurrentPage('player');
                        }}
                        className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Replay Scene</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Statement Comparison Grid */
          <div className="space-y-6">
            <div className="bg-cinema-surface/70 border border-cinema-border p-6 rounded-2xl">
              <h2 className="text-base font-cinematic font-bold text-gold-light mb-1">
                Comparative Character Deposition Analysis
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Contrast the three opposing interpretations documented for every critical piece of evidence.
              </p>

              <div className="space-y-6">
                {clues.map((clue) => {
                  const isDiscovered = discoveredClueIds.includes(clue.id);

                  return (
                    <div
                      key={clue.id}
                      className="border border-cinema-border rounded-xl bg-cinema-bg/70 p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-cinematic font-bold text-slate-200">
                            {clue.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase bg-cinema-panel px-2 py-0.5 rounded border border-cinema-border">
                            {clue.category}
                          </span>
                        </div>
                        {!isDiscovered && (
                          <span className="text-[10px] font-mono text-amber-500 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                            Undiscovered Clue
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-900/50">
                          <span className="text-sky-400 font-bold block mb-1">
                            Marcus Ward (Witness):
                          </span>
                          <p className="text-slate-300 italic">
                            "{clue.contradictions.witness}"
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/50">
                          <span className="text-rose-400 font-bold block mb-1">
                            Julian Mercer (Suspect):
                          </span>
                          <p className="text-slate-300 italic">
                            "{clue.contradictions.suspect}"
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/50">
                          <span className="text-gold font-bold block mb-1">
                            Elena Vance (Victim):
                          </span>
                          <p className="text-slate-300 italic">
                            "{clue.contradictions.victim}"
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
