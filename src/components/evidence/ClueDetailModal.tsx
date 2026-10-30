import React from 'react';
import { Clue, PerspectiveId } from '../../types/story';
import {
  X,
  Play,
  FileSearch,
  AlertTriangle,
  Fingerprint,
  Mic,
  Clock,
  Camera,
  Anchor,
  HelpCircle,
  Eye,
  ShieldAlert,
  User,
} from 'lucide-react';

interface ClueDetailModalProps {
  clue: Clue | null;
  onClose: () => void;
  onResume: () => void;
  onJumpToTimestamp: (time: number) => void;
}

export const ClueDetailModal: React.FC<ClueDetailModalProps> = ({
  clue,
  onClose,
  onResume,
  onJumpToTimestamp,
}) => {
  if (!clue) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Anchor':
        return <Anchor className="w-6 h-6 text-gold" />;
      case 'Mic':
        return <Mic className="w-6 h-6 text-gold" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-gold" />;
      case 'Camera':
        return <Camera className="w-6 h-6 text-gold" />;
      case 'FileText':
        return <FileSearch className="w-6 h-6 text-gold" />;
      default:
        return <Fingerprint className="w-6 h-6 text-gold" />;
    }
  };

  const getPerspectiveBadge = (p: PerspectiveId) => {
    switch (p) {
      case 'witness':
        return { label: 'Witness Perspective', color: 'text-sky-400 bg-sky-950/60 border-sky-600/40' };
      case 'suspect':
        return { label: 'Suspect Perspective', color: 'text-rose-400 bg-rose-950/60 border-rose-600/40' };
      case 'victim':
        return { label: 'Victim Perspective', color: 'text-amber-400 bg-amber-950/60 border-amber-600/40' };
    }
  };

  const badge = getPerspectiveBadge(clue.perspectiveId);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
      data-testid="clue-detail-modal"
    >
      <div
        className="relative w-full max-w-3xl bg-cinema-surface border border-gold/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cinema-border bg-cinema-panel/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/10 border border-gold/30">
              {renderIcon(clue.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border text-gold bg-amber-950/40 border-gold/40">
                  Forensic Clue #{clue.id.replace('clue-', '').toUpperCase()}
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <h2 className="text-xl font-cinematic font-bold text-slate-100 tracking-wide mt-1">
                {clue.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            data-testid="close-clue-modal-btn"
            className="w-9 h-9 rounded-lg bg-cinema-bg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-cinema-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Summary & Microscopic Inspection */}
          <div>
            <h3 className="text-xs uppercase font-mono text-slate-400 tracking-wider mb-2 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-gold" />
              <span>Evidence Description</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed bg-cinema-bg/80 p-4 rounded-xl border border-cinema-border">
              {clue.description}
            </p>
          </div>

          {/* Deep Analysis */}
          <div>
            <h3 className="text-xs uppercase font-mono text-slate-400 tracking-wider mb-2 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>Forensic Laboratory Analysis</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed bg-cinema-bg/80 p-4 rounded-xl border border-cinema-border border-l-2 border-l-cyan-400">
              {clue.detailedAnalysis}
            </p>
          </div>

          {/* Character Contradiction Matrix */}
          <div>
            <h3 className="text-xs uppercase font-mono text-gold-light tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gold" />
              <span>Perspective Contradictions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Witness interpretation */}
              <div className="bg-sky-950/20 border border-sky-900/60 p-3.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 mb-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Marcus Ward (Witness)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{clue.contradictions.witness}"
                </p>
              </div>

              {/* Suspect interpretation */}
              <div className="bg-rose-950/20 border border-rose-900/60 p-3.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Julian Mercer (Suspect)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{clue.contradictions.suspect}"
                </p>
              </div>

              {/* Victim interpretation */}
              <div className="bg-amber-950/20 border border-amber-900/60 p-3.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gold mb-2">
                  <User className="w-3.5 h-3.5" />
                  <span>Elena Vance (Victim)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{clue.contradictions.victim}"
                </p>
              </div>
            </div>
          </div>

          {/* Case Significance */}
          <div className="bg-cinema-panel p-4 rounded-xl border border-cinema-border flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono uppercase text-gold tracking-wide font-semibold block mb-1">
                Investigative Value
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {clue.significance}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-cinema-border bg-cinema-panel/60">
          <button
            onClick={() => {
              onJumpToTimestamp(clue.appearsAt);
              onClose();
            }}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-gold transition-colors"
          >
            <span>Jump to Timecode:</span>
            <span className="bg-black/60 px-2 py-1 rounded text-gold-light border border-cinema-border font-bold">
              00:{Math.floor(clue.appearsAt / 60).toString().padStart(2, '0')}:{(clue.appearsAt % 60).toString().padStart(2, '0')}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-cinema-border"
            >
              Keep Investigating
            </button>
            <button
              onClick={onResume}
              data-testid="resume-playback-modal-btn"
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-cinema-bg bg-gold hover:bg-gold-light rounded-lg transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Playback</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
