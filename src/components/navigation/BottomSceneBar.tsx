import React from 'react';
import { motion } from 'motion/react';
import { SceneId } from '../../types';
import { audioEngine } from '../../services/audioEngine';

interface BottomSceneBarProps {
  activeScene: SceneId;
  onSelectScene: (scene: SceneId) => void;
}

export const BottomSceneBar: React.FC<BottomSceneBarProps> = ({
  activeScene,
  onSelectScene,
}) => {
  const scenes: { id: SceneId; label: string; icon: string; desc: string; color: string }[] = [
    {
      id: 'bedroom',
      label: "Rainy Bedroom",
      icon: '🛏️',
      desc: 'Rainy window & warm lamp',
      color: '#FFD1DC',
    },
    {
      id: 'cafe',
      label: "Lofi Cafe",
      icon: '☕',
      desc: 'Steaming espresso & sakura',
      color: '#FFE0B2',
    },
    {
      id: 'library',
      label: "Sunlit Library",
      icon: '📚',
      desc: 'Golden sunbeams & books',
      color: '#C8E6C9',
    },
    {
      id: 'bakery',
      label: "Hana Bakery",
      icon: '🥐',
      desc: 'Stone oven fire & pastries',
      color: '#FFE082',
    },
    {
      id: 'zenGarden',
      label: "Zen Garden",
      icon: '🌸',
      desc: 'Sakura petals & koi pond',
      color: '#F8BBD0',
    },
    {
      id: 'auroraCabin',
      label: "Aurora Cabin",
      icon: '🌌',
      desc: 'Northern lights & snowy cabin',
      color: '#B3E5FC',
    },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 font-['Fredoka'] pointer-events-auto max-w-[98vw] px-2">
      <div className="bg-white/70 backdrop-blur-md px-3 py-2 rounded-[28px] border border-white/90 shadow-2xl flex flex-wrap items-center justify-center gap-2">
        {scenes.map((s) => {
          const isActive = activeScene === s.id;

          return (
            <motion.button
              key={s.id}
              onClick={() => {
                audioEngine.playClickSfx();
                onSelectScene(s.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-2 rounded-2xl flex items-center gap-2 transition-all relative shrink-0 ${
                isActive
                  ? 'bg-white/95 border border-white shadow-md text-slate-800'
                  : 'bg-white/40 border border-white/60 text-slate-700 hover:bg-white/75'
              }`}
              title={s.desc}
            >
              <span className="text-xl">{s.icon}</span>
              {isActive && (
                <div className="text-left">
                  <span className="text-xs font-bold block leading-tight">{s.label}</span>
                  <span className="text-[9px] font-['Nunito'] text-slate-500 font-medium block leading-tight">
                    {s.desc}
                  </span>
                </div>
              )}

              {/* Active Dot Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeSceneIndicator"
                  className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-xs"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
