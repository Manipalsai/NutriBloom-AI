import React, { useState } from 'react';
import { WaterLog, UserGoals } from '../types/nutrition';
import { NavTab } from '../components/BottomNav';

interface HydrationViewProps {
  waterLogs: WaterLog[];
  userGoals: UserGoals;
  onAddWater: (amount: number, label: string, type: WaterLog['type']) => void;
  onUndoLast: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const HydrationView: React.FC<HydrationViewProps> = ({
  waterLogs,
  userGoals,
  onAddWater,
  onUndoLast,
  onNavigate,
}) => {
  const [chimeActive, setChimeActive] = useState(true);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customAmount, setCustomAmount] = useState(250);
  const [customType, setCustomType] = useState<WaterLog['type']>('Pure Spring Water');

  const currentVolume = waterLogs.reduce((sum, log) => sum + log.amount, 0);
  const targetGoal = userGoals.dailyWaterMl || 2800;
  const percentage = Math.min(100, Math.round((currentVolume / targetGoal) * 100));
  const remainingMl = Math.max(0, targetGoal - currentVolume);

  // Liquid height in carafe (clamped between 15% and 94% for visual appeal)
  const fluidHeightPercent = Math.max(15, Math.min(94, (currentVolume / targetGoal) * 90));

  // Blend aggregates
  const pureWaterTotal = waterLogs
    .filter((l) => l.type === 'Pure Spring Water' || l.type === 'Custom')
    .reduce((sum, l) => sum + l.amount, 0);
  const herbalTotal = waterLogs
    .filter((l) => l.type === 'Herbal & Chamomile')
    .reduce((sum, l) => sum + l.amount, 0);
  const electrolyteTotal = waterLogs
    .filter((l) => l.type === 'Electrolyte Citrus')
    .reduce((sum, l) => sum + l.amount, 0);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmount > 0) {
      onAddWater(customAmount, `Custom ${customAmount}ml`, customType);
      setShowCustomModal(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 space-y-5 pt-2">
      {/* Top Greeting & Hydration Status */}
      <section className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#25533f] text-[20px]">water_drop</span>
            <h1 className="font-headline text-2xl text-[#25533f] font-semibold tracking-tight">
              Daily Hydration Log
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#daeddf] shadow-[inset_0_1px_2px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.9)]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3e6b56] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#25533f] uppercase tracking-wider">
              Optimal Rhythm
            </span>
          </div>
        </div>
        <p className="text-xs text-[#414944]">
          Sustaining cell vitality and natural clarity with mindful sips.
        </p>
      </section>

      {/* Big Hero Dimensional Vessel Card */}
      <section className="relative w-full rounded-2xl bg-[#ffffff] p-5 shadow-[0_12px_28px_-6px_rgba(32,48,39,0.12),0_4px_12px_rgba(32,48,39,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 overflow-hidden">
        {/* Ambient glow behind vessel */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#e0f3e5]/60 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#b8e9cf]/20 blur-2xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-5">
          {/* Tactile Carafe / Water Flask */}
          <div className="relative w-40 h-64 flex-shrink-0 flex items-center justify-center">
            {/* Physical glass vessel shape */}
            <div className="relative w-36 h-60 rounded-[38px] p-2 bg-gradient-to-b from-white/95 via-[#e5f8ea]/40 to-[#daeddf]/60 shadow-[0_16px_28px_-6px_rgba(37,83,63,0.18),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(32,48,39,0.1)] flex flex-col justify-end overflow-hidden border border-[#3e6b56]/15">
              {/* Glass Top Lip & Neck highlight */}
              <div className="absolute top-2 inset-x-8 h-2 rounded-full bg-gradient-to-b from-white to-[#ffffff]/50 shadow-[0_1px_2px_rgba(32,48,39,0.08)]"></div>

              {/* Carafe Debossed Measurement Lines (ml etchings) */}
              <div className="absolute inset-y-6 right-3 flex flex-col justify-between items-end z-20 pointer-events-none select-none text-[9px] text-[#25533f]/70">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-medium opacity-80">{targetGoal}</span>
                  <span className="w-2.5 h-[1.5px] bg-[#25533f]/40 rounded-full shadow-[0_1px_0_rgba(255,255,255,0.7)]"></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-medium opacity-80">2100</span>
                  <span className="w-1.5 h-[1.5px] bg-[#25533f]/40 rounded-full shadow-[0_1px_0_rgba(255,255,255,0.7)]"></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-bold text-[#25533f]">1950</span>
                  <span className="w-3 h-[2px] bg-[#25533f] rounded-full shadow-[0_1px_0_rgba(255,255,255,0.8)]"></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-medium opacity-80">1400</span>
                  <span className="w-2 h-[1.5px] bg-[#25533f]/40 rounded-full shadow-[0_1px_0_rgba(255,255,255,0.7)]"></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-medium opacity-80">700</span>
                  <span className="w-1.5 h-[1.5px] bg-[#25533f]/40 rounded-full shadow-[0_1px_0_rgba(255,255,255,0.7)]"></span>
                </div>
              </div>

              {/* Glass Refraction Light Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none z-20"></div>
              <div className="absolute top-4 left-3 w-1.5 h-44 rounded-full bg-white/70 blur-[0.5px] pointer-events-none z-20"></div>

              {/* Fluid Column */}
              <div
                className="relative w-full rounded-b-[30px] rounded-t-xl overflow-hidden shadow-[inset_0_2px_6px_rgba(255,255,255,0.7),inset_0_-8px_16px_rgba(21,71,52,0.3)] transition-all duration-700 ease-out flex flex-col justify-between"
                style={{
                  height: `${fluidHeightPercent}%`,
                  background: 'linear-gradient(180deg, #9fe1cd 0%, #489b7b 45%, #2a6850 100%)',
                }}
              >
                {/* Animated Water Surface Meniscus & Wave SVG */}
                <div className="w-full h-4 overflow-hidden relative opacity-90 -mt-1">
                  <svg
                    className="w-[200%] h-full fill-white/60 animate-pulse"
                    preserveAspectRatio="none"
                    viewBox="0 0 120 20"
                  >
                    <path d="M0,8 C15,14 35,2 60,8 C85,14 105,2 120,8 L120,0 L0,0 Z"></path>
                  </svg>
                  <div className="absolute inset-x-0 top-0 h-1 bg-white/80 blur-[1px]"></div>
                </div>

                {/* Rising Micro Bubbles */}
                <div className="relative w-full h-full pointer-events-none">
                  <span className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-white/60 animate-ping"></span>
                  <span className="absolute bottom-8 right-6 w-2 h-2 rounded-full bg-white/50"></span>
                  <span className="absolute bottom-16 left-8 w-1 h-1 rounded-full bg-white/70"></span>
                  <span className="absolute bottom-24 right-10 w-2.5 h-2.5 rounded-full bg-white/40"></span>
                </div>

                {/* Fluid Base Caustics */}
                <div className="w-full h-6 bg-gradient-to-t from-[#25533f] to-transparent opacity-60"></div>
              </div>
            </div>

            {/* Physical Carafe Shadow on Table */}
            <div className="absolute -bottom-1.5 w-32 h-3.5 bg-[#0f1f16]/15 rounded-full blur-md -z-10"></div>
          </div>

          {/* Hydro Metric Dashboard */}
          <div className="flex-1 w-full flex flex-col justify-center">
            {/* Debossed Progress Badge Well */}
            <div className="rounded-2xl p-4 bg-[#e5f8ea] shadow-[inset_0_2px_4px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#414944] font-bold">
                  Volume Achieved
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#bceed3] text-[#002114] text-[11px] font-bold">
                  {percentage}% Goal
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="font-headline text-3xl text-[#25533f] font-bold tracking-tight">
                  {currentVolume.toLocaleString()}
                </span>
                <span className="font-headline text-base text-[#414944]">/ {targetGoal.toLocaleString()} ml</span>
              </div>

              {/* Debossed Volumetric Progress Rail */}
              <div className="w-full h-3 rounded-full bg-[#d4e7d9] shadow-[inset_0_1.5px_3px_rgba(32,48,39,0.12),0_1px_0_rgba(255,255,255,0.8)] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#a1d1b8] via-[#3e6b56] to-[#25533f] relative transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-x-0 top-0 h-[35%] bg-white/50 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-[#414944] font-medium">Remaining to target:</span>
                <span className="text-[#99462a] font-bold">
                  {remainingMl > 0 ? `${remainingMl.toLocaleString()} ml left` : 'Daily Target Reached 🎉'}
                </span>
              </div>
            </div>

            {/* Pace Status Tag */}
            <div className="mt-2.5 flex items-center gap-2.5 p-2.5 rounded-xl bg-[#e0f3e5] shadow-[0_2px_6px_rgba(32,48,39,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] border border-[#3e6b56]/10">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#25533f] shadow-[0_1px_3px_rgba(32,48,39,0.1)]">
                <span className="material-symbols-outlined text-[16px]">speed</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#0f1f16] font-semibold truncate">
                  Hydration Pace: <span className="text-[#25533f] font-bold">Optimal Balance</span>
                </p>
                <p className="text-[11px] text-[#414944] line-clamp-1">+10% ahead of circadian curve</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tactile Quick-Log Buttons Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#99462a] text-[18px]">add_circle</span>
            <h2 className="font-headline text-base text-[#0f1f16] font-semibold">Quick Nourish</h2>
          </div>
          <span className="text-[11px] text-[#414944] uppercase tracking-wider font-semibold">
            Tap to log
          </span>
        </div>

        {/* 3D Bevelled Drink Containers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* 250ml Glass Cup */}
          <button
            onClick={() => onAddWater(250, 'Standard Glass', 'Pure Spring Water')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ffffff] shadow-[0_5px_10px_-2px_rgba(32,48,39,0.1),inset_0_1px_0_rgba(255,255,255,1)] border border-[#3e6b56]/15 active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(32,48,39,0.2)] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#e0f3e5] flex items-center justify-center text-[#25533f] mb-1 shadow-[inset_0_1px_2px_rgba(32,48,39,0.08)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">local_cafe</span>
            </div>
            <span className="font-headline text-base text-[#25533f] font-bold">+250</span>
            <span className="text-[10px] text-[#414944]">Glass Cup</span>
          </button>

          {/* 350ml Warm Mug */}
          <button
            onClick={() => onAddWater(350, 'Herbal Mug', 'Herbal & Chamomile')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ffffff] shadow-[0_5px_10px_-2px_rgba(32,48,39,0.1),inset_0_1px_0_rgba(255,255,255,1)] border border-[#3e6b56]/15 active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(32,48,39,0.2)] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#e0f3e5] flex items-center justify-center text-[#855900] mb-1 shadow-[inset_0_1px_2px_rgba(32,48,39,0.08)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">emoji_food_beverage</span>
            </div>
            <span className="font-headline text-base text-[#0f1f16] font-bold">+350</span>
            <span className="text-[10px] text-[#414944]">Warm Mug</span>
          </button>

          {/* 500ml Sport Bottle */}
          <button
            onClick={() => onAddWater(500, 'Sport Bottle', 'Pure Spring Water')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ffffff] shadow-[0_5px_10px_-2px_rgba(32,48,39,0.1),inset_0_1px_0_rgba(255,255,255,1)] border border-[#3e6b56]/15 active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(32,48,39,0.2)] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#e0f3e5] flex items-center justify-center text-[#3e6b56] mb-1 shadow-[inset_0_1px_2px_rgba(32,48,39,0.08)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">fitness_center</span>
            </div>
            <span className="font-headline text-base text-[#25533f] font-bold">+500</span>
            <span className="text-[10px] text-[#414944]">Sport Bottle</span>
          </button>

          {/* 750ml Hydro Flask */}
          <button
            onClick={() => onAddWater(750, 'Hydro Flask', 'Pure Spring Water')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ffffff] shadow-[0_5px_10px_-2px_rgba(32,48,39,0.1),inset_0_1px_0_rgba(255,255,255,1)] border border-[#3e6b56]/15 active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(32,48,39,0.2)] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#e0f3e5] flex items-center justify-center text-[#99462a] mb-1 shadow-[inset_0_1px_2px_rgba(32,48,39,0.08)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">water_bottle</span>
            </div>
            <span className="font-headline text-base text-[#99462a] font-bold">+750</span>
            <span className="text-[10px] text-[#414944]">Hydro Flask</span>
          </button>

          {/* Custom ml Button */}
          <button
            onClick={() => setShowCustomModal(true)}
            className="col-span-2 sm:col-span-1 group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#e5f8ea] shadow-[inset_0_2px_4px_rgba(32,48,39,0.1),0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/20 active:translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#414944] mb-1 shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">dialpad</span>
            </div>
            <span className="font-headline text-base text-[#0f1f16] font-semibold">Custom</span>
            <span className="text-[10px] text-[#414944]">Specific ml</span>
          </button>
        </div>
      </section>

      {/* Hydration Blend Breakdown */}
      <section className="flex flex-col gap-2">
        <h2 className="font-headline text-base text-[#0f1f16] font-semibold">Hydration Blend</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Pure Spring Water */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#ffffff] shadow-[0_4px_12px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15">
            <div className="w-10 h-10 rounded-xl bg-[#e0f3e5] flex items-center justify-center text-[#25533f] flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">water_drop</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#414944]">Pure Spring Water</p>
              <p className="font-headline text-base text-[#25533f] font-bold">
                {pureWaterTotal.toLocaleString()} <span className="text-xs font-normal text-[#414944]">ml</span>
              </p>
            </div>
          </div>

          {/* Herbal Infusions */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#ffffff] shadow-[0_4px_12px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15">
            <div className="w-10 h-10 rounded-xl bg-[#e0f3e5] flex items-center justify-center text-[#855900] flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">eco</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#414944]">Herbal &amp; Chamomile</p>
              <p className="font-headline text-base text-[#855900] font-bold">
                {herbalTotal.toLocaleString()} <span className="text-xs font-normal text-[#414944]">ml</span>
              </p>
            </div>
          </div>

          {/* Electrolyte Infusion */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#ffffff] shadow-[0_4px_12px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15">
            <div className="w-10 h-10 rounded-xl bg-[#e0f3e5] flex items-center justify-center text-[#99462a] flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#414944]">Electrolyte Citrus</p>
              <p className="font-headline text-base text-[#99462a] font-bold">
                {electrolyteTotal.toLocaleString()} <span className="text-xs font-normal text-[#414944]">ml</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Garden Nourishment Banner */}
      <section
        onClick={() => onNavigate('garden')}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e5f8ea] to-[#e0f3e5] p-4 shadow-[0_6px_16px_-4px_rgba(32,48,39,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-[#3e6b56]/20 cursor-pointer active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#25533f] shadow-[0_2px_8px_rgba(37,83,63,0.12)]">
              <span className="material-symbols-outlined text-[26px]">potted_plant</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-headline text-base text-[#25533f] font-bold">Garden Hydrated</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#bceed3] text-[#002114] text-[10px] font-bold">
                  +5 Dew Drops
                </span>
              </div>
              <p className="text-xs text-[#414944] mt-0.5">
                Your mindful intake today unlocked a new Sage Blossom leaf!
              </p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full bg-white text-[#25533f] flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Smart Climate & AI Sync Tactile Card */}
      <section className="rounded-2xl bg-[#ffffff] p-4 shadow-[0_8px_20px_-4px_rgba(32,48,39,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-[#3e6b56]/15 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#99462a] text-[20px]">wb_sunny</span>
            <h3 className="font-headline text-base text-[#0f1f16] font-semibold">Climate Sync &amp; Reminders</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#e0f3e5] text-[#25533f] text-[10px] font-bold">
            Active Sensor
          </span>
        </div>

        {/* Weather & Walk Adjustment Box */}
        <div className="p-3 rounded-xl bg-[#e5f8ea] shadow-[inset_0_1px_2px_rgba(32,48,39,0.06),0_1px_0_rgba(255,255,255,0.9)] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-[#99462a] flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
            <span className="material-symbols-outlined text-[18px]">thermostat</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#0f1f16] font-semibold">Weather Sync: 74°F Warm &amp; Sunny</p>
            <p className="text-xs text-[#414944] mt-0.5 leading-relaxed">
              Daily goal auto-adjusted <span className="font-bold text-[#99462a]">+300 ml</span> to compensate for dry breeze and planned 35 min afternoon stroll.
            </p>
          </div>
        </div>

        {/* Interactive Skeuomorphic Toggle for Chime */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#414944] text-[20px]">notifications_active</span>
            <div>
              <p className="text-xs font-semibold text-[#0f1f16]">Gentle Botanical Chime</p>
              <p className="text-[11px] text-[#414944]">Soft wooden chime ping every 90 minutes</p>
            </div>
          </div>

          <button
            onClick={() => setChimeActive(!chimeActive)}
            className={`relative w-12 h-7 rounded-full p-0.5 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] ${
              chimeActive ? 'bg-[#25533f]' : 'bg-[#d4e7d9]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)] flex items-center justify-center transition-transform ${
                chimeActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {chimeActive && (
                <span className="material-symbols-outlined text-[12px] text-[#25533f]">check</span>
              )}
            </div>
          </button>
        </div>
      </section>

      {/* Today's Water Log Timeline */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#25533f] text-[18px]">history</span>
            <h2 className="font-headline text-base text-[#0f1f16] font-semibold">Today's Sips</h2>
          </div>
          <button
            onClick={onUndoLast}
            disabled={waterLogs.length === 0}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#e5f8ea] text-[#414944] hover:text-[#0f1f16] active:scale-95 shadow-sm text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[14px]">undo</span>
            <span>Undo Last</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {waterLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#ffffff] shadow-[0_2px_6px_rgba(32,48,39,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e5f8ea] flex items-center justify-center text-[#25533f] shadow-[inset_0_1px_1px_rgba(32,48,39,0.08)]">
                  <span className="material-symbols-outlined text-[18px]">
                    {log.type === 'Herbal & Chamomile' ? 'emoji_food_beverage' : 'water_drop'}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0f1f16]">{log.label}</p>
                  <p className="text-[11px] text-[#414944]">{log.time} • {log.type}</p>
                </div>
              </div>
              <span className="font-headline text-sm font-bold text-[#25533f]">
                +{log.amount} ml
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Log Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl border border-[#3e6b56]/20 space-y-3">
            <h3 className="font-headline text-base font-semibold text-[#0f1f16]">Custom Water Intake</h3>
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Amount (ml)</label>
                <input
                  type="number"
                  min="50"
                  max="2000"
                  step="50"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] font-bold text-sm border border-[#3e6b56]/20 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Drink Type</label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs border border-[#3e6b56]/20 focus:outline-none"
                >
                  <option value="Pure Spring Water">Pure Spring Water</option>
                  <option value="Herbal & Chamomile">Herbal &amp; Chamomile</option>
                  <option value="Electrolyte Citrus">Electrolyte Citrus</option>
                  <option value="Custom">Custom Infusion</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[#e5f8ea] text-[#414944] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#25533f] text-white text-xs font-bold shadow-sm"
                >
                  Log Sips
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
