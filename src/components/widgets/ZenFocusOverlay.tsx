import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimerMode, UserStats } from '../../types';
import { Play, Pause, Maximize2, Minimize2, ChevronDown, Eye } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface ZenFocusOverlayProps {
  timerMode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  userStats: UserStats;
  onToggleTimer: () => void;
  onChangeMode: (mode: TimerMode, durationMinutes?: number) => void;
  onExitZenMode: () => void;
  onPetMochi: () => void;
}

export const ZenFocusOverlay: React.FC<ZenFocusOverlayProps> = ({
  timerMode,
  timeLeft,
  isRunning,
  userStats,
  onToggleTimer,
  onChangeMode,
  onExitZenMode,
  onPetMochi,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const modeLabels: Record<TimerMode, string> = {
    focus: 'Classic',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    custom: 'Custom Timer',
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 select-none font-['Fredoka']">
      {/* CENTER MINIMALIST FOCUS CARD (Matching user's screenshots) */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-2xl rounded-[32px] p-6 sm:px-8 sm:py-7 max-w-[360px] w-full pointer-events-auto"
        >
          {/* Top Row: Label, Mode Dropdown, Fullscreen toggle */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-500">
              Deep Work Focus
            </span>

            <div className="flex items-center gap-2 relative">
              {/* Mode Dropdown Selector */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/70 hover:bg-white/90 border border-white/80 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors"
              >
                <span>{modeLabels[timerMode]}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-xl bg-white/60 hover:bg-white/90 border border-white/80 text-slate-600 shadow-xs transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-9 w-40 bg-white/95 backdrop-blur-xl border border-white rounded-2xl shadow-xl p-1.5 z-30 flex flex-col gap-1 text-xs"
                  >
                    <button
                      onClick={() => {
                        audioEngine.playClickSfx();
                        onChangeMode('focus', 25);
                        setDropdownOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-left font-semibold transition-colors ${
                        timerMode === 'focus' ? 'bg-[#C1E1C1] text-slate-800' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Classic (25:00)
                    </button>
                    <button
                      onClick={() => {
                        audioEngine.playClickSfx();
                        onChangeMode('focus', 50);
                        setDropdownOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl text-left font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Deep Sprint (50:00)
                    </button>
                    <button
                      onClick={() => {
                        audioEngine.playClickSfx();
                        onChangeMode('shortBreak', 5);
                        setDropdownOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-left font-semibold transition-colors ${
                        timerMode === 'shortBreak' ? 'bg-[#FFD1DC] text-slate-800' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Short Break (5:00)
                    </button>
                    <button
                      onClick={() => {
                        audioEngine.playClickSfx();
                        onChangeMode('longBreak', 15);
                        setDropdownOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-left font-semibold transition-colors ${
                        timerMode === 'longBreak' ? 'bg-[#E6E6FA] text-slate-800' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Long Rest (15:00)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Time Display & Play/Pause Button */}
          <div className="flex items-center justify-between gap-6 pt-1">
            <span className="text-4xl sm:text-5xl font-light tracking-tight text-slate-700 font-['Nunito']">
              {formatTime(timeLeft)}
            </span>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                audioEngine.playClickSfx();
                onToggleTimer();
              }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border border-white/80 transition-colors ${
                isRunning
                  ? 'bg-[#FFD1DC] text-slate-800 shadow-pink-100'
                  : 'bg-[#C1E1C1] text-slate-800 shadow-emerald-100'
              }`}
              title={isRunning ? 'Pause timer' : 'Start focus timer'}
            >
              {isRunning ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM CENTER: Restore Workspace Pill (Matching user's screenshots) */}
      <div className="flex justify-center mb-16 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            audioEngine.playClickSfx();
            onExitZenMode();
          }}
          className="bg-white/80 hover:bg-white/95 backdrop-blur-md px-5 py-2 rounded-full border border-white/80 shadow-lg text-xs font-semibold text-slate-700 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Eye size={15} className="text-rose-400" />
          <span>Zen Mode Active • Click to restore workspace</span>
        </motion.button>
      </div>

      {/* BOTTOM LEFT: Cute Pet Status Badge (Matching user's screenshots) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            audioEngine.playMochiPetSfx();
            onPetMochi();
          }}
          className="flex flex-col items-center cursor-pointer group"
          title="Click to pet Mochi!"
        >
          {/* Mini Mochi Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-center mb-1.5">
            <span className="text-2xl">🐰</span>
          </div>

          <div className="bg-white/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/80 shadow-xs text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <span>🐾</span>
            <span>Mochi Happy</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
