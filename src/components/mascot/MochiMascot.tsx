import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimerMode, UserStats } from '../../types';
import { MOCHI_QUOTES } from '../../data/initialData';
import { audioEngine } from '../../services/audioEngine';

interface MochiMascotProps {
  timerMode: TimerMode;
  isTimerRunning: boolean;
  userStats: UserStats;
  onPetMochi: () => void;
  sceneId: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export const MochiMascot: React.FC<MochiMascotProps> = ({
  timerMode,
  isTimerRunning,
  userStats,
  onPetMochi,
}) => {
  const [quote, setQuote] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHappyReacting, setIsHappyReacting] = useState(false);

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000 + Math.random() * 2500);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleClickMochi = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playMochiPetSfx();
    onPetMochi();

    // Trigger cute bounce reaction
    setIsHappyReacting(true);
    setTimeout(() => setIsHappyReacting(false), 800);

    // Pick random quote
    const randomQuote = MOCHI_QUOTES[Math.floor(Math.random() * MOCHI_QUOTES.length)];
    setQuote(randomQuote);

    // Spawn floating heart / sparkle particles
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles: Particle[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: -10 - Math.random() * 40,
      emoji: ['💖', '✨', '🌸', '🍓', '⭐'][Math.floor(Math.random() * 5)],
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    // Auto dismiss quote after 5s
    setTimeout(() => {
      setQuote(null);
    }, 4500);
  };

  // Clean up old particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.slice(4));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  const equippedHat = userStats.equipped.hat;
  const equippedOutfit = userStats.equipped.outfit;
  const equippedAccessory = userStats.equipped.accessory;
  const equippedCompanion = userStats.equipped.companion;

  const isFocusing = isTimerRunning && timerMode === 'focus';
  const isResting = timerMode !== 'focus';

  return (
    <div
      id="mascot-container"
      className="relative flex flex-col items-center justify-end select-none cursor-pointer group pointer-events-auto"
      onClick={handleClickMochi}
      title="Click or pet Mochi for encouragement!"
    >
      {/* Speech / Thought Bubble */}
      <AnimatePresence>
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15 }}
            className="absolute -top-24 max-w-[260px] bg-[#FFFDF5] border-2 border-[#FFD1DC] text-[#5D4037] px-4 py-2.5 rounded-2xl shadow-lg z-30 font-['Fredoka'] text-sm tracking-wide text-center"
          >
            <p className="leading-snug">{quote}</p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FFFDF5] border-r-2 border-b-2 border-[#FFD1DC] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Click Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: 0, x: p.x, y: p.y - 60, scale: 1.3 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute text-xl pointer-events-none z-40"
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* Main Mascot Visual Vector */}
      <motion.div
        animate={{
          y: isHappyReacting ? [0, -18, 0, -8, 0] : [0, -4, 0],
          rotate: isHappyReacting ? [0, -4, 4, -2, 0] : 0,
        }}
        transition={{
          y: isHappyReacting
            ? { duration: 0.6, ease: 'easeInOut' }
            : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 0.6 },
        }}
        className="relative w-52 h-52 sm:w-60 sm:h-60 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Soft Ambient Ground Shadow */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-8 bg-[#4A3E3D]/15 rounded-[100%] blur-sm pointer-events-none" />

        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            {/* Soft Warm Gradients */}
            <linearGradient id="mochiBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="100%" stopColor="#FFEFE8" />
            </linearGradient>
            <linearGradient id="mochiEar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFCCD5" />
              <stop offset="100%" stopColor="#FFB3C1" />
            </linearGradient>
            <linearGradient id="sageKnit" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C8E6C9" />
              <stop offset="100%" stopColor="#A5D6A7" />
            </linearGradient>
            <linearGradient id="denimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#90CAF9" />
              <stop offset="100%" stopColor="#64B5F6" />
            </linearGradient>
            <linearGradient id="apronGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A1887F" />
              <stop offset="100%" stopColor="#8D6E63" />
            </linearGradient>
            <linearGradient id="pajamaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="100%" stopColor="#FFF59D" />
            </linearGradient>
            <linearGradient id="strawberryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6584" />
              <stop offset="100%" stopColor="#E94A6E" />
            </linearGradient>
            <linearGradient id="bobaCup" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E8F5E9" />
              <stop offset="100%" stopColor="#C8E6C9" />
            </linearGradient>
          </defs>

          {/* === EARS === */}
          {/* Left Ear */}
          <motion.g
            animate={{
              rotate: isHappyReacting ? [-8, 8, -4, 0] : isFocusing ? -4 : [-2, 2, -2],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '65px', originY: '70px' }}
          >
            <ellipse cx="65" cy="52" rx="16" ry="32" fill="url(#mochiBody)" stroke="#E8D5CE" strokeWidth="2.5" />
            <ellipse cx="65" cy="54" rx="9" ry="20" fill="url(#mochiEar)" opacity="0.8" />
          </motion.g>

          {/* Right Ear */}
          <motion.g
            animate={{
              rotate: isHappyReacting ? [8, -8, 4, 0] : isFocusing ? 4 : [2, -2, 2],
            }}
            transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '135px', originY: '70px' }}
          >
            <ellipse cx="135" cy="52" rx="16" ry="32" fill="url(#mochiBody)" stroke="#E8D5CE" strokeWidth="2.5" />
            <ellipse cx="135" cy="54" rx="9" ry="20" fill="url(#mochiEar)" opacity="0.8" />
          </motion.g>

          {/* === BODY & HEAD === */}
          {/* Main chubby body/head contour */}
          <path
            d="M 50 120 C 45 75, 155 75, 150 120 C 155 170, 45 170, 50 120 Z"
            fill="url(#mochiBody)"
            stroke="#E0CBC3"
            strokeWidth="3"
          />

          {/* Tiny chubby feet */}
          <ellipse cx="75" cy="165" rx="14" ry="9" fill="#FFE8E0" stroke="#E0CBC3" strokeWidth="2" />
          <ellipse cx="125" cy="165" rx="14" ry="9" fill="#FFE8E0" stroke="#E0CBC3" strokeWidth="2" />

          {/* === OUTFITS === */}
          {equippedOutfit === 'outfit_sage_cardigan' && (
            <g id="outfit-sage">
              {/* Cozy Knit Cardigan */}
              <path
                d="M 54 118 C 50 155, 150 155, 146 118 C 136 122, 120 124, 100 124 C 80 124, 64 122, 54 118 Z"
                fill="url(#sageKnit)"
                stroke="#81C784"
                strokeWidth="2.5"
              />
              {/* Knit texture & buttons */}
              <circle cx="100" cy="132" r="2.5" fill="#FFF" stroke="#66BB6A" strokeWidth="1" />
              <circle cx="100" cy="144" r="2.5" fill="#FFF" stroke="#66BB6A" strokeWidth="1" />
              <path d="M 100 124 L 100 158" stroke="#81C784" strokeWidth="1.5" strokeDasharray="3,2" />
            </g>
          )}

          {equippedOutfit === 'outfit_overalls' && (
            <g id="outfit-overalls">
              {/* Denim Dungarees */}
              <path
                d="M 58 126 C 55 158, 145 158, 142 126 C 132 130, 118 132, 100 132 C 82 132, 68 130, 58 126 Z"
                fill="url(#denimGrad)"
                stroke="#42A5F5"
                strokeWidth="2.5"
              />
              {/* Straps */}
              <path d="M 72 112 L 74 132" stroke="#42A5F5" strokeWidth="6" strokeLinecap="round" />
              <path d="M 128 112 L 126 132" stroke="#42A5F5" strokeWidth="6" strokeLinecap="round" />
              <circle cx="73" cy="130" r="2" fill="#FFE082" />
              <circle cx="127" cy="130" r="2" fill="#FFE082" />
              {/* Pocket with flower */}
              <rect x="90" y="136" width="20" height="15" rx="3" fill="#64B5F6" stroke="#2196F3" strokeWidth="1.5" />
              <circle cx="100" cy="143" r="2" fill="#FFF59D" />
            </g>
          )}

          {equippedOutfit === 'outfit_barista' && (
            <g id="outfit-barista">
              {/* Barista Apron */}
              <path
                d="M 62 120 C 60 156, 140 156, 138 120 C 126 124, 114 126, 100 126 C 86 126, 74 124, 62 120 Z"
                fill="url(#apronGrad)"
                stroke="#6D4C41"
                strokeWidth="2"
              />
              {/* Neck strap */}
              <path d="M 82 108 Q 100 114 118 108" stroke="#6D4C41" strokeWidth="3" fill="none" />
              {/* Cute coffee bean doodle */}
              <ellipse cx="100" cy="138" rx="6" ry="4" fill="#4E342E" />
              <path d="M 97 138 Q 100 136 103 138" stroke="#D7CCC8" strokeWidth="1" fill="none" />
            </g>
          )}

          {equippedOutfit === 'outfit_pajamas' && (
            <g id="outfit-pajamas">
              {/* Cloud Pajamas */}
              <path
                d="M 54 118 C 50 156, 150 156, 146 118 C 136 122, 120 124, 100 124 C 80 124, 64 122, 54 118 Z"
                fill="url(#pajamaGrad)"
                stroke="#FBC02D"
                strokeWidth="2"
              />
              {/* Polka dots / stars */}
              <circle cx="78" cy="135" r="2.5" fill="#FFF" />
              <circle cx="122" cy="135" r="2.5" fill="#FFF" />
              <circle cx="95" cy="146" r="2.5" fill="#FFF" />
              <circle cx="108" cy="132" r="2" fill="#FFF" />
            </g>
          )}

          {equippedOutfit === 'outfit_scholar' && (
            <g id="outfit-scholar">
              <path
                d="M 56 120 C 52 156, 148 156, 144 120 C 134 124, 118 126, 100 126 C 82 126, 66 124, 56 120 Z"
                fill="#EDE7F6"
                stroke="#7E57C2"
                strokeWidth="2"
              />
              {/* Collar & Tiny Red Bowtie */}
              <path d="M 88 116 L 100 126 L 112 116" stroke="#B39DDB" strokeWidth="2" fill="none" />
              <path d="M 96 124 L 104 128 L 96 132 Z M 104 124 L 96 128 L 104 132 Z" fill="#EF5350" />
            </g>
          )}

          {equippedOutfit === 'outfit_baker' && (
            <g id="outfit-baker">
              <path
                d="M 54 118 C 50 156, 150 156, 146 118 C 136 122, 120 124, 100 124 C 80 124, 64 122, 54 118 Z"
                fill="#FFEBEE"
                stroke="#EF9A9A"
                strokeWidth="2"
              />
              {/* Flour smudges */}
              <circle cx="84" cy="138" r="4" fill="#FFF" opacity="0.9" />
              <circle cx="118" cy="144" r="5" fill="#FFF" opacity="0.9" />
              <path d="M 98 130 Q 100 134 102 130" stroke="#E57373" strokeWidth="2" fill="none" />
            </g>
          )}

          {/* === ROSY CHEEKS === */}
          <ellipse cx="70" cy="116" rx="9" ry="5.5" fill="#FFAAA6" opacity="0.65" />
          <ellipse cx="130" cy="116" rx="9" ry="5.5" fill="#FFAAA6" opacity="0.65" />

          {/* === EYES === */}
          {isBlinking ? (
            /* Blinking cute curved lines */
            <g stroke="#4A3E3D" strokeWidth="3.2" strokeLinecap="round" fill="none">
              <path d="M 72 108 Q 78 113 84 108" />
              <path d="M 116 108 Q 122 113 128 108" />
            </g>
          ) : isFocusing ? (
            /* Diligent focusing eyes with sparkles */
            <g>
              <ellipse cx="78" cy="107" rx="5" ry="6.5" fill="#4A3E3D" />
              <ellipse cx="122" cy="107" rx="5" ry="6.5" fill="#4A3E3D" />
              {/* Eye highlights */}
              <circle cx="76" cy="104" r="2.2" fill="#FFF" />
              <circle cx="80" cy="109" r="1" fill="#FFF" />
              <circle cx="120" cy="104" r="2.2" fill="#FFF" />
              <circle cx="124" cy="109" r="1" fill="#FFF" />
            </g>
          ) : isHappyReacting ? (
            /* Happy squiggly ^_^ eyes */
            <g stroke="#4A3E3D" strokeWidth="3.2" strokeLinecap="round" fill="none">
              <path d="M 72 108 Q 78 102 84 108" />
              <path d="M 116 108 Q 122 102 128 108" />
            </g>
          ) : isResting ? (
            /* Relaxed sweet eyes */
            <g>
              <ellipse cx="78" cy="107" rx="4.8" ry="6" fill="#4A3E3D" />
              <ellipse cx="122" cy="107" rx="4.8" ry="6" fill="#4A3E3D" />
              <circle cx="76.5" cy="104.5" r="2" fill="#FFF" />
              <circle cx="120.5" cy="104.5" r="2" fill="#FFF" />
            </g>
          ) : (
            <g>
              <ellipse cx="78" cy="107" rx="5" ry="6.5" fill="#4A3E3D" />
              <ellipse cx="122" cy="107" rx="5" ry="6.5" fill="#4A3E3D" />
              <circle cx="76" cy="104" r="2.2" fill="#FFF" />
              <circle cx="120" cy="104" r="2.2" fill="#FFF" />
            </g>
          )}

          {/* === NOSE & MOUTH === */}
          {/* Tiny button nose */}
          <ellipse cx="100" cy="111" rx="3" ry="2.2" fill="#FF8A80" />

          {/* Mouth */}
          {isHappyReacting ? (
            /* Wide joyful smile */
            <path d="M 94 114 Q 100 124 106 114 Z" fill="#E57373" stroke="#4A3E3D" strokeWidth="1.8" />
          ) : isFocusing ? (
            /* Tiny concentrated 'o' or determined smile */
            <path d="M 95 115 Q 100 119 105 115" fill="none" stroke="#4A3E3D" strokeWidth="2.2" strokeLinecap="round" />
          ) : (
            /* Cute cat style :3 / smile */
            <g stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" fill="none">
              <path d="M 94 114 Q 97 118 100 115 Q 103 118 106 114" />
            </g>
          )}

          {/* === PAWS / ARMS / HANDHELD PROPS === */}
          {isFocusing ? (
            /* Typing on tiny pastel laptop */
            <g id="focusing-laptop">
              {/* Laptop base */}
              <rect x="76" y="136" width="48" height="24" rx="4" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
              {/* Laptop screen with glowing sticker */}
              <path d="M 80 136 L 86 118 L 114 118 L 120 136 Z" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="1.8" />
              {/* Little strawberry apple logo on back of screen */}
              <circle cx="100" cy="127" r="3" fill="#FF6B8B" />
              {/* Animated typing paws */}
              <motion.ellipse
                animate={{ cy: [136, 133, 136] }}
                transition={{ duration: 0.25, repeat: Infinity, repeatType: 'reverse' }}
                cx="82"
                cy="136"
                rx="7"
                ry="6"
                fill="#FFF"
                stroke="#E0CBC3"
                strokeWidth="2"
              />
              <motion.ellipse
                animate={{ cy: [133, 136, 133] }}
                transition={{ duration: 0.25, repeat: Infinity, repeatType: 'reverse' }}
                cx="118"
                cy="135"
                rx="7"
                ry="6"
                fill="#FFF"
                stroke="#E0CBC3"
                strokeWidth="2"
              />
            </g>
          ) : equippedAccessory === 'acc_boba' ? (
            /* Holding Boba Tea Cup */
            <g id="prop-boba">
              {/* Paws holding cup */}
              <ellipse cx="82" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <ellipse cx="118" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              {/* Boba Cup */}
              <path d="M 90 126 L 93 148 L 107 148 L 110 126 Z" fill="url(#bobaCup)" stroke="#81C784" strokeWidth="1.5" />
              {/* Lid & Straw */}
              <ellipse cx="100" cy="126" rx="10" ry="3" fill="#E8F5E9" stroke="#81C784" strokeWidth="1.5" />
              <line x1="102" y1="126" x2="106" y2="114" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
              {/* Boba pearls */}
              <circle cx="96" cy="144" r="2" fill="#4E342E" />
              <circle cx="100" cy="145" r="2" fill="#4E342E" />
              <circle cx="104" cy="144" r="2" fill="#4E342E" />
            </g>
          ) : equippedAccessory === 'acc_cocoa' ? (
            /* Steaming Marshmallow Mug */
            <g id="prop-cocoa">
              <ellipse cx="82" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <ellipse cx="118" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <rect x="91" y="126" width="18" height="18" rx="4" fill="#FFCDD2" stroke="#E57373" strokeWidth="1.5" />
              {/* Handle */}
              <path d="M 109 130 Q 114 135 109 140" stroke="#E57373" strokeWidth="2" fill="none" />
              {/* Marshmallow heart */}
              <circle cx="100" cy="130" r="3" fill="#FFF" />
              {/* Animated steam */}
              <motion.path
                animate={{ y: [-2, -8, -2], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                d="M 98 122 Q 100 116 102 120"
                stroke="#BCAAA4"
                strokeWidth="1.5"
                fill="none"
              />
            </g>
          ) : equippedAccessory === 'acc_quill' ? (
            /* Golden Quill & Notebook */
            <g id="prop-quill">
              <ellipse cx="80" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <ellipse cx="120" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <rect x="88" y="130" width="24" height="18" rx="2" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="1.5" />
              <path d="M 120 134 L 132 110" stroke="#FFD54F" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : equippedAccessory === 'acc_cookie' ? (
            /* Star Sugar Cookie */
            <g id="prop-cookie">
              <ellipse cx="82" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <ellipse cx="118" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <circle cx="100" cy="135" r="9" fill="#FFE082" stroke="#FFA000" strokeWidth="1.5" />
              <circle cx="97" cy="133" r="1.5" fill="#E65100" />
              <circle cx="102" cy="136" r="1.5" fill="#E65100" />
            </g>
          ) : equippedAccessory === 'acc_wand' ? (
            /* Starlight Magic Wand */
            <g id="prop-wand">
              <ellipse cx="80" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <ellipse cx="120" cy="134" rx="7" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <line x1="120" y1="134" x2="135" y2="108" stroke="#CE93D8" strokeWidth="3" strokeLinecap="round" />
              <path d="M 135 105 L 137 108 L 140 108 L 138 111 L 139 114 L 135 112 L 131 114 L 132 111 L 130 108 L 133 108 Z" fill="#FFE082" />
            </g>
          ) : (
            /* Resting cozy paws on lap */
            <g id="default-paws">
              <ellipse cx="78" cy="135" rx="7.5" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
              <ellipse cx="122" cy="135" rx="7.5" ry="6" fill="#FFF" stroke="#E0CBC3" strokeWidth="2" />
            </g>
          )}

          {/* === HATS & HEAD ACCESSORIES === */}
          {equippedHat === 'hat_strawberry' && (
            <g id="hat-strawberry">
              {/* Strawberry Beret */}
              <ellipse cx="100" cy="72" rx="34" ry="17" fill="url(#strawberryGrad)" stroke="#C2185B" strokeWidth="2" />
              {/* Yellow seeds */}
              <circle cx="90" cy="70" r="1.5" fill="#FFF59D" />
              <circle cx="100" cy="74" r="1.5" fill="#FFF59D" />
              <circle cx="110" cy="70" r="1.5" fill="#FFF59D" />
              <circle cx="95" cy="77" r="1.5" fill="#FFF59D" />
              <circle cx="105" cy="77" r="1.5" fill="#FFF59D" />
              {/* Green stem and leaves */}
              <path d="M 100 58 Q 102 50 104 46" stroke="#4CAF50" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 100 58 L 94 54 L 100 56 L 106 54 Z" fill="#66BB6A" />
            </g>
          )}

          {equippedHat === 'hat_chef' && (
            <g id="hat-chef">
              {/* Baker Toque */}
              <path
                d="M 76 68 C 65 50, 75 35, 90 40 C 95 30, 110 30, 115 40 C 130 35, 138 50, 126 68 Z"
                fill="#FFFDF7"
                stroke="#E0E0E0"
                strokeWidth="2"
              />
              <rect x="78" y="66" width="46" height="10" rx="3" fill="#FFF" stroke="#BDBDBD" strokeWidth="1.5" />
            </g>
          )}

          {equippedHat === 'hat_sleepy' && (
            <g id="hat-sleepy">
              {/* Nightcap */}
              <path
                d="M 74 74 Q 100 55 136 68 Q 155 78 160 102 Q 146 88 126 74 Z"
                fill="#B39DDB"
                stroke="#7E57C2"
                strokeWidth="2"
              />
              {/* Fluffy pom-pom */}
              <circle cx="160" cy="102" r="7" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="1.5" />
              {/* White Brim */}
              <ellipse cx="102" cy="74" rx="28" ry="7" fill="#FFF" stroke="#D1C4E9" strokeWidth="2" />
            </g>
          )}

          {equippedHat === 'hat_flower' && (
            <g id="hat-flower">
              {/* Daisy Crown */}
              <path d="M 72 74 Q 100 70 128 74" stroke="#81C784" strokeWidth="3" fill="none" />
              <circle cx="84" cy="72" r="5" fill="#FFF" stroke="#E0E0E0" strokeWidth="1" />
              <circle cx="84" cy="72" r="2.5" fill="#FFD54F" />
              <circle cx="100" cy="70" r="6" fill="#FFF" stroke="#E0E0E0" strokeWidth="1" />
              <circle cx="100" cy="70" r="3" fill="#FFD54F" />
              <circle cx="116" cy="72" r="5" fill="#FFF" stroke="#E0E0E0" strokeWidth="1" />
              <circle cx="116" cy="72" r="2.5" fill="#FFD54F" />
            </g>
          )}

          {equippedHat === 'hat_wizard' && (
            <g id="hat-wizard">
              {/* Purple Wizard Hat */}
              <path d="M 70 76 L 100 24 L 132 76 Z" fill="#673AB7" stroke="#4527A0" strokeWidth="2" />
              <ellipse cx="101" cy="76" rx="34" ry="8" fill="#512DA8" stroke="#311B92" strokeWidth="2" />
              {/* Gold star */}
              <circle cx="100" cy="50" r="3" fill="#FFE082" />
              <circle cx="92" cy="62" r="2" fill="#FFE082" />
            </g>
          )}

          {equippedHat === 'hat_cat_ears' && (
            <g id="hat-cat-ears">
              {/* Cat Ears Headband */}
              <path d="M 72 72 Q 100 68 128 72" stroke="#424242" strokeWidth="2" fill="none" />
              {/* Left ear */}
              <polygon points="76,72 82,48 94,70" fill="#FFAAA6" stroke="#E57373" strokeWidth="2" />
              <polygon points="80,70 83,54 90,68" fill="#FFCDD2" />
              {/* Right ear */}
              <polygon points="124,72 118,48 106,70" fill="#FFAAA6" stroke="#E57373" strokeWidth="2" />
              <polygon points="120,70 117,54 110,68" fill="#FFCDD2" />
            </g>
          )}

          {equippedHat === 'hat_glasses' && (
            <g id="hat-glasses">
              {/* Round Gold Wireframe Study Glasses */}
              <circle cx="78" cy="107" r="11" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
              <circle cx="122" cy="107" r="11" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
              <line x1="89" y1="107" x2="111" y2="107" stroke="#F59E0B" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* COMPANION PET (Sitting next to Mochi) */}
        {equippedCompanion === 'comp_cat' && (
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-6 bottom-2 w-16 h-16 pointer-events-auto"
            title="Sleepy Calico Cat (purring~)"
          >
            <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-sm">
              {/* Calico Cat curled up */}
              <ellipse cx="30" cy="38" rx="20" ry="14" fill="#FFFDF7" stroke="#D7CCC8" strokeWidth="1.5" />
              {/* Calico patches */}
              <path d="M 22 28 Q 28 32 25 44 Q 15 42 18 30 Z" fill="#FFB74D" />
              <path d="M 38 32 Q 44 38 42 46 Q 34 46 36 34 Z" fill="#5D4037" />
              {/* Head */}
              <circle cx="18" cy="32" r="11" fill="#FFFDF7" stroke="#D7CCC8" strokeWidth="1.5" />
              {/* Ears */}
              <polygon points="10,26 14,16 20,24" fill="#FFB74D" />
              <polygon points="18,24 24,18 26,26" fill="#5D4037" />
              {/* Sleeping curved eyes */}
              <path d="M 12 34 Q 15 37 18 34" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Tail with wag */}
              <motion.path
                animate={{ d: ['M 48 38 Q 56 34 54 26', 'M 48 38 Q 58 36 56 28', 'M 48 38 Q 56 34 54 26'] }}
                transition={{ duration: 3, repeat: Infinity }}
                stroke="#FFB74D"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Zzz floating */}
              <motion.text
                animate={{ y: [-2, -8, -2], opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                x="32"
                y="22"
                fontSize="9"
                fill="#B39DDB"
                fontFamily="Fredoka"
                fontWeight="bold"
              >
                z z Z
              </motion.text>
            </svg>
          </motion.div>
        )}

        {equippedCompanion === 'comp_bunny' && (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-6 bottom-2 w-14 h-14 pointer-events-auto"
            title="Little Snow Bunny"
          >
            <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-sm">
              <ellipse cx="25" cy="34" rx="14" ry="11" fill="#FFFDF9" stroke="#E0E0E0" strokeWidth="1.5" />
              <ellipse cx="20" cy="18" rx="4" ry="12" fill="#FFF" stroke="#E0E0E0" strokeWidth="1.5" />
              <ellipse cx="20" cy="18" rx="2" ry="8" fill="#FFCDD2" />
              <ellipse cx="28" cy="18" rx="4" ry="12" fill="#FFF" stroke="#E0E0E0" strokeWidth="1.5" />
              <ellipse cx="28" cy="18" rx="2" ry="8" fill="#FFCDD2" />
              <circle cx="19" cy="31" r="2" fill="#4A3E3D" />
              <circle cx="27" cy="31" r="2" fill="#4A3E3D" />
              <ellipse cx="23" cy="35" rx="1.5" ry="1" fill="#FF8A80" />
            </svg>
          </motion.div>
        )}

        {equippedCompanion === 'comp_sprout' && (
          <motion.div
            animate={{ y: [-4, 2, -4], rotate: [-4, 4, -4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-5 top-8 w-12 h-12 pointer-events-auto"
            title="Sproutling Sprite"
          >
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
              <circle cx="20" cy="24" r="10" fill="#E8F5E9" stroke="#81C784" strokeWidth="1.5" />
              <path d="M 20 14 Q 24 6 30 10 Q 24 14 20 14" fill="#66BB6A" />
              <path d="M 20 14 Q 16 6 10 10 Q 16 14 20 14" fill="#81C784" />
              <circle cx="17" cy="23" r="1.5" fill="#2E7D32" />
              <circle cx="23" cy="23" r="1.5" fill="#2E7D32" />
              <ellipse cx="14" cy="26" rx="2" ry="1" fill="#FFAAA6" />
              <ellipse cx="26" cy="26" rx="2" ry="1" fill="#FFAAA6" />
            </svg>
          </motion.div>
        )}

        {equippedCompanion === 'comp_duck' && (
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-6 bottom-2 w-14 h-14 pointer-events-auto"
            title="Sir Duckington"
          >
            <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-sm">
              <ellipse cx="25" cy="34" rx="14" ry="11" fill="#FFF59D" stroke="#FBC02D" strokeWidth="1.5" />
              <circle cx="18" cy="26" r="8" fill="#FFF59D" stroke="#FBC02D" strokeWidth="1.5" />
              <ellipse cx="10" cy="28" rx="5" ry="2.5" fill="#FF8A65" stroke="#E64A19" strokeWidth="1" />
              <circle cx="16" cy="24" r="1.8" fill="#212121" />
              <circle cx="16.5" cy="23.5" r="0.6" fill="#FFF" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* Mascot Status Pill */}
      <div className="mt-1 flex items-center gap-1.5 px-3 py-1 bg-[#FFFDF5]/90 backdrop-blur-md rounded-full border border-[#FFD1DC] shadow-sm text-xs font-['Fredoka'] text-[#5D4037]">
        <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-400" />
        <span>
          {isFocusing ? 'Mochi is deeply studying...' : isResting ? 'Mochi is relaxing & sipping tea~' : 'Mochi is ready to focus!'}
        </span>
      </div>
    </div>
  );
};
