import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, Heart, X, Sparkles } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface WaterReminderModalProps {
  isOpen: boolean;
  onDrinkWater: () => void;
  onSnooze: () => void;
}

export const WaterReminderModal: React.FC<WaterReminderModalProps> = ({
  isOpen,
  onDrinkWater,
  onSnooze,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs font-['Fredoka'] select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="bg-white/95 backdrop-blur-md border-2 border-[#FFD1DC] rounded-[36px] p-6 max-w-sm w-full shadow-2xl text-slate-700 relative overflow-hidden"
        >
          {/* Decorative Background Glows */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#E3F2FD] rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#FFD1DC]/40 rounded-full blur-2xl pointer-events-none" />

          {/* Close / Snooze Button */}
          <button
            onClick={() => {
              audioEngine.playClickSfx();
              onSnooze();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Snooze for 5 mins"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center text-center space-y-4">
            {/* Cute Water Drop Mascot Icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-[#E3F2FD] border-2 border-[#90CAF9] flex items-center justify-center text-3xl shadow-sm relative"
            >
              💧
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 text-xs"
              >
                ✨
              </motion.div>
            </motion.div>

            <div>
              <span className="text-[11px] font-bold text-[#64B5F6] tracking-wider uppercase">
                Active Study Break
              </span>
              <h2 className="text-xl font-black text-slate-800 mt-0.5">
                Time to Hydrate! 🍵
              </h2>
              <p className="text-xs text-slate-500 font-['Nunito'] mt-1 leading-relaxed">
                Mochi noticed you've been focused on the web for 25 minutes! Take a gentle sip of water and un-clench your shoulders.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
              <button
                onClick={() => {
                  audioEngine.playClickSfx();
                  onSnooze();
                }}
                className="py-2.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold transition-all shadow-xs"
              >
                Snooze (5m) ⏱️
              </button>

              <button
                onClick={() => {
                  audioEngine.playLevelUpSfx();
                  onDrinkWater();
                }}
                className="py-2.5 px-3 bg-gradient-to-r from-[#90CAF9] to-[#64B5F6] text-white rounded-2xl text-xs font-bold hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Droplet size={14} className="fill-current" /> Drank Water! 🌿
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
