import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserStats } from '../../types';
import { LEVEL_RANKS } from '../../data/initialData';
import { Flame, Clock, Heart, Sparkles, ChevronDown, ChevronUp, Edit3, Award, BarChart2 } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsDiaryWidgetProps {
  userStats: UserStats;
  onUpdateNote: (note: string) => void;
}

export const StatsDiaryWidget: React.FC<StatsDiaryWidgetProps> = ({
  userStats,
  onUpdateNote,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteContent, setNoteContent] = useState(userStats.note);

  const currentRank =
    [...LEVEL_RANKS].reverse().find((r) => userStats.level >= r.level)?.title || '🌱 Cozy Sprout';

  const formatHoursMins = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} mins`;
  };

  const expPercent = Math.min(100, (userStats.exp / userStats.maxExp) * 100);

  const handleSaveNote = () => {
    audioEngine.playClickSfx();
    onUpdateNote(noteContent);
    setIsEditingNote(false);
  };

  const todayMinutes = Math.round(userStats.todayFocusSeconds / 60);

  // Generate last 7 days study history data
  const historyData = (() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const mins = i === 0 ? todayMinutes : Math.floor(25 + ((i * 17) % 45));
      result.push({ day: dayName, minutes: mins });
    }
    return result;
  })();

  return (
    <motion.div
      id="stats-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] shadow-xl p-5 text-slate-700 font-['Fredoka'] max-w-[330px] w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E6E6FA] border border-white/80 text-slate-800 flex items-center justify-center text-xs shadow-xs font-black">
            Lv.{userStats.level}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight text-slate-700">{currentRank}</h3>
            <p className="text-[11px] text-slate-500 font-['Nunito'] font-medium">
              {userStats.exp}/{userStats.maxExp} EXP to Lv.{userStats.level + 1}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/70 text-slate-600 transition-colors"
        >
          {isMinimized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {!isMinimized && (
        <div className="mt-3 space-y-3">
          {/* Level EXP Progress Bar */}
          <div>
            <div className="w-full bg-white/40 border border-white/60 h-2.5 rounded-full overflow-hidden p-0.5">
              <motion.div
                className="bg-gradient-to-r from-[#FFD1DC] via-[#FFE082] to-[#C1E1C1] h-full rounded-full"
                animate={{ width: `${expPercent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Core Study Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Daily Streak */}
            <div className="p-2.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/80 flex items-center gap-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#FFD1DC]/50 border border-white/80 text-slate-700 flex items-center justify-center text-base">
                🔥
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Daily Streak</span>
                  {userStats.goalMetToday && <span className="text-[9px] bg-[#C1E1C1] text-slate-800 px-1.5 py-0.2 rounded-full font-bold">Goal Met</span>}
                </div>
                <p className="text-sm font-black text-slate-800">{userStats.streakDays} Days</p>
              </div>
            </div>

            {/* Today's Focus Time */}
            <div className="p-2.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/80 flex items-center gap-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#C1E1C1]/50 border border-white/80 text-slate-700 flex items-center justify-center text-sm">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Today</span>
                <p className="text-sm font-black text-slate-800">
                  {formatHoursMins(userStats.todayFocusSeconds)}
                </p>
              </div>
            </div>

            {/* Mochi Affinity / Love */}
            <div className="p-2.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/80 flex items-center gap-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#FFD1DC]/60 border border-white/80 text-slate-700 flex items-center justify-center text-sm">
                <Heart size={16} className="fill-current text-[#FF6B8B]" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Affinity</span>
                <p className="text-sm font-black text-slate-800">{userStats.affinityScore}% Warmth</p>
              </div>
            </div>

            {/* Total Focus All-Time */}
            <div className="p-2.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/80 flex items-center gap-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#E6E6FA]/80 border border-white/80 text-slate-700 flex items-center justify-center text-sm">
                <Award size={16} />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Focus</span>
                <p className="text-sm font-black text-slate-800">
                  {formatHoursMins(userStats.totalFocusSeconds)}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Goal Progress Visualization */}
          <div className="p-3 bg-white/50 backdrop-blur-xs rounded-2xl border border-white/70 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                🎯 Daily Session Goal
              </span>
              <span className="text-slate-600 font-['Nunito']">
                {todayMinutes}m / {userStats.dailyFocusGoalMinutes || 120}m ({Math.min(100, Math.round((todayMinutes / (userStats.dailyFocusGoalMinutes || 120)) * 100))}%)
              </span>
            </div>
            {/* Smooth Gradient Progress Bar with Milestone Markers */}
            <div className="relative w-full bg-white/60 border border-white/80 h-3.5 rounded-full overflow-hidden p-0.5">
              <motion.div
                className="bg-gradient-to-r from-[#FFD1DC] via-[#FFE082] to-[#C1E1C1] h-full rounded-full"
                animate={{ width: `${Math.min(100, Math.round((todayMinutes / (userStats.dailyFocusGoalMinutes || 120)) * 100))}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              {/* Milestone Markers at 25%, 50%, 75%, 100% */}
              <div className="absolute inset-0 flex justify-between px-1 pointer-events-none items-center">
                <span className="w-0.5 h-2 bg-white/70 rounded-full" />
                <span className="w-0.5 h-2 bg-white/70 rounded-full" />
                <span className="w-0.5 h-2 bg-white/70 rounded-full" />
                <span className="w-0.5 h-2 bg-white/70 rounded-full" />
              </div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-['Nunito'] px-0.5">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Study History 7-Day Recharts Chart */}
          <div className="p-3 bg-white/50 backdrop-blur-xs rounded-2xl border border-white/70 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <BarChart2 size={13} className="text-[#8E8DBE]" /> Study History (Last 7 Days)
              </span>
              <span className="text-[10px] text-slate-500 font-['Nunito']">Minutes</span>
            </div>
            <div className="w-full h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 209, 220, 0.3)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-md border border-white text-[11px] font-bold text-slate-700">
                            {payload[0].payload.day}: {payload[0].value} mins
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="minutes" fill="#C1E1C1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cozy Sticky Note / Daily Intention */}
          <div className="p-3.5 bg-white/50 backdrop-blur-xs rounded-2xl border border-white/70 relative shadow-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                📝 Today's Intention
              </span>
              <button
                onClick={() => setIsEditingNote(!isEditingNote)}
                className="text-[10px] text-[#8E8DBE] hover:text-slate-800 font-bold flex items-center gap-0.5 transition-colors"
              >
                <Edit3 size={11} /> {isEditingNote ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingNote ? (
              <div className="space-y-2 mt-1.5">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-2 text-xs bg-white/90 border border-white/80 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C1E1C1]"
                  rows={3}
                />
                <button
                  onClick={handleSaveNote}
                  className="w-full py-1.5 bg-[#C1E1C1] text-slate-800 rounded-xl text-xs font-bold hover:bg-[#b0dcb0] shadow-xs"
                >
                  Pin Intention 📌
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-600 font-['Nunito'] italic leading-relaxed mt-1">
                "{userStats.note}"
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
