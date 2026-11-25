import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Award } from 'lucide-react';
import { LEVEL_RANKS } from '../../data/initialData';
import { audioEngine } from '../../services/audioEngine';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  bonusBerries: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  newLevel,
  bonusBerries,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentRank =
    [...LEVEL_RANKS].reverse().find((r) => newLevel >= r.level)?.title || '🌱 Cozy Sprout';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm font-['Fredoka']">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 30 }}
          className="bg-white/75 backdrop-blur-xl border border-white/80 rounded-[32px] shadow-2xl max-w-sm w-full p-6 text-center text-slate-700 relative overflow-hidden"
        >
          {/* Background sparkles */}
          <div className="absolute top-2 left-4 text-2xl animate-bounce">✨</div>
          <div className="absolute top-4 right-6 text-2xl animate-bounce delay-150">🌟</div>

          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFD1DC] border border-white/80 text-slate-800 flex items-center justify-center text-4xl shadow-md mb-3">
            🎉
          </div>

          <h2 className="text-2xl font-bold text-slate-800 tracking-wide">LEVEL UP!</h2>
          <p className="text-base font-bold text-slate-700 mt-1">You reached Level {newLevel}!</p>
          <div className="inline-block my-2 px-3 py-1 bg-white/60 border border-white/80 rounded-full text-xs font-bold text-slate-700 shadow-xs">
            {currentRank}
          </div>

          <div className="p-3 my-3 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/80 flex items-center justify-center gap-2 shadow-xs">
            <span className="text-xl">🍓</span>
            <span className="text-sm font-bold text-slate-800">+{bonusBerries} Bonus Mochi Berries!</span>
          </div>

          <p className="text-xs text-slate-500 font-['Nunito'] mb-4">
            Mochi is cheering for you! Check the boutique to unlock new outfits!
          </p>

          <button
            onClick={() => {
              audioEngine.playClickSfx();
              onClose();
            }}
            className="w-full py-2.5 bg-[#C1E1C1] hover:bg-[#b0dcb0] text-slate-800 rounded-2xl font-bold text-sm shadow-xs border border-white/80 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Sparkles size={16} /> Keep Growing!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
