import React, { useState } from 'react';
import { SceneId, TimeOfDay, UserStats } from '../../types';
import { LEVEL_RANKS } from '../../data/initialData';
import { Sparkles, Sun, Moon, Sunset, Sunrise, Eye, EyeOff, ShoppingBag, Music, HelpCircle, Volume2 } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface TopBarProps {
  userStats: UserStats;
  timeOfDay: TimeOfDay;
  onChangeTimeOfDay: (time: TimeOfDay) => void;
  zenMode: boolean;
  onToggleZenMode: () => void;
  onOpenShop: () => void;
  onToggleAudioWidget: () => void;
  onOpenGeminiChat: () => void;
  onOpenHelp: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  userStats,
  timeOfDay,
  onChangeTimeOfDay,
  zenMode,
  onToggleZenMode,
  onOpenShop,
  onToggleAudioWidget,
  onOpenGeminiChat,
  onOpenHelp,
}) => {
  if (zenMode) return null;

  const currentRank =
    [...LEVEL_RANKS].reverse().find((r) => userStats.level >= r.level)?.title || '🌱 Cozy Sprout';

  const times: { key: TimeOfDay; label: string; icon: any }[] = [
    { key: 'day', label: 'Morning', icon: Sunrise },
    { key: 'golden', label: 'Golden', icon: Sun },
    { key: 'dusk', label: 'Twilight', icon: Sunset },
    { key: 'night', label: 'Midnight', icon: Moon },
  ];

  return (
    <header className="fixed top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none font-['Fredoka']">
      {/* Brand & Level Left Pill */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="bg-white/40 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/60 shadow-sm flex items-center gap-2.5 text-slate-700">
          <span className="text-xl">🍓</span>
          <div>
            <h1 className="font-bold text-sm leading-none flex items-center gap-1.5 text-slate-800">
              Mochi's Corner
              <span className="text-[10px] px-1.5 py-0.2 bg-[#FFD1DC] text-slate-800 rounded-full font-bold">
                v2.0
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-['Nunito'] font-semibold">{currentRank}</p>
          </div>
        </div>

        {/* Gamified Level & EXP Pill */}
        <div className="hidden sm:flex bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/60 shadow-sm items-center gap-2 text-xs">
          <span className="font-bold text-slate-700">Lv.{userStats.level}</span>
          <div className="w-16 bg-white/50 h-2 rounded-full overflow-hidden border border-white/60">
            <div
              className="bg-[#C1E1C1] h-full rounded-full transition-all"
              style={{ width: `${(userStats.exp / userStats.maxExp) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            {userStats.exp}/{userStats.maxExp} EXP
          </span>
        </div>
      </div>

      {/* Center Streak & Berry Counter */}
      <div className="hidden md:flex items-center gap-2 pointer-events-auto">
        {/* Streak */}
        <div className="bg-white/40 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/60 shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <span className="text-base animate-pulse">🔥</span>
          <span>{userStats.streakDays} Day Streak</span>
        </div>

        {/* Berries Balance */}
        <button
          onClick={() => {
            audioEngine.playClickSfx();
            onOpenShop();
          }}
          className="bg-white/40 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/60 shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:bg-white/70 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Open Reward Shop & Closet"
        >
          <span className="text-base">🍓</span>
          <span>{userStats.berries} Berries</span>
          <span className="text-[10px] bg-[#FFD1DC] text-slate-800 px-1.5 py-0.2 rounded-md font-bold">+</span>
        </button>
      </div>

      {/* Right Controls: Time of Day, Shop, Audio, Zen Mode */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        {/* Time of Day Switcher */}
        <div className="flex bg-white/40 backdrop-blur-md p-1 rounded-2xl border border-white/60 shadow-sm gap-0.5">
          {times.map((t) => {
            const Icon = t.icon;
            const isSelected = timeOfDay === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  audioEngine.playClickSfx();
                  onChangeTimeOfDay(t.key);
                }}
                className={`p-1.5 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-[#C1E1C1] text-slate-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
                title={`Switch atmosphere to ${t.label}`}
              >
                <Icon size={15} />
              </button>
            );
          })}
        </div>

        {/* Shop / Wardrobe Button */}
        <button
          onClick={() => {
            audioEngine.playClickSfx();
            onOpenShop();
          }}
          className="bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm text-slate-700 hover:bg-white/70 active:scale-95 transition-all flex items-center gap-1"
          title="Open Closet & Boutique"
        >
          <ShoppingBag size={18} />
          <span className="hidden sm:inline text-xs font-bold">Shop</span>
        </button>

        {/* Soundscape Quick Toggle */}
        <button
          onClick={() => {
            audioEngine.playClickSfx();
            onToggleAudioWidget();
          }}
          className="bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm text-slate-700 hover:bg-white/70 active:scale-95 transition-all"
          title="Toggle Soundscape Mixer"
        >
          <Music size={18} />
        </button>

        {/* Gemini AI Chat Assistant Button */}
        <button
          onClick={() => {
            audioEngine.playClickSfx();
            onOpenGeminiChat();
          }}
          className="bg-white/40 backdrop-blur-md px-2.5 py-2 rounded-2xl border border-white/60 shadow-sm text-slate-700 hover:bg-white/75 active:scale-95 transition-all flex items-center gap-1.5"
          title="Open Mochi Gemini AI Chat Assistant"
        >
          <span className="text-base">🤖</span>
          <span className="hidden sm:inline text-xs font-bold">AI Chat</span>
        </button>

        {/* Zen Ambient Pure View Toggle */}
        <button
          onClick={() => {
            audioEngine.playClickSfx();
            onToggleZenMode();
          }}
          className={`p-2 rounded-2xl border shadow-sm transition-all active:scale-95 ${
            zenMode
              ? 'bg-[#FFD1DC] border-white/80 text-slate-800 font-bold'
              : 'bg-white/40 backdrop-blur-md border-white/60 text-slate-700 hover:bg-white/70'
          }`}
          title={zenMode ? 'Exit Zen Mode (Show widgets)' : 'Enter Zen Mode (Hide widgets)'}
        >
          {zenMode ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {/* Help & Guide */}
        <button
          onClick={() => {
            audioEngine.playClickSfx();
            onOpenHelp();
          }}
          className="bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm text-slate-700 hover:bg-white/70 active:scale-95 transition-all"
          title="Cozy Guide & Controls"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
};
