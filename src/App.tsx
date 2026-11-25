import React, { useState, useEffect, useRef } from 'react';
import { SceneId, TimeOfDay, TimerMode, UserStats, TaskItem, QuestItem, ShopItem, ItemCategory } from './types';
import { DEFAULT_USER_STATS, INITIAL_TASKS, INITIAL_QUESTS } from './data/initialData';
import { SceneRenderer } from './components/scenes/SceneRenderer';
import { TopBar } from './components/navigation/TopBar';
import { BottomSceneBar } from './components/navigation/BottomSceneBar';
import { PomodoroWidget } from './components/widgets/PomodoroWidget';
import { TodoListWidget } from './components/widgets/TodoListWidget';
import { AudioPlayerWidget } from './components/widgets/AudioPlayerWidget';
import { StatsDiaryWidget } from './components/widgets/StatsDiaryWidget';
import { ShopModal } from './components/widgets/ShopModal';
import { HelpModal } from './components/modals/HelpModal';
import { LevelUpModal } from './components/modals/LevelUpModal';
import { ZenFocusOverlay } from './components/widgets/ZenFocusOverlay';
import { WaterReminderModal } from './components/modals/WaterReminderModal';
import { GeminiChatWidget } from './components/widgets/GeminiChatWidget';
import { audioEngine } from './services/audioEngine';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'mochi_study_space_v2';

export default function App() {
  // Load persisted state or fallback
  const [activeScene, setActiveScene] = useState<SceneId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).activeScene || 'bedroom'; } catch (_) {}
    }
    return 'bedroom';
  });

  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [zenMode, setZenMode] = useState(false);

  // Timer State
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalDuration, setTotalDuration] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // User Stats & Progression
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).userStats || DEFAULT_USER_STATS; } catch (_) {}
    }
    return DEFAULT_USER_STATS;
  });

  // Tasks & Quests
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).tasks || INITIAL_TASKS; } catch (_) {}
    }
    return INITIAL_TASKS;
  });

  const [quests, setQuests] = useState<QuestItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).quests || INITIAL_QUESTS; } catch (_) {}
    }
    return INITIAL_QUESTS;
  });

  // Audio state
  const [ambientVolumes, setAmbientVolumes] = useState<Record<string, number>>({
    rain: 0,
    cafe: 0,
    keyboard: 0,
    fireplace: 0,
    chimes: 0,
    waves: 0,
  });
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);
  const [activeLofiTrackId, setActiveLofiTrackId] = useState('song-morning');
  const [lofiVolume, setLofiVolume] = useState(0.6);

  // Modals & Panels Visibility
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);
  const [showAudioWidget, setShowAudioWidget] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState<{ isOpen: boolean; newLevel: number; bonusBerries: number }>({
    isOpen: false,
    newLevel: 1,
    bonusBerries: 0,
  });

  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [waterActiveSeconds, setWaterActiveSeconds] = useState(0);

  // Track web session active time & water reminder every 25 minutes
  useEffect(() => {
    const activeInterval = setInterval(() => {
      setWaterActiveSeconds((prev) => {
        const next = prev + 1;
        if (next >= 1500) { // 25 minutes of active web time
          setIsWaterModalOpen(true);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(activeInterval);
  }, []);

  const handleDrinkWater = () => {
    setIsWaterModalOpen(false);
    setWaterActiveSeconds(0);
    awardExpAndBerries(20, 25);
    setUserStats((prev) => ({
      ...prev,
      affinityScore: Math.min(100, prev.affinityScore + 3),
    }));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#90CAF9', '#E3F2FD', '#C1E1C1'],
    });
  };

  const handleSnoozeWater = () => {
    setIsWaterModalOpen(false);
    setWaterActiveSeconds(1500 - 300); // snooze 5 minutes
  };

  // Save state to localStorage on changes
  useEffect(() => {
    const payload = {
      activeScene,
      userStats,
      tasks,
      quests,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [activeScene, userStats, tasks, quests]);

  // Check and update daily streak on load / new day
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setUserStats((prev) => {
      if (!prev.lastActiveDate) {
        return { ...prev, lastActiveDate: todayStr, goalMetToday: false };
      }
      if (prev.lastActiveDate !== todayStr) {
        const lastDate = new Date(prev.lastActiveDate);
        const currDate = new Date(todayStr);
        const diffTime = currDate.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = prev.streakDays;
        const goalSecs = (prev.dailyFocusGoalMinutes || 120) * 60;
        const reachedGoalPrevious = prev.todayFocusSeconds >= goalSecs || prev.goalMetToday;

        if (diffDays === 1) {
          if (!reachedGoalPrevious) {
            newStreak = 0;
          }
        } else if (diffDays > 1) {
          newStreak = 0;
        }

        return {
          ...prev,
          streakDays: newStreak,
          todayFocusSeconds: 0,
          sessionsCompletedToday: 0,
          lastActiveDate: todayStr,
          goalMetToday: false,
        };
      }
      return prev;
    });
  }, []);

  // Track SPA scene page views in GA4 on navigation without duplicate initial page view
  const isFirstSceneMount = useRef(true);
  useEffect(() => {
    if (isFirstSceneMount.current) {
      isFirstSceneMount.current = false;
      return;
    }
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: '/' + activeScene,
        page_title: `Mochi's Corner — ${activeScene}`,
      });
    }
  }, [activeScene]);

  // Pomodoro Timer Interval Engine
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (timerMode === 'focus') {
          setUserStats((prev) => {
            const newTodaySecs = prev.todayFocusSeconds + 1;
            const goalSecs = (prev.dailyFocusGoalMinutes || 120) * 60;
            let newStreak = prev.streakDays;
            let goalMetToday = prev.goalMetToday;

            if (!goalMetToday && newTodaySecs >= goalSecs) {
              goalMetToday = true;
              newStreak = prev.streakDays + 1;
              audioEngine.playLevelUpSfx();
              confetti({
                particleCount: 90,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#FFE082', '#FFD1DC', '#C1E1C1', '#B197FC'],
              });
            }

            return {
              ...prev,
              totalFocusSeconds: prev.totalFocusSeconds + 1,
              todayFocusSeconds: newTodaySecs,
              streakDays: newStreak,
              goalMetToday,
            };
          });
        }
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      // Timer finished!
      handleTimerCompletion();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerMode]);

  const handleTimerCompletion = () => {
    setIsTimerRunning(false);
    if (soundEnabled) {
      audioEngine.playTimerFinishedSfx();
    }

    if (timerMode === 'focus') {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6B8B', '#FFE082', '#81C784', '#B197FC'],
      });

      // Award EXP and Berries
      awardExpAndBerries(35, 15);

      setUserStats((prev) => ({
        ...prev,
        sessionsCompletedToday: prev.sessionsCompletedToday + 1,
        affinityScore: Math.min(100, prev.affinityScore + 5),
      }));

      // Update quests progress for pomodoro
      updateQuestProgress('quest-pomodoro', 1);

      // Switch to short break
      setTimerMode('shortBreak');
      setTimeLeft(5 * 60);
      setTotalDuration(5 * 60);
    } else {
      // Switch back to focus
      setTimerMode('focus');
      setTimeLeft(25 * 60);
      setTotalDuration(25 * 60);
    }
  };

  // EXP & Level Up Calculation
  const awardExpAndBerries = (expAmount: number, berryAmount: number) => {
    setUserStats((prev) => {
      let currentExp = prev.exp + expAmount;
      let currentLevel = prev.level;
      let maxExp = prev.maxExp;
      let newBerries = prev.berries + berryAmount;

      if (currentExp >= maxExp) {
        currentExp = currentExp - maxExp;
        currentLevel += 1;
        maxExp = Math.round(maxExp * 1.35);
        const bonusBerries = currentLevel * 10;
        newBerries += bonusBerries;

        // Trigger celebration
        setTimeout(() => {
          audioEngine.playLevelUpSfx();
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.5 },
          });
          setLevelUpModal({
            isOpen: true,
            newLevel: currentLevel,
            bonusBerries,
          });
        }, 300);
      }

      return {
        ...prev,
        level: currentLevel,
        exp: currentExp,
        maxExp,
        berries: newBerries,
      };
    });
  };

  const updateQuestProgress = (questId: string, increment: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          const updated = Math.min(q.target, q.current + increment);
          return { ...q, current: updated };
        }
        return q;
      })
    );
  };

  // Timer controls
  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(totalDuration);
  };

  const handleSkipTimer = () => {
    handleTimerCompletion();
  };

  const handleChangeTimerMode = (mode: TimerMode, durationMinutes: number = 25) => {
    setTimerMode(mode);
    const secs = durationMinutes * 60;
    setTotalDuration(secs);
    setTimeLeft(secs);
    setIsTimerRunning(false);
  };

  const handleUpdateDailyGoal = (minutes: number) => {
    setUserStats((prev) => ({
      ...prev,
      dailyFocusGoalMinutes: Math.max(10, minutes),
    }));
  };

  // Mascot interaction
  const handlePetMochi = () => {
    setUserStats((prev) => ({
      ...prev,
      petsCount: prev.petsCount + 1,
      affinityScore: Math.min(100, prev.affinityScore + 1),
    }));
    updateQuestProgress('quest-pet', 1);
  };

  // Scene switcher
  const handleSelectScene = (sceneId: SceneId) => {
    setActiveScene(sceneId);
    updateQuestProgress('quest-explore', 1);
  };

  // Task management
  const handleAddTask = (
    title: string,
    category: TaskItem['category'],
    priority: TaskItem['priority'],
    pomodoros: number
  ) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      category,
      priority,
      completed: false,
      pomodorosEstimated: pomodoros,
      pomodorosCompleted: 0,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            awardExpAndBerries(15, 5);
            updateQuestProgress('quest-tasks', 1);
            setUserStats((prevStats) => ({
              ...prevStats,
              tasksCompletedTotal: prevStats.tasksCompletedTotal + 1,
            }));
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClaimQuestReward = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    awardExpAndBerries(quest.rewardExp, quest.rewardBerries);
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
    );
  };

  // Shop & Closet
  const handleBuyItem = (item: ShopItem) => {
    if (userStats.berries < item.price) return;
    setUserStats((prev) => ({
      ...prev,
      berries: prev.berries - item.price,
      unlockedItemIds: [...prev.unlockedItemIds, item.id],
      equipped: {
        ...prev.equipped,
        [item.category]: item.id,
      },
    }));
  };

  const handleEquipItem = (category: ItemCategory, itemId: string) => {
    setUserStats((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [category]: itemId,
      },
    }));
  };

  // Audio Controls
  const handleAmbientVolumeChange = (key: string, vol: number) => {
    setAmbientVolumes((prev) => ({ ...prev, [key]: vol }));
    audioEngine.setAmbientVolume(key, vol);
  };

  const handleToggleLofi = (playing?: boolean, trackId?: string) => {
    const nextState = playing !== undefined ? playing : !isLofiPlaying;
    setIsLofiPlaying(nextState);
    audioEngine.toggleLofi(nextState, trackId || activeLofiTrackId);
  };

  const handleLofiVolumeChange = (vol: number) => {
    setLofiVolume(vol);
    audioEngine.setLofiVolume(vol);
  };

  const handleSelectLofiTrack = (trackId: string) => {
    setActiveLofiTrackId(trackId);
    if (isLofiPlaying) {
      audioEngine.toggleLofi(false);
      setTimeout(() => {
        audioEngine.toggleLofi(true, trackId);
      }, 100);
    }
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'muteAll') {
      const resetVolumes = { rain: 0, cafe: 0, keyboard: 0, fireplace: 0, chimes: 0, waves: 0 };
      setAmbientVolumes(resetVolumes);
      Object.keys(resetVolumes).forEach((k) => audioEngine.setAmbientVolume(k, 0));
      handleToggleLofi(false);
    } else if (presetName === 'rainyCafe') {
      handleAmbientVolumeChange('rain', 0.6);
      handleAmbientVolumeChange('cafe', 0.35);
      handleAmbientVolumeChange('keyboard', 0.2);
      handleSelectLofiTrack('song-rainy');
      handleToggleLofi(true, 'song-rainy');
    } else if (presetName === 'fireplaceNight') {
      handleAmbientVolumeChange('fireplace', 0.65);
      handleAmbientVolumeChange('keyboard', 0.25);
      handleAmbientVolumeChange('waves', 0.2);
      handleSelectLofiTrack('song-starlight');
      handleToggleLofi(true, 'song-starlight');
    }
  };

  const handleUpdateNote = (note: string) => {
    setUserStats((prev) => ({ ...prev, note }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-['Quicksand']">
      {/* Background Interactive Vector Scene */}
      <SceneRenderer
        activeScene={activeScene}
        timeOfDay={timeOfDay}
        timerMode={timerMode}
        isTimerRunning={isTimerRunning}
        userStats={userStats}
        zenMode={zenMode}
        onPetMochi={handlePetMochi}
      />

      {/* Top Header Bar */}
      <TopBar
        userStats={userStats}
        timeOfDay={timeOfDay}
        onChangeTimeOfDay={setTimeOfDay}
        zenMode={zenMode}
        onToggleZenMode={() => setZenMode(!zenMode)}
        onOpenShop={() => setIsShopOpen(true)}
        onToggleAudioWidget={() => setShowAudioWidget(!showAudioWidget)}
        onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Zen Mode Minimalist Focus Card Overlay */}
      <AnimatePresence>
        {zenMode && (
          <ZenFocusOverlay
            timerMode={timerMode}
            timeLeft={timeLeft}
            isRunning={isTimerRunning}
            userStats={userStats}
            onToggleTimer={handleToggleTimer}
            onChangeMode={handleChangeTimerMode}
            onExitZenMode={() => setZenMode(false)}
            onPetMochi={handlePetMochi}
          />
        )}
      </AnimatePresence>

      {/* Floating Interactive Widget Cards (Hidden in Zen Mode) */}
      <AnimatePresence>
        {!zenMode && (
          <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden p-3 md:p-6 flex flex-col justify-between">
            {/* Left Top & Middle Stack: Pomodoro & Soundscape */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mt-16 max-h-[80vh] overflow-y-auto pointer-events-none">
              <div className="flex flex-col gap-3 pointer-events-auto">
                <PomodoroWidget
                  timerMode={timerMode}
                  timeLeft={timeLeft}
                  totalDuration={totalDuration}
                  isRunning={isTimerRunning}
                  sessionsCompletedToday={userStats.sessionsCompletedToday}
                  todayFocusSeconds={userStats.todayFocusSeconds}
                  dailyFocusGoalMinutes={userStats.dailyFocusGoalMinutes}
                  onUpdateDailyGoal={handleUpdateDailyGoal}
                  onToggleTimer={handleToggleTimer}
                  onResetTimer={handleResetTimer}
                  onSkipTimer={handleSkipTimer}
                  onChangeMode={handleChangeTimerMode}
                  soundEnabled={soundEnabled}
                  onToggleSound={() => setSoundEnabled(!soundEnabled)}
                />

                {showAudioWidget && (
                  <AudioPlayerWidget
                    ambientVolumes={ambientVolumes}
                    onAmbientVolumeChange={handleAmbientVolumeChange}
                    isLofiPlaying={isLofiPlaying}
                    activeLofiTrackId={activeLofiTrackId}
                    lofiVolume={lofiVolume}
                    onToggleLofi={handleToggleLofi}
                    onLofiVolumeChange={handleLofiVolumeChange}
                    onSelectLofiTrack={handleSelectLofiTrack}
                    onApplyPreset={handleApplyPreset}
                  />
                )}
              </div>

              {/* Right Stack: To-Do List & Stats Diary */}
              <div className="flex flex-col gap-3 pointer-events-auto">
                <TodoListWidget
                  tasks={tasks}
                  quests={quests}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onClaimQuestReward={handleClaimQuestReward}
                />

                <StatsDiaryWidget
                  userStats={userStats}
                  onUpdateNote={handleUpdateNote}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Scene Switcher Bar */}
      <BottomSceneBar
        activeScene={activeScene}
        onSelectScene={handleSelectScene}
      />

      {/* Modals */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        userStats={userStats}
        onBuyItem={handleBuyItem}
        onEquipItem={handleEquipItem}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <LevelUpModal
        isOpen={levelUpModal.isOpen}
        newLevel={levelUpModal.newLevel}
        bonusBerries={levelUpModal.bonusBerries}
        onClose={() => setLevelUpModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <WaterReminderModal
        isOpen={isWaterModalOpen}
        onDrinkWater={handleDrinkWater}
        onSnooze={handleSnoozeWater}
      />

      <GeminiChatWidget
        isOpen={isGeminiChatOpen}
        onClose={() => setIsGeminiChatOpen(false)}
      />
    </div>
  );
}
