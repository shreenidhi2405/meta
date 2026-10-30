import React, { useState } from 'react';
import { useStory } from '../../engine/StoryContext';
import { VerdictType } from '../../types/story';
import { Gavel, ArrowLeft, Check, ShieldCheck, AlertCircle, Sparkles, Scale } from 'lucide-react';

export const DecisionRoom: React.FC = () => {
  const { config, state, selectVerdict, setCurrentPage } = useStory();
  const [selectedVerdictId, setSelectedVerdictId] = useState<VerdictType>('manipulation');

  const { verdicts, clues } = config;
  const { discoveredClueIds } = state;

  const currentOption = verdicts[selectedVerdictId];

  const handleConfirmVerdict = () => {
    selectVerdict(selectedVerdictId);
  };

  const verdictKeys: VerdictType[] = ['accident', 'murder', 'manipulation'];

  return (
    <div className="min-h-screen bg-cinema-bg text-slate-100 flex flex-col font-sans selection:bg-gold/30">
      {/* Top Header */}
      <div className="bg-cinema-surface/90 border-b border-cinema-border px-6 py-4 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('evidence')}
          data-testid="decision-back-to-evidence-btn"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cinema-panel hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors border border-cinema-border"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Review Evidence Board</span>
        </button>

        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-gold" />
          <span className="text-xs uppercase font-mono tracking-widest text-gold-light">
            Final Verdict Chamber
          </span>
        </div>

        <button
          onClick={() => setCurrentPage('player')}
          className="text-xs font-mono text-slate-400 hover:text-white"
        >
          Return to Cinema
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-gold/40 text-gold-light text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audience Deliberation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-cinematic font-bold tracking-wide text-slate-100">
            What Really Happened on the Rooftop?
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mt-2">
            You have examined the testimonies and observed the synchronized timeline.
            Three interpretations exist. Choose the conclusion supported by your forensic analysis.
          </p>
        </div>

        {/* 3 Verdict Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {verdictKeys.map((vKey) => {
            const option = verdicts[vKey];
            const isSelected = selectedVerdictId === vKey;

            return (
              <div
                key={vKey}
                onClick={() => setSelectedVerdictId(vKey)}
                data-testid={`verdict-option-${vKey}`}
                className={`relative rounded-2xl border p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-cinema-surface border-gold shadow-[0_0_30px_rgba(245,158,11,0.25)] scale-[1.02]'
                    : 'bg-cinema-surface/60 border-cinema-border hover:border-slate-600 hover:bg-cinema-surface'
                }`}
              >
                {/* Active check pill */}
                {isSelected && (
                  <div className="absolute -top-3 right-5 bg-gold text-cinema-bg text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Selected</span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-2">
                    Theory #{vKey.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-cinematic font-bold text-slate-100 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-xs text-gold-light italic font-serif mb-4">
                    "{option.tagline}"
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {option.summary}
                  </p>
                </div>

                {/* Corroborating Clues Match */}
                <div className="mt-5 pt-4 border-t border-cinema-border/80">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                    Corroborating Evidence:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {option.keyCorroboratingClues.map((clueId) => {
                      const clue = clues.find((c) => c.id === clueId);
                      const isFound = discoveredClueIds.includes(clueId);

                      return (
                        <span
                          key={clueId}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                            isFound
                              ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          {isFound ? (
                            <ShieldCheck className="w-2.5 h-2.5 text-cyan-400" />
                          ) : (
                            <AlertCircle className="w-2.5 h-2.5 text-slate-600" />
                          )}
                          <span>{clue ? clue.title.split(' ')[0] : clueId}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Theory Detailed Synopsis & Lock-in Button */}
        <div className="bg-cinema-surface/90 border border-cinema-border p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-gold font-bold">
                Locking in verdict:
              </span>
              <span className="text-sm font-cinematic font-bold text-slate-100">
                {currentOption.title}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              This choice will commit your forensic ruling, reveal the final cinematic resolution sequence, and display the character epilogues.
            </p>
          </div>

          <button
            onClick={handleConfirmVerdict}
            data-testid="lock-in-verdict-btn"
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 text-cinema-bg font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <Gavel className="w-4 h-4 fill-current" />
            <span>Lock In Ruling & View Ending</span>
          </button>
        </div>
      </div>
    </div>
  );
};

