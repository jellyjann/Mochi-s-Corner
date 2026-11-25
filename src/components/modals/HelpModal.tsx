import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Heart, Clock, Coffee, BookOpen, Shirt, Check } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: '⏳',
      title: 'Cozy Pomodoro Focus',
      desc: 'Work in 25 or 50 minute gentle focus sprints. Mochi types on a tiny laptop while you study, then relaxes with tea during breaks!',
    },
    {
      icon: '🍓',
      title: 'Earn Mochi Berries & EXP',
      desc: 'Every Pomodoro session finished or task checked off grants +15 EXP and +15 Mochi Berries to spend in the boutique.',
    },
    {
      icon: '🐾',
      title: 'Pet & Care for Mochi',
      desc: 'Click on Mochi anytime for cute purrs, heart particles, and motivational encouraging study quotes!',
    },
    {
      icon: '🎵',
      title: 'Lo-Fi & Ambient Soundscapes',
      desc: 'Blend procedural rain, keyboard clicks, cafe murmur, and fireplace crackle with warm Lo-Fi jazz electric piano chords.',
    },
    {
      icon: '✨',
      title: 'Interactive Scene Secrets',
      desc: 'Click the desk lamps, stone oven, coffee machine, books, and fairy lights across all 4 rooms to trigger hidden cozy animations!',
    },
    {
      icon: '👗',
      title: 'Wardrobe & Pets',
      desc: 'Unlock strawberry berets, chef hats, cozy cardigans, boba tea cups, and companion pets like Calico Cat & Snow Bunny.',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm font-['Fredoka']">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[32px] shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-700"
        >
          {/* Header */}
          <div className="p-4 bg-white/50 backdrop-blur-md border-b border-white/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📖</span>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Welcome to Mochi's Corner</h2>
                <p className="text-xs text-slate-500 font-['Nunito']">Your cozy virtual study & productivity haven</p>
              </div>
            </div>
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/70 text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Guide list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((f, i) => (
                <div key={i} className="p-3.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/80 shadow-xs">
                  <div className="text-2xl mb-1.5">{f.icon}</div>
                  <h3 className="font-bold text-xs text-slate-800 mb-1">{f.title}</h3>
                  <p className="text-[11px] text-slate-500 font-['Nunito'] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-white/50 backdrop-blur-md border-t border-white/60 flex justify-end">
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                onClose();
              }}
              className="px-5 py-2 bg-[#C1E1C1] text-slate-800 rounded-2xl font-bold hover:bg-[#b0dcb0] text-xs shadow-xs border border-white/80 transition-all active:scale-95"
            >
              Let's Study Together! ✨
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
