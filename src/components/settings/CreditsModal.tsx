import React from 'react';
import { useStory } from '../../engine/StoryContext';
import { X, Film, Award, Code, Heart } from 'lucide-react';

export const CreditsModal: React.FC = () => {
  const { isCreditsOpen, setIsCreditsOpen, config } = useStory();

  if (!isCreditsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => setIsCreditsOpen(false)}
      data-testid="credits-modal"
    >
      <div
        className="relative w-full max-w-2xl bg-cinema-surface border border-cinema-border rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cinema-border pb-4">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-cinematic font-bold text-slate-100">
              DIRECTOR'S CUT // Production Credits
            </h2>
          </div>
          <button
            onClick={() => setIsCreditsOpen(false)}
            data-testid="close-credits-btn"
            className="w-8 h-8 rounded-lg bg-cinema-bg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-cinema-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Director's Cut Statement */}
        <div className="bg-cinema-bg p-5 rounded-xl border border-cinema-border space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold">
            <Award className="w-4 h-4" />
            <span>Director's Cut Philosophical Statement</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic font-serif">
            "Cinema has traditionally coerced the spectator into an authoritarian point-of-view: the lens of the director. In <em>The Last Witness</em>, we shatter this singular vantage. By synchronizing three contradictory perspectives upon a single timeline, the narrative ceases to be a static object and transforms into a forensic puzzle. Truth is no longer revealed to the viewer—it is constructed by them."
          </p>
          <span className="text-[10px] font-mono text-slate-400 block text-right">
            — The Creative Engineering Team, 2026
          </span>
        </div>

        {/* Cast & Perspectives */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            Principal Perspectives & Cast
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-cinema-panel rounded-lg border border-cinema-border text-xs">
              <span className="text-sky-400 font-bold block">{config.perspectives.witness.name}</span>
              <span className="text-[10px] text-slate-400 block mb-1">The Observant Neighbor</span>
              <span className="text-[10px] text-slate-500 italic">{config.perspectives.witness.actor}</span>
            </div>

            <div className="p-3 bg-cinema-panel rounded-lg border border-cinema-border text-xs">
              <span className="text-rose-400 font-bold block">{config.perspectives.suspect.name}</span>
              <span className="text-[10px] text-slate-400 block mb-1">The Accused Partner</span>
              <span className="text-[10px] text-slate-500 italic">{config.perspectives.suspect.actor}</span>
            </div>

            <div className="p-3 bg-cinema-panel rounded-lg border border-cinema-border text-xs">
              <span className="text-gold font-bold block">{config.perspectives.victim.name}</span>
              <span className="text-[10px] text-slate-400 block mb-1">The Deceased Auditor</span>
              <span className="text-[10px] text-slate-500 italic">{config.perspectives.victim.actor}</span>
            </div>
          </div>
        </div>

        {/* Architectural Highlights */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Decoupled Storytelling Engine Architecture</span>
          </h3>
          <div className="p-4 bg-cinema-bg rounded-xl border border-cinema-border text-xs text-slate-300 space-y-2">
            <p>
              • <strong>Pure TypeScript Core:</strong> The <code className="text-gold">StoryEngine</code>, <code className="text-gold">TimelineManager</code>, and <code className="text-gold">AudioSynthesizer</code> are completely isolated from React UI components, enabling future compilation to WebXR, Three.js, and immersive headset runtimes.
            </p>
            <p>
              • <strong>Zero Audio Overlap:</strong> Dynamic Web Audio API audio graph ensures perspective switching preserves instant continuous playback with seamless sound crossfading and zero duplicate media artifacts.
            </p>
            <p>
              • <strong>Full Test Coverage:</strong> Validated through Vitest unit tests for timeline synchronization, perspective switching, and clue discovery, plus Playwright end-to-end browser workflows.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-cinema-border text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for Interactive Cinematic Storytelling</span>
          </div>

          <button
            onClick={() => setIsCreditsOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

