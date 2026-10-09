import React, { useState } from 'react';
import { UserGoals } from '../types/nutrition';
import { GardenReserves } from '../services/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userGoals: UserGoals;
  onSaveGoals: (goals: UserGoals) => void;
  reserves: GardenReserves;
  streak: number;
  totalMealsCount: number;
  onResetDemoData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userGoals,
  onSaveGoals,
  reserves,
  streak,
  totalMealsCount,
  onResetDemoData,
}) => {
  const [goals, setGoals] = useState<UserGoals>(userGoals);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoals(goals);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-[#ffffff] rounded-2xl p-6 shadow-[0_20px_40px_-8px_rgba(32,48,39,0.22),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/20 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#d4e7d9]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-0.5 bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.15)] flex items-center justify-center">
              <img
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
              />
            </div>
            <div>
              <h2 className="font-headline text-xl text-[#0f1f16] font-semibold">Elena Vance</h2>
              <p className="text-xs text-[#414944] font-sans">Botanical Nutritionist &amp; Member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#414944] hover:text-[#0f1f16] bg-[#e5f8ea] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Vital Stats Strip */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <div className="p-2.5 rounded-xl bg-[#e5f8ea] text-center shadow-[inset_0_1px_2px_rgba(32,48,39,0.06)]">
            <span className="text-[10px] uppercase font-bold text-[#414944] block">Streak</span>
            <span className="font-headline text-lg text-[#25533f] font-bold">{streak} Days</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#e5f8ea] text-center shadow-[inset_0_1px_2px_rgba(32,48,39,0.06)]">
            <span className="text-[10px] uppercase font-bold text-[#414944] block">Water Drops</span>
            <span className="font-headline text-lg text-[#3e6b56] font-bold">{reserves.waterDrops}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#e5f8ea] text-center shadow-[inset_0_1px_2px_rgba(32,48,39,0.06)]">
            <span className="text-[10px] uppercase font-bold text-[#414944] block">Sun Nectar</span>
            <span className="font-headline text-lg text-[#855900] font-bold">{reserves.sunNectar} pts</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[#25533f] text-[18px]">tune</span>
              <h3 className="font-headline text-base text-[#0f1f16] font-semibold">Custom Nutrition Goals</h3>
            </div>
            <p className="text-xs text-[#414944] mb-3">
              Calibrate your daily energetic fuel and macro targets:
            </p>

            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-xs font-semibold text-[#0f1f16] mb-1">
                  <span>Daily Calories (kcal)</span>
                  <span className="text-[#25533f] font-bold">{goals.dailyCalories} kcal</span>
                </label>
                <input
                  type="range"
                  min="1200"
                  max="3500"
                  step="50"
                  value={goals.dailyCalories}
                  onChange={(e) => setGoals({ ...goals, dailyCalories: Number(e.target.value) })}
                  className="w-full accent-[#25533f] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#0f1f16] block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min="40"
                    max="250"
                    value={goals.dailyProtein}
                    onChange={(e) => setGoals({ ...goals, dailyProtein: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#e5f8ea] text-[#0f1f16] font-bold text-sm shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)] border border-[#c0c9c2]/50 focus:outline-none focus:ring-1 focus:ring-[#25533f]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#0f1f16] block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    min="50"
                    max="400"
                    value={goals.dailyCarbs}
                    onChange={(e) => setGoals({ ...goals, dailyCarbs: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#e5f8ea] text-[#0f1f16] font-bold text-sm shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)] border border-[#c0c9c2]/50 focus:outline-none focus:ring-1 focus:ring-[#25533f]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#0f1f16] block mb-1">Fats (g)</label>
                  <input
                    type="number"
                    min="20"
                    max="150"
                    value={goals.dailyFat}
                    onChange={(e) => setGoals({ ...goals, dailyFat: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#e5f8ea] text-[#0f1f16] font-bold text-sm shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)] border border-[#c0c9c2]/50 focus:outline-none focus:ring-1 focus:ring-[#25533f]"
                  />
                </div>
              </div>

              <div>
                <label className="flex justify-between text-xs font-semibold text-[#0f1f16] mb-1">
                  <span>Hydration Target (ml)</span>
                  <span className="text-[#3e6b56] font-bold">{goals.dailyWaterMl} ml</span>
                </label>
                <input
                  type="range"
                  min="1500"
                  max="4500"
                  step="100"
                  value={goals.dailyWaterMl}
                  onChange={(e) => setGoals({ ...goals, dailyWaterMl: Number(e.target.value) })}
                  className="w-full accent-[#3e6b56] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-b from-[#3e6b56] to-[#25533f] text-white font-semibold text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_rgba(37,83,63,0.3)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{savedToast ? 'Goals Calibrated ✓' : 'Save Personal Targets'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset sample logged meals, hydration and garden to fresh state?')) {
                  onResetDemoData();
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-full bg-[#e5f8ea] text-[#99462a] text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] active:translate-y-0.5 transition-all"
            >
              Reset Demo Records to Default
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
