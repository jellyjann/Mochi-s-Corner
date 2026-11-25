import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SceneId, TimeOfDay, TimerMode, UserStats } from '../../types';
import { BedroomScene } from './BedroomScene';
import { CafeScene } from './CafeScene';
import { LibraryScene } from './LibraryScene';
import { BakeryScene } from './BakeryScene';
import { ZenGardenScene } from './ZenGardenScene';
import { AuroraCabinScene } from './AuroraCabinScene';
import { MochiMascot } from '../mascot/MochiMascot';

interface SceneRendererProps {
  activeScene: SceneId;
  timeOfDay: TimeOfDay;
  timerMode: TimerMode;
  isTimerRunning: boolean;
  userStats: UserStats;
  zenMode?: boolean;
  onPetMochi: () => void;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  activeScene,
  timeOfDay,
  timerMode,
  isTimerRunning,
  userStats,
  zenMode = false,
  onPetMochi,
}) => {
  return (
    <div id="scene-viewport" className="relative w-full h-screen overflow-hidden select-none bg-[#1a1c29]">
      {/* Animated Scene Backgrounds */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {activeScene === 'bedroom' && <BedroomScene timeOfDay={timeOfDay} />}
          {activeScene === 'cafe' && <CafeScene timeOfDay={timeOfDay} />}
          {activeScene === 'library' && <LibraryScene timeOfDay={timeOfDay} />}
          {activeScene === 'bakery' && <BakeryScene timeOfDay={timeOfDay} />}
          {activeScene === 'zenGarden' && <ZenGardenScene timeOfDay={timeOfDay} />}
          {activeScene === 'auroraCabin' && <AuroraCabinScene timeOfDay={timeOfDay} />}
        </motion.div>
      </AnimatePresence>

      {/* Mascot Positioned for interaction (hidden in zen mode because focus card is centered) */}
      {!zenMode && (
        <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-20">
          <MochiMascot
            timerMode={timerMode}
            isTimerRunning={isTimerRunning}
            userStats={userStats}
            onPetMochi={onPetMochi}
            sceneId={activeScene}
          />
        </div>
      )}
    </div>
  );
};
