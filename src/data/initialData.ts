import { ShopItem, QuestItem, TaskItem, UserStats, LoFiSong } from '../types';

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  // Hats
  { id: 'hat_none', name: 'No Hat', category: 'hat', price: 0, description: 'Natural cozy fluff', icon: '✨', unlocked: true },
  { id: 'hat_strawberry', name: 'Strawberry Beret', category: 'hat', price: 20, description: 'Sweet pink beret with a green stem', icon: '🍓', previewColor: '#FF6B8B', unlocked: true },
  { id: 'hat_chef', name: 'Baker Toque', category: 'hat', price: 35, description: 'Puffy white chef hat for sweet treats', icon: '👨‍🍳', previewColor: '#FFFDF5', unlocked: false },
  { id: 'hat_sleepy', name: 'Starry Nightcap', category: 'hat', price: 30, description: 'Soft lavender cap with a sleepy pom-pom', icon: '🌙', previewColor: '#B197FC', unlocked: false },
  { id: 'hat_flower', name: 'Daisy Crown', category: 'hat', price: 40, description: 'Woven fresh wildflowers and daisies', icon: '🌼', previewColor: '#FFE066', unlocked: false },
  { id: 'hat_glasses', name: 'Study Glasses', category: 'hat', price: 25, description: 'Round gold wireframes for intense focus', icon: '👓', previewColor: '#D4AF37', unlocked: false },
  { id: 'hat_wizard', name: 'Arcane Wizard Hat', category: 'hat', price: 60, description: 'Star-dusted purple wizard cone', icon: '🧙‍♂️', previewColor: '#7048E8', unlocked: false },
  { id: 'hat_cat_ears', name: 'Fluffy Cat Ears', category: 'hat', price: 45, description: 'Velvet soft pink cat ears headband', icon: '🐱', previewColor: '#FFA8A8', unlocked: false },

  // Outfits
  { id: 'outfit_default', name: 'Fluffy Fur', category: 'outfit', price: 0, description: 'Natural mochi squishiness', icon: '☁️', unlocked: true },
  { id: 'outfit_sage_cardigan', name: 'Sage Knit Cardigan', category: 'outfit', price: 25, description: 'Chunky knit pastel green cardigan', icon: '🧶', previewColor: '#A3D9A5', unlocked: true },
  { id: 'outfit_overalls', name: 'Denim Dungarees', category: 'outfit', price: 40, description: 'Cute blue dungarees with front pocket', icon: '👖', previewColor: '#74C0FC', unlocked: false },
  { id: 'outfit_barista', name: 'Cafe Apron', category: 'outfit', price: 35, description: 'Warm cocoa apron with coffee bean patch', icon: '☕', previewColor: '#8D6E63', unlocked: false },
  { id: 'outfit_pajamas', name: 'Cloud Pajamas', category: 'outfit', price: 45, description: 'Cozy pastel yellow polka dot sleepwear', icon: '⭐', previewColor: '#FFE066', unlocked: false },
  { id: 'outfit_scholar', name: 'Academy Vest', category: 'outfit', price: 50, description: 'Plaid tartan vest with tidy tie', icon: '🎓', previewColor: '#B197FC', unlocked: false },
  { id: 'outfit_baker', name: 'Flour Dust Smock', category: 'outfit', price: 55, description: 'Sweet peach baker smock with heart buttons', icon: '🥐', previewColor: '#FFA8A8', unlocked: false },

  // Accessories / Handheld
  { id: 'acc_none', name: 'Empty Paws', category: 'accessory', price: 0, description: 'Ready to type or stretch', icon: '🐾', unlocked: true },
  { id: 'acc_boba', name: 'Matcha Boba Tea', category: 'accessory', price: 20, description: 'Refreshing milk tea with soft tapioca', icon: '🧋', previewColor: '#A3D9A5', unlocked: true },
  { id: 'acc_quill', name: 'Golden Feather Quill', category: 'accessory', price: 30, description: 'For scholarly notes & diary musings', icon: '🪶', previewColor: '#FFD43B', unlocked: false },
  { id: 'acc_cocoa', name: 'Marshmallow Cocoa', category: 'accessory', price: 25, description: 'Steaming cocoa with floating hearts', icon: '🍫', previewColor: '#D9480F', unlocked: false },
  { id: 'acc_cookie', name: 'Star Sugar Cookie', category: 'accessory', price: 20, description: 'Freshly baked buttery sugar cookie', icon: '🍪', previewColor: '#FAB005', unlocked: false },
  { id: 'acc_wand', name: 'Starlight Wand', category: 'accessory', price: 50, description: 'Leaves a subtle trail of fairy dust', icon: '🪄', previewColor: '#F783AC', unlocked: false },

  // Companions
  { id: 'comp_cat', name: 'Sleepy Calico Cat', category: 'companion', price: 0, description: 'Loves sleeping near warm laptops', icon: '🐈', unlocked: true },
  { id: 'comp_bunny', name: 'Little Snow Bunny', category: 'companion', price: 40, description: 'Soft hops and gentle nose wiggles', icon: '🐇', unlocked: false },
  { id: 'comp_sprout', name: 'Sproutling Sprite', category: 'companion', price: 35, description: 'Tiny botanical spirit with a leaf propeller', icon: '🌱', unlocked: false },
  { id: 'comp_duck', name: 'Sir Duckington', category: 'companion', price: 50, description: 'Wears a tiny leaf as an umbrella', icon: '🦆', unlocked: false },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Review biology flashcards & chapter summary',
    category: 'study',
    priority: 'high',
    completed: false,
    pomodorosEstimated: 2,
    pomodorosCompleted: 1,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'task-2',
    title: 'Finish UI design wireframes for portfolio',
    category: 'creative',
    priority: 'medium',
    completed: false,
    pomodorosEstimated: 3,
    pomodorosCompleted: 0,
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'task-3',
    title: 'Read 15 pages of cozy fantasy novel',
    category: 'reading',
    priority: 'low',
    completed: true,
    pomodorosEstimated: 1,
    pomodorosCompleted: 1,
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'task-4',
    title: 'Hydrate with warm herbal tea & gentle stretch',
    category: 'selfcare',
    priority: 'medium',
    completed: false,
    pomodorosEstimated: 1,
    pomodorosCompleted: 0,
    createdAt: Date.now() - 900000,
  },
];

export const INITIAL_QUESTS: QuestItem[] = [
  {
    id: 'quest-pomodoro',
    title: 'Focus Sprint',
    description: 'Complete 2 Pomodoro focus sessions',
    rewardExp: 50,
    rewardBerries: 15,
    current: 1,
    target: 2,
    completed: false,
    icon: '⏳',
  },
  {
    id: 'quest-tasks',
    title: 'Productive Day',
    description: 'Check off 3 tasks from your list',
    rewardExp: 60,
    rewardBerries: 20,
    current: 1,
    target: 3,
    completed: false,
    icon: '✅',
  },
  {
    id: 'quest-pet',
    title: 'Show Love to Mochi',
    description: 'Pet Mochi 5 times for encouragement',
    rewardExp: 30,
    rewardBerries: 10,
    current: 2,
    target: 5,
    completed: false,
    icon: '💖',
  },
  {
    id: 'quest-explore',
    title: 'Virtual Wanderer',
    description: 'Switch between at least 2 cozy study scenes',
    rewardExp: 40,
    rewardBerries: 12,
    current: 1,
    target: 2,
    completed: false,
    icon: '🌸',
  },
];

export const MOCHI_QUOTES = [
  "You're doing fantastic! Every tiny bit of progress counts. 🍓",
  "Don't forget to take a gentle sip of water and un-clench your shoulders! 🍵",
  "I'm so proud of your dedication today! Keep that cozy focus going. ✨",
  "Take your time, friend. Growth isn't a race—it's a warm journey. 🌿",
  "Your mind is capable of wonderful things! Mochi believes in you 100%! 💖",
  "Deep breath in... and exhale all the worries away. You got this! ☁️",
  "Look at all you've accomplished already! Even sitting down to study is a win! 🌟",
  "Mochi brewed a fresh pot of herbal chamomile for your study break! 🫖",
  "Mistakes are just stepping stones covered in soft moss. Keep learning! 📖",
  "Stay cozy and focused! I'll be right here cheering for you! 🐾",
  "A quiet room, warm thoughts, and a focused heart. What a lovely day. 🕯️",
];

export const LOFI_SONGS: LoFiSong[] = [
  {
    id: 'song-morning',
    title: 'Morning Matcha Breeze',
    mood: 'Fresh & Uplifting',
    tempo: 76,
    chords: ['Cmaj7', 'Am7', 'Dm7', 'G7sus4'],
  },
  {
    id: 'song-rainy',
    title: 'Raindrops on Windowpane',
    mood: 'Melancholic & Dreamy',
    tempo: 68,
    chords: ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'],
  },
  {
    id: 'song-starlight',
    title: 'Starlight Library Nook',
    mood: 'Deep Calm & Ambient',
    tempo: 72,
    chords: ['Abmaj7', 'Fm7', 'Bbm7', 'Eb7'],
  },
  {
    id: 'song-bakery',
    title: 'Warm Cinnamon Afternoon',
    mood: 'Cozy & Sweet',
    tempo: 80,
    chords: ['Gmaj7', 'E7', 'Am7', 'D7'],
  },
];

export const LEVEL_RANKS = [
  { level: 1, title: '🌱 Cozy Sprout' },
  { level: 3, title: '☕ Cafe Regular' },
  { level: 5, title: '📖 Dedicated Reader' },
  { level: 8, title: '🍵 Tea Apprentice' },
  { level: 12, title: '⭐ Master Scholar' },
  { level: 16, title: '🌙 Starlight Sage' },
  { level: 20, title: '👑 Grand Mochi Guardian' },
];

export const DEFAULT_USER_STATS: UserStats = {
  level: 2,
  exp: 65,
  maxExp: 100,
  berries: 45,
  streakDays: 4,
  totalFocusSeconds: 3840,
  todayFocusSeconds: 1500,
  sessionsCompletedToday: 1,
  dailyFocusGoalMinutes: 120,
  tasksCompletedTotal: 8,
  petsCount: 3,
  affinityScore: 78,
  equipped: {
    hat: 'hat_strawberry',
    outfit: 'outfit_sage_cardigan',
    accessory: 'acc_boba',
    companion: 'comp_cat',
  },
  unlockedItemIds: ['hat_none', 'hat_strawberry', 'outfit_default', 'outfit_sage_cardigan', 'acc_none', 'acc_boba', 'comp_cat'],
  note: "Today's goal: Finish chapter notes, drink 2 cups of tea, and be kind to myself! ✨",
  lastActiveDate: new Date().toISOString().slice(0, 10),
  goalMetToday: false,
};
