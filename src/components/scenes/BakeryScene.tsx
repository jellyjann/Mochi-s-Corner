import React, { useState } from 'react';
import { motion } from 'motion/react';
import { audioEngine } from '../../services/audioEngine';
import bakeryImg from '../../assets/images/scene_hana_bakery_1787716175395.jpg';

interface SceneProps {
  timeOfDay: string;
}

export const BakeryScene: React.FC<SceneProps> = ({ timeOfDay }) => {
  const [ovenGlow, setOvenGlow] = useState(true);

  const toggleOven = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClickSfx();
    setOvenGlow(!ovenGlow);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Base Illustrated Anime Artwork */}
      <img
        src={bakeryImg}
        alt="Cozy Hana Bakery"
        className="w-full h-full object-cover object-center pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Dynamic Time-of-Day Atmosphere Shading */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          timeOfDay === 'night'
            ? 'bg-[#1a1c2e]/35 mix-blend-multiply'
            : timeOfDay === 'dusk'
            ? 'bg-[#ea580c]/15 mix-blend-color-burn'
            : timeOfDay === 'golden'
            ? 'bg-[#fbbf24]/15 mix-blend-overlay'
            : 'bg-transparent'
        }`}
      />

      {/* BRICK OVEN FIRE GLOW & FLICKER (Right Center Oven) */}
      <div
        onClick={toggleOven}
        className="absolute bottom-[40%] right-[22%] w-36 h-28 cursor-pointer z-10"
        title="Click to toggle brick oven fireplace"
      >
        <motion.div
          animate={{
            opacity: ovenGlow ? [0.65, 0.95, 0.7, 1, 0.8] : 0,
            scale: ovenGlow ? [0.98, 1.05, 0.99, 1.03, 0.98] : 0.9,
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full rounded-full bg-gradient-to-t from-orange-500/40 via-amber-400/30 to-transparent shadow-[0_0_80px_40px_rgba(249,115,22,0.35)]"
        />
      </div>

      {/* STEAM FROM FRESH BREAD TRAY (Counter in front of baker) */}
      <div className="absolute bottom-[32%] right-[38%] pointer-events-none z-10">
        <motion.div
          animate={{ y: [0, -22, -38], opacity: [0, 0.75, 0], scale: [0.7, 1.3, 1.9] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          className="w-4 h-7 bg-gradient-to-t from-white/70 to-transparent blur-[1.5px] rounded-full"
        />
      </div>

      {/* WARM CEILING PENDANT LAMP GLOW (Top Center) */}
      <div className="absolute top-[8%] left-[45%] w-24 h-24 pointer-events-none">
        <div className="w-full h-full rounded-full bg-amber-200/20 shadow-[0_0_60px_30px_rgba(253,230,138,0.25)]" />
      </div>
    </div>
  );
};
