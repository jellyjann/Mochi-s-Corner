import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskItem, QuestItem } from '../../types';
import { CheckCircle2, Circle, Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Award, ListTodo } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import confetti from 'canvas-confetti';

interface TodoListWidgetProps {
  tasks: TaskItem[];
  quests: QuestItem[];
  onAddTask: (title: string, category: TaskItem['category'], priority: TaskItem['priority'], pomodoros: number) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClaimQuestReward: (questId: string) => void;
}

export const TodoListWidget: React.FC<TodoListWidgetProps> = ({
  tasks,
  quests,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClaimQuestReward,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'quests'>('tasks');
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'done'>('all');

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('study');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('medium');
  const [newPomodoros, setNewPomodoros] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    audioEngine.playClickSfx();
    onAddTask(newTitle.trim(), newCategory, newPriority, newPomodoros);
    setNewTitle('');
    setIsAdding(false);
  };

  const handleToggle = (task: TaskItem) => {
    audioEngine.playTaskCompleteSfx();
    if (!task.completed) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FFD1DC', '#FFFDD0', '#C1E1C1', '#E6E6FA'],
      });
    }
    onToggleTask(task.id);
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'active') return !t.completed;
    if (taskFilter === 'done') return t.completed;
    return true;
  });

  const categoryBadge = {
    study: { label: 'Study 📚', bg: 'bg-[#FFD1DC]/40 text-slate-700 border-white/80' },
    work: { label: 'Work 💻', bg: 'bg-[#E6E6FA]/60 text-slate-700 border-white/80' },
    reading: { label: 'Reading 📖', bg: 'bg-[#C1E1C1]/50 text-slate-700 border-white/80' },
    creative: { label: 'Creative 🎨', bg: 'bg-[#FFFDD0] text-slate-700 border-white/80' },
    selfcare: { label: 'Self-Care 🌸', bg: 'bg-white/70 text-slate-700 border-white/80' },
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <motion.div
      id="todo-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] shadow-xl p-5 text-slate-700 font-['Fredoka'] max-w-[340px] w-full"
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/60 border border-white/80 flex items-center justify-center text-slate-700 shadow-xs">
            {activeTab === 'tasks' ? (
              <ListTodo size={18} className="text-[#8E8DBE]" />
            ) : (
              <Award size={18} className="text-amber-500" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight text-slate-700">
              {activeTab === 'tasks' ? "Today's Tasks" : 'Daily Quests'}
            </h3>
            <p className="text-[11px] text-slate-500 font-['Nunito'] font-medium">
              {activeTab === 'tasks'
                ? `${completedCount}/${tasks.length} tasks completed`
                : 'Complete quests for berries & EXP'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sub-tab switcher */}
          <div className="flex bg-white/30 border border-white/60 p-0.5 rounded-2xl text-xs">
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                setActiveTab('tasks');
              }}
              className={`px-2.5 py-1 rounded-xl transition-all font-semibold ${
                activeTab === 'tasks' ? 'bg-white/90 shadow-xs text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                setActiveTab('quests');
              }}
              className={`px-2.5 py-1 rounded-xl transition-all font-semibold ${
                activeTab === 'quests' ? 'bg-white/90 shadow-xs text-amber-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Quests
            </button>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/70 text-slate-600 transition-colors"
          >
            {isMinimized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="mt-3">
          {activeTab === 'tasks' ? (
            <>
              {/* Task Filters & Add Button */}
              <div className="flex justify-between items-center mb-2.5">
                <div className="flex gap-1 text-[11px] font-semibold text-slate-600">
                  <button
                    onClick={() => setTaskFilter('all')}
                    className={`px-2 py-0.5 rounded-lg transition-all ${
                      taskFilter === 'all'
                        ? 'bg-[#E6E6FA] text-slate-700 border border-white/80 font-bold'
                        : 'hover:bg-white/40'
                    }`}
                  >
                    All ({tasks.length})
                  </button>
                  <button
                    onClick={() => setTaskFilter('active')}
                    className={`px-2 py-0.5 rounded-lg transition-all ${
                      taskFilter === 'active'
                        ? 'bg-[#E6E6FA] text-slate-700 border border-white/80 font-bold'
                        : 'hover:bg-white/40'
                    }`}
                  >
                    Active ({tasks.filter((t) => !t.completed).length})
                  </button>
                  <button
                    onClick={() => setTaskFilter('done')}
                    className={`px-2 py-0.5 rounded-lg transition-all ${
                      taskFilter === 'done'
                        ? 'bg-[#C1E1C1] text-slate-800 border border-white/80 font-bold'
                        : 'hover:bg-white/40'
                    }`}
                  >
                    Done ({completedCount})
                  </button>
                </div>

                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-[#FFD1DC] px-2.5 py-1 rounded-xl border border-white/80 hover:bg-pink-200 active:scale-95 shadow-xs transition-all"
                >
                  <Plus size={14} /> New Task
                </button>
              </div>

              {/* Add Task Form */}
              <AnimatePresence>
                {isAdding && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleCreateTask}
                    className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-white/90 mb-3 space-y-2 text-xs overflow-hidden shadow-sm"
                  >
                    <input
                      type="text"
                      placeholder="What are we studying or doing?"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-white/80 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C1E1C1]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="bg-white border border-white/80 rounded-xl px-2 py-1 text-slate-700 font-medium"
                      >
                        <option value="study">Study 📚</option>
                        <option value="work">Work 💻</option>
                        <option value="reading">Reading 📖</option>
                        <option value="creative">Creative 🎨</option>
                        <option value="selfcare">Self-Care 🌸</option>
                      </select>

                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as any)}
                        className="bg-white border border-white/80 rounded-xl px-2 py-1 text-slate-700 font-medium"
                      >
                        <option value="low">Low !</option>
                        <option value="medium">Medium !!</option>
                        <option value="high">High !!!</option>
                      </select>

                      <div className="flex items-center gap-1 bg-white border border-white/80 rounded-xl px-2 py-1">
                        <span>🍅</span>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={newPomodoros}
                          onChange={(e) => setNewPomodoros(parseInt(e.target.value) || 1)}
                          className="w-8 text-center text-slate-800 font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 bg-[#C1E1C1] text-slate-800 rounded-xl font-bold hover:bg-[#b0dcb0] shadow-xs"
                      >
                        Add Task
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Task Item List */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">
                    <p className="text-2xl mb-1">🌱</p>
                    <p>No tasks here yet. Relax or add something cozy!</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 group ${
                        task.completed
                          ? 'bg-white/40 border-white/60 opacity-60'
                          : 'bg-white/70 backdrop-blur-xs border-white/80 hover:bg-white/90 shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => handleToggle(task)}
                        className="mt-0.5 text-slate-700 hover:scale-110 transition-transform"
                      >
                        {task.completed ? (
                          <div className="w-5 h-5 rounded-lg bg-[#C1E1C1] border-2 border-[#C1E1C1] flex items-center justify-center text-white">
                            <CheckCircle2 size={14} className="text-slate-800" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-lg border-2 border-[#FFD1DC] bg-white hover:border-[#ff9ebb] transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0 font-['Nunito']">
                        <p
                          className={`text-xs font-semibold leading-snug break-words ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-700'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-md border font-bold ${
                              categoryBadge[task.category].bg
                            }`}
                          >
                            {categoryBadge[task.category].label}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                            🍓 {task.pomodorosCompleted}/{task.pomodorosEstimated} sessions
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          audioEngine.playClickSfx();
                          onDeleteTask(task.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 hover:bg-white/80 rounded-lg transition-opacity"
                        title="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Daily Quests View */
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {quests.map((quest) => {
                const isReadyToClaim = quest.current >= quest.target && !quest.completed;
                const pct = Math.min(100, (quest.current / quest.target) * 100);

                return (
                  <div
                    key={quest.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      quest.completed
                        ? 'bg-white/30 border-white/50 opacity-70'
                        : isReadyToClaim
                        ? 'bg-white/80 backdrop-blur-xs border-white/90 shadow-md ring-2 ring-[#FFD1DC]/40'
                        : 'bg-white/60 backdrop-blur-xs border-white/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{quest.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-700">{quest.title}</h4>
                          <p className="text-[11px] text-slate-500 font-['Nunito']">{quest.description}</p>
                        </div>
                      </div>

                      <div className="text-[10px] font-bold text-right text-slate-700">
                        <div>+{quest.rewardBerries} 🍓</div>
                        <div className="text-[#8E8DBE]">+{quest.rewardExp} EXP</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex-1 bg-white/50 h-2 rounded-full overflow-hidden border border-white/60">
                        <div
                          className="bg-[#C1E1C1] h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">
                        {quest.current}/{quest.target}
                      </span>
                    </div>

                    {/* Claim Button if completed */}
                    {isReadyToClaim && (
                      <button
                        onClick={() => {
                          audioEngine.playLevelUpSfx();
                          confetti({
                            particleCount: 50,
                            spread: 70,
                            origin: { y: 0.7 },
                            colors: ['#FFD1DC', '#FFFDD0', '#C1E1C1', '#E6E6FA'],
                          });
                          onClaimQuestReward(quest.id);
                        }}
                        className="mt-2.5 w-full py-1.5 bg-[#C1E1C1] hover:bg-[#b0dcb0] text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 animate-bounce border border-white/80"
                      >
                        <Sparkles size={14} /> Claim Rewards!
                      </button>
                    )}

                    {quest.completed && (
                      <div className="mt-1.5 text-center text-[10px] font-bold text-emerald-600">
                        ✓ Quest Completed Today
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
