import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShopItem, UserStats, ItemCategory } from '../../types';
import { INITIAL_SHOP_ITEMS } from '../../data/initialData';
import { X, Sparkles, ShoppingBag, Shirt, Check, Lock } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import confetti from 'canvas-confetti';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (category: ItemCategory, itemId: string) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onBuyItem,
  onEquipItem,
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'closet'>('shop');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { key: 'all', label: 'All Items 🌈' },
    { key: 'hat', label: 'Hats & Ears 🍓' },
    { key: 'outfit', label: 'Outfits 🧶' },
    { key: 'accessory', label: 'Handheld 🧋' },
    { key: 'companion', label: 'Pets 🐈' },
  ];

  const filteredItems = INITIAL_SHOP_ITEMS.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (activeTab === 'closet') {
      return userStats.unlockedItemIds.includes(item.id);
    }
    return true;
  });

  const handlePurchase = (item: ShopItem) => {
    if (userStats.berries < item.price) {
      audioEngine.playClickSfx();
      return;
    }
    audioEngine.playTaskCompleteSfx();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF6B8B', '#FFE082', '#A3D9A5', '#B197FC'],
    });
    onBuyItem(item);
  };

  const isEquipped = (item: ShopItem) => {
    if (item.category === 'hat') return userStats.equipped.hat === item.id;
    if (item.category === 'outfit') return userStats.equipped.outfit === item.id;
    if (item.category === 'accessory') return userStats.equipped.accessory === item.id;
    if (item.category === 'companion') return userStats.equipped.companion === item.id;
    return false;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm font-['Fredoka']">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-700"
        >
          {/* Top Modal Header */}
          <div className="p-4 bg-white/50 backdrop-blur-md border-b border-white/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD1DC] border border-white/80 text-slate-800 flex items-center justify-center text-xl shadow-xs">
                {activeTab === 'shop' ? '🛍️' : '👗'}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  {activeTab === 'shop' ? "Mochi's Boutique & Reward Shop" : "Mochi's Cozy Wardrobe"}
                </h2>
                <p className="text-xs text-slate-500 font-['Nunito'] font-medium">
                  {activeTab === 'shop'
                    ? 'Spend your earned berries on adorable outfits & pets!'
                    : 'Equip your unlocked styles and accessories'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Berries Balance Pill */}
              <div className="px-3 py-1.5 bg-white/80 rounded-2xl border border-white/80 shadow-xs flex items-center gap-1.5 text-sm font-bold text-slate-700">
                <span className="text-base">🍓</span>
                <span>{userStats.berries} Berries</span>
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
          </div>

          {/* Navigation Bar (Shop vs Closet & Category Filters) */}
          <div className="p-3 bg-white/30 border-b border-white/50 flex flex-wrap gap-2 justify-between items-center">
            {/* Shop vs Closet Tabs */}
            <div className="flex bg-white/40 border border-white/60 p-1 rounded-2xl gap-1 text-xs font-bold">
              <button
                onClick={() => {
                  audioEngine.playClickSfx();
                  setActiveTab('shop');
                }}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                  activeTab === 'shop' ? 'bg-white shadow-xs text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShoppingBag size={15} /> Berry Shop
              </button>
              <button
                onClick={() => {
                  audioEngine.playClickSfx();
                  setActiveTab('closet');
                }}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                  activeTab === 'closet' ? 'bg-white shadow-xs text-[#8E8DBE] font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Shirt size={15} /> My Closet
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 text-xs font-semibold">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    audioEngine.playClickSfx();
                    setCategoryFilter(cat.key);
                  }}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    categoryFilter === cat.key
                      ? 'bg-[#C1E1C1] text-slate-800 font-bold shadow-xs border border-white/80'
                      : 'bg-white/50 text-slate-600 hover:bg-white/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 scrollbar-thin">
            {filteredItems.map((item) => {
              const isUnlocked = userStats.unlockedItemIds.includes(item.id);
              const equipped = isEquipped(item);
              const canAfford = userStats.berries >= item.price;

              return (
                <motion.div
                  key={item.id}
                  layout
                  className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                    equipped
                      ? 'bg-white/90 border-white/90 shadow-md ring-2 ring-[#FFD1DC]/50'
                      : isUnlocked
                      ? 'bg-white/70 backdrop-blur-xs border-white/80 shadow-xs hover:bg-white/80'
                      : 'bg-white/40 border-white/60 opacity-80'
                  }`}
                >
                  <div>
                    {/* Item Icon Box */}
                    <div className="w-full h-20 rounded-xl bg-white/50 border border-white/60 flex items-center justify-center text-4xl mb-2 relative shadow-xs">
                      {item.icon}
                      {equipped && (
                        <div className="absolute top-1.5 right-1.5 bg-[#FFD1DC] text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs border border-white/80">
                          <Check size={10} /> In Use
                        </div>
                      )}
                      {!isUnlocked && (
                        <div className="absolute top-1.5 left-1.5 bg-slate-800/50 text-white p-1 rounded-full text-xs">
                          <Lock size={12} />
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-xs text-slate-800 truncate">{item.name}</h3>
                    <p className="text-[11px] text-slate-500 font-['Nunito'] line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions (Equip or Buy) */}
                  <div className="mt-3 pt-2 border-t border-white/50">
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          audioEngine.playClickSfx();
                          onEquipItem(item.category, item.id);
                        }}
                        className={`w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-transform active:scale-95 border border-white/80 ${
                          equipped
                            ? 'bg-[#FFD1DC] text-slate-800'
                            : 'bg-[#C1E1C1] text-slate-800 hover:bg-[#b0dcb0]'
                        }`}
                      >
                        {equipped ? 'Equipped' : 'Wear / Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className={`w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 border border-white/80 ${
                          canAfford
                            ? 'bg-[#FFD1DC] text-slate-800 hover:bg-pink-200'
                            : 'bg-white/40 text-slate-400 cursor-not-allowed border-transparent'
                        }`}
                      >
                        <span>🍓</span> {item.price} Berries
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Footer Note */}
          <div className="p-3 bg-white/50 backdrop-blur-md border-t border-white/60 flex justify-between items-center text-xs text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles size={14} className="text-amber-500" /> Earn 15 🍓 per Pomodoro session & task completion!
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#C1E1C1] text-slate-800 rounded-xl font-bold hover:bg-[#b0dcb0] border border-white/80 shadow-xs"
            >
              Done Dressing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
