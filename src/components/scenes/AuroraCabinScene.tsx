import React, { useState } from 'react';
import { motion } from 'motion/react';
import { audioEngine } from '../../services/audioEngine';
import auroraImg from '../../assets/images/scene_aurora_cabin_1787716129330.jpg';

interface SceneProps {
  timeOfDay: string;
}

export const AuroraCabinScene: React.FC<SceneProps> = ({ timeOfDay }) => {
  const [cabinLightsOn, setCabinLightsOn] = useState(true);

  const toggleCabinLights = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClickSfx();
    setCabinLightsOn(!cabinLightsOn);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Base Illustrated Anime Artwork */}
      <img
        src={auroraImg}
        alt="Northern Lights Aurora Cabin"
        className="w-full h-full object-cover object-center pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Dynamic Time-of-Day Atmosphere Shading */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          timeOfDay === 'night'
            ? 'bg-[#050814]/25 mix-blend-multiply'
            : timeOfDay === 'dusk'
            ? 'bg-[#4338ca]/20 mix-blend-overlay'
            : timeOfDay === 'golden'
            ? 'bg-[#0284c7]/15 mix-blend-overlay'
            : 'bg-transparent'
        }`}
      />

      {/* AURORA BOREALIS GLOWING PULSE (Sky Area) */}
      <div className="absolute top-0 left-0 right-0 h-[48%] pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.35, 0.75, 0.45, 0.8, 0.35],
            scaleY: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full bg-gradient-to-b from-emerald-400/20 via-teal-300/15 to-transparent blur-xl"
        />

        {/* Purple ribbon accent */}
        <motion.div
          animate={{
            opacity: [0.2, 0.55, 0.3, 0.6, 0.2],
            x: ['-2%', '2%', '-1%', '1%', '-2%'],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent blur-2xl"
        />
      </div>

      {/* GENTLE FALLING SNOWFLAKES (Full Screen) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/80 shadow-[0_0_4px_#fff]"
            style={{
              width: `${2 + (i % 3) * 1.5}px`,
              height: `${2 + (i % 3) * 1.5}px`,
              left: `${(i * 3.7) + (i % 4)}%`,
              top: '-5%',
            }}
            animate={{
              y: ['0vh', '105vh'],
              x: ['0px', `${(i % 2 === 0 ? 20 : -20)}px`, '0px'],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{
              duration: 5 + (i % 4) * 1.8,
              repeat: Infinity,
              ease: 'linear',
              delay: (i * 0.22) % 4,
            }}
          />
        ))}
      </div>

      {/* CHIMNEY SMOKE PARTICLES (Cabin Chimney on Right) */}
      <div className="absolute bottom-[44%] right-[32%] pointer-events-none z-10">
        <motion.div
          animate={{ y: [0, -35, -70], opacity: [0, 0.65, 0], scale: [0.8, 1.5, 2.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
          className="w-4 h-8 bg-gradient-to-t from-slate-200/50 to-transparent blur-[2px] rounded-full"
        />
      </div>

      {/* INTERACTIVE WARM CABIN WINDOW LIGHTS (Center-Right Cabin) */}
      <div
        onClick={toggleCabinLights}
        className="absolute bottom-[18%] right-[24%] w-48 h-32 cursor-pointer z-10"
        title="Click to toggle cabin window lights"
      >
        <div
          className={`w-full h-full rounded-2xl transition-all duration-500 ${
            cabinLightsOn
              ? 'bg-amber-400/20 shadow-[0_0_80px_35px_rgba(251,191,36,0.3)] animate-pulse'
              : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
};
