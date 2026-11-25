import React, { useState } from 'react';
import { motion } from 'motion/react';
import { audioEngine } from '../../services/audioEngine';
import cafeImg from '../../assets/images/scene_lofi_cafe_1787716226655.jpg';

interface SceneProps {
  timeOfDay: string;
}

export const CafeScene: React.FC<SceneProps> = ({ timeOfDay }) => {
  const [warmLighting, setWarmLighting] = useState(true);

  const toggleLighting = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClickSfx();
    setWarmLighting(!warmLighting);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Base Illustrated Anime Artwork */}
      <img
        src={cafeImg}
        alt="Cozy Lofi Coffee Bar"
        className="w-full h-full object-cover object-center pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Dynamic Time-of-Day Atmosphere Shading */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          timeOfDay === 'night'
            ? 'bg-[#1e1b4b]/30 mix-blend-multiply'
            : timeOfDay === 'dusk'
            ? 'bg-[#f43f5e]/15 mix-blend-color-burn'
            : timeOfDay === 'golden'
            ? 'bg-[#fbbf24]/15 mix-blend-overlay'
            : 'bg-transparent'
        }`}
      />

      {/* ESPRESSO MACHINE STEAM (Right side counter) */}
      <div className="absolute bottom-[44%] right-[32%] pointer-events-none z-10">
        <motion.div
          animate={{ y: [0, -26, -42], opacity: [0, 0.75, 0], scale: [0.8, 1.4, 2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          className="w-4 h-8 bg-gradient-to-t from-white/70 to-transparent blur-[2px] rounded-full"
        />
      </div>

      {/* COFFEE CUP STEAM (Foreground counter) */}
      <div className="absolute bottom-[18%] right-[44%] pointer-events-none z-10">
        <motion.div
          animate={{ y: [0, -18, -30], opacity: [0, 0.8, 0], scale: [0.6, 1.2, 1.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          className="w-3 h-6 bg-gradient-to-t from-white/80 to-transparent blur-[1.5px] rounded-full"
        />
      </div>

      {/* SAKURA PETALS DRIFTING OUTSIDE WINDOW (Center window) */}
      <div className="absolute top-[10%] left-[28%] w-[32%] h-[55%] pointer-events-none overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-pink-200/80 shadow-xs"
            style={{
              left: `${(i * 11) + (i % 4)}%`,
              top: '-10%',
            }}
            animate={{
              y: ['0%', '400%'],
              x: ['0px', `${(i % 2 === 0 ? 25 : -25)}px`, '0px'],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + (i % 3) * 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* INTERACTIVE HANGING VINTAGE LAMPS (Clickable warm glow) */}
      <div
        onClick={toggleLighting}
        className="absolute top-[8%] left-[42%] w-32 h-24 cursor-pointer z-10"
        title="Click to toggle cafe ambient lighting"
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-500 ${
            warmLighting
              ? 'bg-amber-300/20 shadow-[0_0_90px_50px_rgba(251,191,36,0.3)] animate-pulse'
              : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
};
