import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TimerMode } from '../../types';
import { Play, Pause, RotateCcw, SkipForward, Sparkles, ChevronDown, ChevronUp, Clock, Volume2, VolumeX, Target } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface PomodoroWidgetProps {
  timerMode: TimerMode;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  sessionsCompletedToday: number;
  todayFocusSeconds: number;
  dailyFocusGoalMinutes: number;
  onUpdateDailyGoal: (minutes: number) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  onChangeMode: (mode: TimerMode, durationMinutes?: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({
  timerMode,
  timeLeft,
  totalDuration,
  isRunning,
  sessionsCompletedToday,
  todayFocusSeconds,
  dailyFocusGoalMinutes,
  onUpdateDailyGoal,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  onChangeMode,
  soundEnabled,
  onToggleSound,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(30);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculations for Progress Rings
  const safeTodaySecs = Number(todayFocusSeconds) || 0;
  const todayFocusMinutes = Math.floor(safeTodaySecs / 60);
  const goalMinutes = Math.max(1, Number(dailyFocusGoalMinutes) || 120);
  const dailyProgressPercent = Math.min(100, Math.max(0, (todayFocusMinutes / goalMinutes) * 100));

  // Outer ring: Daily Goal Progress (fills up as sessions are completed & focus time accumulates)
  const outerRadius = 66;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const rawOuterOffset = outerCircumference - (dailyProgressPercent / 100) * outerCircumference;
  const outerStrokeDashoffset = isNaN(rawOuterOffset) ? outerCircumference : rawOuterOffset;

  // Inner ring: Current Session Countdown Progress
  const safeTotalDuration = Number(totalDuration) || 1;
  const safeTimeLeft = Number(timeLeft) || 0;
  const sessionProgressPercent = safeTotalDuration > 0 ? Math.min(100, Math.max(0, ((safeTotalDuration - safeTimeLeft) / safeTotalDuration) * 100)) : 0;
  const innerRadius = 55;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const rawInnerOffset = innerCircumference - (sessionProgressPercent / 100) * innerCircumference;
  const innerStrokeDashoffset = isNaN(rawInnerOffset) ? innerCircumference : rawInnerOffset;

  const modeTheme = {
    focus: {
      title: 'Focus Session',
      subtitle: 'Mochi is typing notes...',
      color: '#FF6B8B',
      bgColor: 'bg-[#FFF0F3]',
      borderColor: 'border-[#FFD1DC]',
      badgeColor: 'bg-[#FFD1DC] text-[#9C27B0]',
      icon: '✍️',
    },
    shortBreak: {
      title: 'Short Tea Break',
      subtitle: 'Sip some tea & stretch!',
      color: '#81C784',
      bgColor: 'bg-[#F1F8E9]',
      borderColor: 'border-[#C8E6C9]',
      badgeColor: 'bg-[#C8E6C9] text-[#2E7D32]',
      icon: '🍵',
    },
    longBreak: {
      title: 'Cozy Long Rest',
      subtitle: 'Snack, nap, or look outside',
      color: '#B39DDB',
      bgColor: 'bg-[#EDE7F6]',
      borderColor: 'border-[#D1C4E9]',
      badgeColor: 'bg-[#D1C4E9] text-[#512DA8]',
      icon: '🌙',
    },
    custom: {
      title: 'Custom Timer',
      subtitle: 'Your personalized time goal',
      color: '#FFB74D',
      bgColor: 'bg-[#FFF8E1]',
      borderColor: 'border-[#FFE082]',
      badgeColor: 'bg-[#FFE082] text-[#E65100]',
      icon: '⏱️',
    },
  }[timerMode];

  return (
    <motion.div
      id="pomodoro-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] shadow-xl p-5 text-slate-700 font-['Fredoka'] max-w-[330px] w-full"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/60 border border-white/80 flex items-center justify-center text-lg shadow-xs">
            {modeTheme.icon}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight text-slate-700">{modeTheme.title}</h3>
            <p className="text-[11px] text-slate-500 font-['Nunito'] font-medium">{modeTheme.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/70 text-slate-600 transition-colors"
            title={soundEnabled ? 'Mute timer chimes' : 'Enable timer chimes'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/70 text-slate-600 transition-colors"
            title={isMinimized ? 'Expand timer' : 'Minimize timer'}
          >
            {isMinimized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {!isMinimized ? (
        <div className="mt-3 flex flex-col items-center">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-white/30 border border-white/60 p-1 rounded-2xl gap-1 w-full text-[11px] font-semibold mb-3">
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onChangeMode('focus', 25);
              }}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                timerMode === 'focus'
                  ? 'bg-white/90 shadow-xs text-slate-800 font-bold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onChangeMode('shortBreak', 5);
              }}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                timerMode === 'shortBreak'
                  ? 'bg-white/90 shadow-xs text-emerald-800 font-bold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Break
            </button>
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onChangeMode('longBreak', 15);
              }}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                timerMode === 'longBreak'
                  ? 'bg-white/90 shadow-xs text-indigo-800 font-bold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Rest
            </button>
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onChangeMode('custom', customMinutes || 30);
                setShowCustomModal(true);
              }}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                timerMode === 'custom'
                  ? 'bg-white/90 shadow-xs text-amber-800 font-bold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Dual Circular Progress Ring Display */}
          <div className="relative w-44 h-44 flex items-center justify-center my-1">
            <svg className="w-full h-full transform -rotate-90 relative z-10">
              {/* Outer Ring: Daily Focus Goal Progress */}
              <circle
                cx="88"
                cy="88"
                r={outerRadius}
                className="stroke-white/30"
                strokeWidth="7"
                fill="transparent"
              />
              <motion.circle
                cx="88"
                cy="88"
                r={outerRadius}
                stroke="#81C784"
                strokeWidth="7"
                strokeDasharray={outerCircumference}
                strokeDashoffset={outerStrokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                transition={{ duration: 0.5, ease: 'linear' }}
              />

              {/* Inner Ring: Current Session Countdown Progress */}
              <circle
                cx="88"
                cy="88"
                r={innerRadius}
                className="stroke-white/40"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="88"
                cy="88"
                r={innerRadius}
                stroke={timerMode === 'focus' ? '#FF6B8B' : timerMode === 'shortBreak' ? '#81C784' : '#B39DDB'}
                strokeWidth="6"
                strokeDasharray={innerCircumference}
                strokeDashoffset={innerStrokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </svg>

            {/* Time Display Centered with Frosted Pill */}
            <div className="absolute flex flex-col items-center z-20 bg-white/50 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/70 shadow-xs">
              <span className="text-2xl font-black tracking-tighter text-slate-700">
                {formatTime(timeLeft)}
              </span>
              <div className="flex gap-1 mt-0.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  timerMode === 'focus'
                    ? 'bg-[#FFD1DC] text-slate-800'
                    : timerMode === 'shortBreak'
                    ? 'bg-[#C1E1C1] text-slate-800'
                    : 'bg-[#EDE7F6] text-slate-800'
                }`}>
                  {isRunning ? 'Focusing' : 'Paused'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Play/Pause, Reset, Skip */}
          <div className="flex items-center justify-center gap-3 mt-3 w-full">
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onResetTimer();
              }}
              className="p-2.5 rounded-2xl bg-white/50 border border-white/70 text-slate-600 hover:bg-white/80 transition-transform active:scale-95 shadow-sm"
              title="Reset timer"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onToggleTimer();
              }}
              className={`px-7 py-2.5 rounded-2xl text-slate-800 font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 border border-white/80 ${
                isRunning
                  ? 'bg-[#FFD1DC] hover:bg-[#ffc2d1] shadow-pink-100'
                  : 'bg-[#C1E1C1] hover:bg-[#b0dcb0] shadow-emerald-100'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause size={18} /> Pause
                </>
              ) : (
                <>
                  <Play size={18} /> Start Focus
                </>
              )}
            </button>

            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onSkipTimer();
              }}
              className="p-2.5 rounded-2xl bg-white/50 border border-white/70 text-slate-600 hover:bg-white/80 transition-transform active:scale-95 shadow-sm"
              title="Skip to next session"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Quick Presets & Custom Duration */}
          <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-white/50 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>Presets:</span>
              <button
                onClick={() => {
                  audioEngine.playClickSfx();
                  onChangeMode('focus', 50);
                }}
                className="px-2 py-1 bg-white/50 border border-white/60 rounded-xl hover:bg-white/80 text-slate-700 transition-colors"
              >
                50/10
              </button>
              <button
                onClick={() => {
                  audioEngine.playClickSfx();
                  onChangeMode('focus', 15);
                }}
                className="px-2 py-1 bg-white/50 border border-white/60 rounded-xl hover:bg-white/80 text-slate-700 transition-colors"
              >
                15/3
              </button>
            </div>

            <button
              onClick={() => setShowCustomModal(!showCustomModal)}
              className="flex items-center gap-1 text-[#8E8DBE] hover:text-slate-800 font-bold transition-colors"
            >
              <Clock size={13} /> Custom
            </button>
          </div>

          {/* Custom Duration Selector Dropdown */}
          {showCustomModal && (
            <div className="w-full mt-2 p-2 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/80 flex items-center justify-between text-xs shadow-sm">
              <span className="text-slate-700 font-medium">Set Minutes:</span>
              <input
                type="number"
                min="1"
                max="120"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 px-2 py-1 bg-white/90 border border-white rounded-xl text-center font-bold text-slate-800 focus:outline-none"
              />
              <button
                onClick={() => {
                  audioEngine.playClickSfx();
                  onChangeMode('focus', customMinutes);
                  setShowCustomModal(false);
                }}
                className="px-3 py-1 bg-[#C1E1C1] text-slate-800 rounded-xl font-bold hover:bg-[#b0dcb0]"
              >
                Set
              </button>
            </div>
          )}

          {/* Daily Focus Goal & Sessions Summary Card */}
          <div className="w-full mt-3 p-2.5 bg-white/50 backdrop-blur-xs rounded-2xl border border-white/70 flex flex-col gap-2 text-xs shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Target size={14} className="text-[#81C784]" /> Daily Focus Goal:
              </span>
              <button
                onClick={() => setShowGoalModal(!showGoalModal)}
                className="font-bold text-slate-700 hover:text-[#81C784] bg-white/60 px-2 py-0.5 rounded-lg border border-white/80 transition-colors flex items-center gap-1 shadow-2xs"
                title="Configure daily goal"
              >
                {todayFocusMinutes}m / {dailyFocusGoalMinutes}m ({Math.round(dailyProgressPercent)}%)
              </button>
            </div>

            {showGoalModal && (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/50">
                <div className="flex items-center justify-between text-slate-500 font-medium text-[11px]">
                  <span>Select Target Goal:</span>
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[60, 90, 120, 180, 240].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        audioEngine.playClickSfx();
                        onUpdateDailyGoal(mins);
                        setShowGoalModal(false);
                      }}
                      className={`py-1 rounded-xl font-bold text-[11px] transition-all ${
                        dailyFocusGoalMinutes === mins
                          ? 'bg-[#81C784] text-white shadow-xs'
                          : 'bg-white/70 text-slate-700 hover:bg-white'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-white/40">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Sparkles size={14} className="text-amber-500" /> Today's Sessions:
              </span>
              <div className="flex gap-1 items-center">
                {Array.from({ length: Math.min(6, Math.max(1, sessionsCompletedToday)) }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm transition-transform ${i < sessionsCompletedToday ? 'opacity-100 scale-105' : 'opacity-30 grayscale'}`}
                    title={`${sessionsCompletedToday} sessions completed today`}
                  >
                    🍓
                  </span>
                ))}
                <span className="font-bold text-slate-700 ml-1">({sessionsCompletedToday})</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Minimized Compact View */
        <div className="mt-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-700">{formatTime(timeLeft)}</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#C1E1C1] text-slate-800 uppercase">
              {timerMode}
            </span>
          </div>

          <button
            onClick={() => {
              audioEngine.playClickSfx();
              onToggleTimer();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#C1E1C1] text-slate-800 font-bold text-xs flex items-center gap-1 shadow-sm border border-white/80 hover:bg-[#b0dcb0]"
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
        </div>
      )}
    </motion.div>
  );
};
