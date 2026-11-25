import React, { useState } from 'react';
import { motion } from 'motion/react';
import { audioEngine } from '../../services/audioEngine';
import bedroomImg from '../../assets/images/scene_rainy_bedroom_1787716247713.jpg';

interface SceneProps {
  timeOfDay: string;
}

export const BedroomScene: React.FC<SceneProps> = ({ timeOfDay }) => {
  const [lampOn, setLampOn] = useState(true);
  const [fairyLightsOn, setFairyLightsOn] = useState(true);

  const toggleLamp = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClickSfx();
    setLampOn(!lampOn);
  };

  const toggleFairyLights = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClickSfx();
    setFairyLightsOn(!fairyLightsOn);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Base Illustrated Anime Artwork */}
      <img
        src={bedroomImg}
        alt="Rainy Bedroom Study Nook"
        className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-1000 scale-100"
        referrerPolicy="no-referrer"
      />

      {/* Dynamic Time-of-Day Atmosphere Shading */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          timeOfDay === 'night'
            ? 'bg-[#0f1123]/35 mix-blend-multiply'
            : timeOfDay === 'dusk'
            ? 'bg-[#d97706]/15 mix-blend-color-burn'
            : timeOfDay === 'golden'
            ? 'bg-[#f59e0b]/15 mix-blend-overlay'
            : 'bg-transparent'
        }`}
      />

      {/* RAIN EFFECT OVER WINDOW AREA (Left side) */}
      <div className="absolute top-0 left-0 w-[42%] h-full pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1.5px] bg-sky-200/50 rounded-full"
            style={{
              left: `${(i * 4.2) + (i % 3)}%`,
              top: '-15%',
              height: `${28 + (i % 6) * 12}px`,
            }}
            animate={{ y: ['0%', '700%'] }}
            transition={{
              duration: 0.75 + (i % 4) * 0.15,
              repeat: Infinity,
              ease: 'linear',
              delay: (i * 0.12) % 1,
            }}
          />
        ))}

        {/* Rain condensation mist effect */}
        <div className="absolute inset-0 bg-cyan-900/10 backdrop-blur-[0.5px]" />
      </div>

      {/* INTERACTIVE DESK LAMP GLOW CONE (Right Desk Area) */}
      <div
        onClick={toggleLamp}
        className="absolute bottom-[24%] right-[22%] w-24 h-24 cursor-pointer group z-10"
        title="Click to toggle warm desk lamp"
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-500 ${
            lampOn
              ? 'bg-amber-300/25 shadow-[0_0_80px_40px_rgba(251,191,36,0.3)] animate-pulse'
              : 'opacity-0'
          }`}
        />
      </div>

      {/* STEAM FROM WARM CUP */}
      <div className="absolute bottom-[28%] right-[28%] pointer-events-none z-10">
        <motion.div
          animate={{ y: [0, -18, -28], opacity: [0, 0.7, 0], scale: [0.8, 1.2, 1.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          className="w-3 h-6 bg-gradient-to-t from-white/60 to-transparent blur-[1px] rounded-full"
        />
      </div>

      {/* FAIRY STRING LIGHTS SPARKLE */}
      <div
        onClick={toggleFairyLights}
        className="absolute top-[18%] right-[40%] w-[25%] h-16 cursor-pointer z-10 flex items-center justify-around"
        title="Click to toggle fairy lights"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: fairyLightsOn ? [0.4, 1, 0.5] : 0.1,
              scale: fairyLightsOn ? [0.9, 1.3, 0.9] : 0.8,
            }}
            transition={{
              duration: 1.6 + (i % 3) * 0.4,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className={`w-2.5 h-2.5 rounded-full ${
              ['bg-amber-200', 'bg-rose-200', 'bg-yellow-200', 'bg-orange-200'][i % 4]
            } ${fairyLightsOn ? 'shadow-[0_0_10px_2px_rgba(253,230,138,0.8)]' : ''}`}
          />
        ))}
      </div>

      {/* SLEEPING CAT SUBTLE BREATHING MOTION (Bed in Center-Left) */}
      <motion.div
        animate={{ scaleY: [1, 1.04, 1], scaleX: [1, 1.02, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[26%] left-[34%] w-24 h-16 pointer-events-none"
      />
    </div>
  );
};
