import React, { useState } from 'react';
import { motion } from 'motion/react';
import { audioEngine } from '../../services/audioEngine';
import libraryImg from '../../assets/images/scene_cozy_library_1787716195936.jpg';

interface SceneProps {
  timeOfDay: string;
}

export const LibraryScene: React.FC<SceneProps> = ({ timeOfDay }) => {
  const [lampOn, setLampOn] = useState(true);

  const toggleLamp = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClickSfx();
    setLampOn(!lampOn);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Base Illustrated Anime Artwork */}
      <img
        src={libraryImg}
        alt="Sunlit Reading Library"
        className="w-full h-full object-cover object-center pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Dynamic Time-of-Day Atmosphere Shading */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          timeOfDay === 'night'
            ? 'bg-[#181829]/40 mix-blend-multiply'
            : timeOfDay === 'dusk'
            ? 'bg-[#ea580c]/15 mix-blend-color-burn'
            : timeOfDay === 'golden'
            ? 'bg-[#f59e0b]/20 mix-blend-overlay'
            : 'bg-transparent'
        }`}
      />

      {/* SUNBEAMS FROM ARCHED WINDOW (Left area) */}
      <div className="absolute top-0 left-0 w-[45%] h-[80%] pointer-events-none overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-amber-100/20 via-yellow-100/10 to-transparent -rotate-12 transform origin-top-left" />

        {/* Dancing golden dust motes */}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/70 shadow-[0_0_6px_#fef08a]"
            style={{
              left: `${15 + (i * 5.5)}%`,
              top: `${20 + (i % 6) * 10}%`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, (i % 2 === 0 ? 12 : -12), 0],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 3.5 + (i % 4) * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.25,
            }}
          />
        ))}
      </div>

      {/* STEAM FROM CUP ON ARMCHAIR SIDE TABLE (Bottom Right) */}
      <div className="absolute bottom-[20%] right-[22%] pointer-events-none z-10">
        <motion.div
          animate={{ y: [0, -20, -32], opacity: [0, 0.75, 0], scale: [0.7, 1.3, 1.8] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'easeOut' }}
          className="w-3 h-6 bg-gradient-to-t from-white/75 to-transparent blur-[1.5px] rounded-full"
        />
      </div>

      {/* INTERACTIVE STUDY LAMP (Bottom Right Lamp) */}
      <div
        onClick={toggleLamp}
        className="absolute bottom-[22%] right-[10%] w-28 h-28 cursor-pointer z-10"
        title="Click to toggle library lamp"
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-500 ${
            lampOn
              ? 'bg-amber-300/25 shadow-[0_0_90px_45px_rgba(251,191,36,0.35)] animate-pulse'
              : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
};
