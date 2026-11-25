import React from 'react';
import { motion } from 'motion/react';
import zenGardenImg from '../../assets/images/scene_zen_garden_1787716155971.jpg';

interface SceneProps {
  timeOfDay: string;
}

export const ZenGardenScene: React.FC<SceneProps> = ({ timeOfDay }) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Base Illustrated Anime Artwork */}
      <img
        src={zenGardenImg}
        alt="Japanese Zen Garden & Kozue Tea House"
        className="w-full h-full object-cover object-center pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Dynamic Time-of-Day Atmosphere Shading */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          timeOfDay === 'night'
            ? 'bg-[#0f172a]/35 mix-blend-multiply'
            : timeOfDay === 'dusk'
            ? 'bg-[#f43f5e]/15 mix-blend-color-burn'
            : timeOfDay === 'golden'
            ? 'bg-[#fbbf24]/15 mix-blend-overlay'
            : 'bg-transparent'
        }`}
      />

      {/* SAKURA BLOSSOMS DRIFTING FROM TREE (Top Right to Pond) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full bg-pink-300/80 shadow-xs"
            style={{
              left: `${50 + (i * 3.5)}%`,
              top: '-5%',
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: ['0px', `${-40 - (i % 5) * 15}px`, `${-80 - (i % 4) * 20}px`],
              rotate: [0, 180, 360],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: 6 + (i % 4) * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i * 0.45) % 5,
            }}
          />
        ))}
      </div>

      {/* KOI POND WATER RIPPLE EFFECTS (Bottom Right Pond) */}
      <div className="absolute bottom-[8%] right-[18%] w-56 h-36 pointer-events-none overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/40"
            initial={{ width: 10, height: 6, opacity: 0.8 }}
            animate={{ width: 90, height: 45, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* BAMBOO FOUNTAIN WATER STREAM SPLASH (Bottom Center) */}
      <div className="absolute bottom-[20%] left-[45%] pointer-events-none">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.1, 0.95] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="w-4 h-4 rounded-full bg-sky-200/50 blur-[1px]"
        />
      </div>
    </div>
  );
};
