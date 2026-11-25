import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Sparkles, ChevronDown, Minimize2, Maximize2 } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface GeminiChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChatWidget: React.FC<GeminiChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi there! I'm Mochi, your AI study assistant powered by Gemini. How can I help you focus, learn, or organize your study session today? 🌸✨",
    },
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-4-hydrogen');
  const [selectedRole, setSelectedRole] = useState('cozy_buddy');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const roleInstructions: Record<string, string> = {
    cozy_buddy: "You are Mochi, a cozy, warm, and friendly study companion in Mochi's Corner. Use friendly tone, cute emojis, and encourage the user.",
    productivity_coach: "You are an expert productivity coach. Help the user break down tasks, plan Pomodoro intervals, and maintain high efficiency without burnout.",
    stem_mentor: "You are an advanced STEM and coding mentor. Provide clear, deep, and structured explanations for math, science, and programming queries.",
    deep_reasoner: "You are a deep reasoning tutor. Analyze complex root causes, philosophical concepts, or technical architectures with rigorous depth.",
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    audioEngine.playClickSfx();

    const newMessages: Message[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel,
          history: newMessages.slice(0, -1), // previous history
          systemInstruction: roleInstructions[selectedRole],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from Gemini');
      }

      setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
      audioEngine.playLevelUpSfx();
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: `Oops! Something went wrong: ${err.message}. Please check your connection or API settings.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] h-[540px] bg-white/95 backdrop-blur-md border-2 border-[#FFD1DC] rounded-[32px] shadow-2xl flex flex-col overflow-hidden font-['Fredoka']"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD1DC]/60 via-[#FFE082]/60 to-[#C1E1C1]/60 px-5 py-3.5 border-b border-white/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/80 border border-white flex items-center justify-center text-lg shadow-xs">
              🤖
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                Mochi AI Assistant <Sparkles size={13} className="text-[#F59E0B]" />
              </h3>
              <p className="text-[10px] text-slate-500 font-['Nunito'] font-medium">
                Powered by Gemini (@google/genai)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playClickSfx();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/60 hover:bg-white text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Model & Role Selectors */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 text-xs font-['Nunito']">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-[#FFD1DC]"
          >
            <option value="gemini-4-hydrogen">Gemini 4 Hydrogen (General)</option>
            <option value="gemini-4-argon">Gemini 4 Argon (Complex)</option>
            <option value="gemini-4-carbon">Gemini 4 Carbon (Deep Reason)</option>
            <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite (Fast)</option>
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-[#FFD1DC] flex-1"
          >
            <option value="cozy_buddy">🌸 Cozy Study Buddy</option>
            <option value="productivity_coach">⏱️ Productivity Coach</option>
            <option value="stem_mentor">🔬 STEM & Code Mentor</option>
            <option value="deep_reasoner">🧠 Deep Reasoner</option>
          </select>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-white/30 to-[#FFFDF9]">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#C1E1C1] text-slate-800'
                    : 'bg-[#FFD1DC] text-slate-800'
                }`}
              >
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs font-['Nunito'] leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#C1E1C1]/40 border border-[#C1E1C1] text-slate-800 rounded-tr-none'
                    : 'bg-white border border-[#FFD1DC]/60 text-slate-700 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-[#FFD1DC] flex items-center justify-center text-xs shadow-xs">
                <Bot size={14} />
              </div>
              <div className="bg-white border border-[#FFD1DC]/60 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B8B] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#FFE082] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#C1E1C1] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-400 font-['Fredoka'] ml-1">Mochi is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Mochi anything about studying..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-['Nunito'] focus:outline-none focus:ring-2 focus:ring-[#FFD1DC]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-2xl bg-[#FFD1DC] hover:bg-[#ffb3c1] disabled:opacity-50 text-slate-800 transition-colors shadow-xs"
          >
            <Send size={16} />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};
