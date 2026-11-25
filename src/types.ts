export type SceneId = 'bedroom' | 'cafe' | 'library' | 'bakery' | 'zenGarden' | 'auroraCabin';

export type TimeOfDay = 'day' | 'golden' | 'dusk' | 'night';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

export interface TaskItem {
  id: string;
  title: string;
  category: 'study' | 'work' | 'reading' | 'creative' | 'selfcare';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  pomodorosEstimated: number;
  pomodorosCompleted: number;
  createdAt: number;
}

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  rewardExp: number;
  rewardBerries: number;
  current: number;
  target: number;
  completed: boolean;
  icon: string;
}

export type ItemCategory = 'hat' | 'outfit' | 'accessory' | 'companion' | 'scene-decor';

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  description: string;
  icon: string;
  previewColor?: string;
  unlocked: boolean;
}

export interface AmbientTrack {
  id: string;
  name: string;
  icon: string;
  volume: number; // 0 to 1
  isPlaying: boolean;
}

export interface LoFiSong {
  id: string;
  title: string;
  mood: string;
  tempo: number; // bpm
  chords: string[];
}

export interface UserStats {
  level: number;
  exp: number;
  maxExp: number;
  berries: number;
  streakDays: number;
  totalFocusSeconds: number;
  todayFocusSeconds: number;
  sessionsCompletedToday: number;
  dailyFocusGoalMinutes: number;
  tasksCompletedTotal: number;
  petsCount: number;
  affinityScore: number;
  equipped: {
    hat: string;
    outfit: string;
    accessory: string;
    companion: string;
  };
  unlockedItemIds: string[];
  note: string;
  lastActiveDate: string;
  goalMetToday?: boolean;
}

export interface FloatingWidgetPosition {
  x: number;
  y: number;
}
