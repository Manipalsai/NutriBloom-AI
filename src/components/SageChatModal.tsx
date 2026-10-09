import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, sendChatMessage } from '../services/api';
import { UserGoals } from '../types/nutrition';
import { GardenReserves } from '../services/storage';

interface SageChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userContext: {
    calories: number;
    targetCalories: number;
    protein: number;
    targetProtein: number;
    carbs: number;
    targetCarbs: number;
    fat: number;
    targetFat: number;
    water: number;
    targetWater: number;
    oasisLevel: number;
    streak: number;
  };
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'model',
    content:
      "Greetings! I am Sage, your mindful botanical nutritionist. Whether you want to calibrate your evening macros, find whole-food protein sources, or discover calming herbal tea rituals to nourish your bloom, I am here to help.",
    timestamp: Date.now(),
  },
];

const PROMPT_SUGGESTIONS = [
  '🌿 How can I reach my protein goal today?',
  '🍵 Recommend an evening tea for digestion & sleep',
  '🥑 High-satiety plant-based lunch ideas',
  '💧 How should I time my water intake today?',
];

export const SageChatModal: React.FC<SageChatModalProps> = ({
  isOpen,
  onClose,
  userContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('nutribloom_chat_history_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MESSAGES;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('nutribloom_chat_history_v1', JSON.stringify(messages));
    } catch {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const payload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage(payload, userContext);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: res.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content:
          "The botanical garden whisper was momentarily interrupted. Remember to keep hydrating with mineral-rich sips, and try asking again in a moment.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear conversation history with Sage?')) {
      setMessages(DEFAULT_MESSAGES);
      localStorage.removeItem('nutribloom_chat_history_v1');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg h-[92vh] sm:h-[84vh] bg-[#ffffff] rounded-3xl shadow-[0_24px_48px_-8px_rgba(32,48,39,0.25),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/20 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#e5f8ea] via-[#ffffff] to-[#e0f3e5] border-b border-[#3e6b56]/15 flex items-center justify-between shadow-[0_2px_8px_rgba(32,48,39,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#3e6b56] to-[#25533f] flex items-center justify-center text-white shadow-[0_3px_8px_rgba(37,83,63,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]">
              <span className="text-[20px] leading-none">🌿</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline text-base text-[#0f1f16] font-bold">Sage</h2>
                <span className="px-2 py-0.2 rounded-full bg-[#bceed3] text-[#002114] text-[9px] font-bold uppercase tracking-wider">
                  Botanical AI
                </span>
              </div>
              <p className="text-[11px] text-[#414944] font-medium">
                Clinical Nutritionist &amp; Herbalist Guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearHistory}
              title="Reset Chat"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#414944] hover:text-[#99462a] bg-[#e5f8ea] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close Chat"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#414944] hover:text-[#0f1f16] bg-[#e5f8ea] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Live User Context Bar */}
        <div className="px-4 py-2 bg-[#e5f8ea]/80 border-b border-[#3e6b56]/10 flex items-center justify-between text-[11px] text-[#414944] overflow-x-auto whitespace-nowrap gap-3">
          <div className="flex items-center gap-1 font-semibold text-[#25533f]">
            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
            <span>
              {userContext.calories} / {userContext.targetCalories} kcal
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#99462a]">restaurant</span>
            <span>
              P: {userContext.protein}g / {userContext.targetProtein}g
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#25533f]">water_drop</span>
            <span>
              {(userContext.water / 1000).toFixed(1)}L / {(userContext.targetWater / 1000).toFixed(1)}L
            </span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-[#855900]">
            <span>🌱 Day {userContext.streak}</span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fdfbf7]/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-b from-[#3e6b56] to-[#25533f] text-white shadow-[0_3px_8px_rgba(37,83,63,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] rounded-br-sm'
                    : 'bg-[#ffffff] text-[#0f1f16] shadow-[0_2px_8px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 rounded-bl-sm'
                }`}
              >
                {m.role === 'model' && (
                  <div className="flex items-center gap-1 text-[#25533f] font-bold text-[10px] mb-1 uppercase tracking-wider">
                    <span>🌿 Sage Herbalist</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
              <span className="text-[10px] text-[#717973] px-1 mt-0.5 font-mono">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start">
              <div className="rounded-2xl p-3.5 bg-[#ffffff] shadow-[0_2px_8px_rgba(32,48,39,0.06)] border border-[#3e6b56]/15 rounded-bl-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#25533f] animate-spin">
                  eco
                </span>
                <span className="text-xs text-[#414944] italic font-serif">
                  Sage is brewing a mindful botanical response...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Prompts */}
        <div className="px-4 py-2 bg-[#ffffff] border-t border-[#3e6b56]/10 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          {PROMPT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="px-3 py-1.5 rounded-full bg-[#e5f8ea] text-[#25533f] hover:bg-[#d4e7d9] text-[11px] font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] border border-[#3e6b56]/15 active:scale-95 transition-all shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Message Input Well */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#e5f8ea] border-t border-[#3e6b56]/15 flex items-center gap-2"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Ask Sage about food, macros, herbal remedies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-full bg-[#ffffff] text-[#0f1f16] text-xs font-medium placeholder:text-[#717973] shadow-[inset_0_2px_4px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/20 focus:outline-none focus:ring-1 focus:ring-[#25533f]"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-b from-[#3e6b56] to-[#25533f] text-white shadow-[0_3px_8px_rgba(37,83,63,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0.5'
                : 'bg-[#d4e7d9] text-[#717973] cursor-not-allowed opacity-60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
