import React from 'react';
import { Meal, DailyGoal, UserGoals, GardenPlant } from '../types/nutrition';
import { NavTab } from '../components/BottomNav';

interface HomeViewProps {
  meals: Meal[];
  goals: DailyGoal[];
  userGoals: UserGoals;
  plants: GardenPlant[];
  streak: number;
  onNavigate: (tab: NavTab) => void;
  onToggleGoal: (id: string) => void;
  onOpenQuickMeal: (mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
  onOpenQuickWater: () => void;
  onOpenChat?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  meals,
  goals,
  userGoals,
  plants,
  streak,
  onNavigate,
  onToggleGoal,
  onOpenQuickMeal,
  onOpenQuickWater,
  onOpenChat,
}) => {
  // Aggregate current daily intake
  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.fat || 0), 0);

  const calRemaining = Math.max(0, userGoals.dailyCalories - totalCalories);
  const calPercent = Math.min(100, Math.round((totalCalories / userGoals.dailyCalories) * 100));

  // Circumference of 66px radius circle = 2 * PI * 66 ≈ 414.7
  const circumference = 414.7;
  const strokeDashoffset = Math.max(0, circumference - (circumference * Math.min(100, calPercent)) / 100);

  const proteinPercent = Math.min(100, Math.round((totalProtein / userGoals.dailyProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / userGoals.dailyCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / userGoals.dailyFat) * 100));

  // Companion plant
  const companionPlant = plants[0] || {
    name: 'Sage Fern',
    stage: 4,
    health: 85,
    streakDays: streak,
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 gap-5 pt-2">
      {/* Greeting & Natural Rhythm Indicator */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#25533f] uppercase tracking-wider font-sans">
            Afternoon Glow • Day {streak}
          </span>
          <h1 className="font-headline text-2xl text-[#0f1f16] tracking-tight font-semibold mt-0.5">
            Today's Nourishment
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4e7d9] shadow-[inset_0_2px_4px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.9)] text-[#25533f]">
          <span className="material-symbols-outlined text-[16px] text-[#25533f]">spa</span>
          <span className="text-xs font-semibold text-[#25533f]">In Balance</span>
        </div>
      </div>

      {/* 1. Tactile Calorie & Macro Gauge Card */}
      <section className="rounded-2xl p-5 bg-[#ffffff] shadow-[0_12px_28px_-6px_rgba(32,48,39,0.1),0_4px_10px_rgba(32,48,39,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 relative overflow-hidden">
        {/* Subtle parchment ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#e5f8ea]/60 blur-2xl pointer-events-none"></div>

        <div className="flex flex-col items-center relative z-10">
          {/* Circular Gauge Dial Container */}
          <div className="relative w-52 h-52 flex items-center justify-center my-1 select-none">
            {/* Debossed Under-Well Outer Disc */}
            <div className="absolute inset-0 rounded-full bg-[#e0f3e5] shadow-[inset_0_4px_8px_rgba(32,48,39,0.14),0_1px_1px_rgba(255,255,255,0.85)]"></div>

            {/* SVG Radial Gauge Meter */}
            <svg className="w-48 h-48 transform -rotate-90 relative z-10" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                fill="none"
                r="66"
                stroke="#d4e7d9"
                strokeLinecap="round"
                strokeWidth="12"
              />
              {/* Active Fluid Track */}
              <circle
                className="transition-all duration-1000 ease-out"
                cx="80"
                cy="80"
                fill="none"
                r="66"
                stroke="#3e6b56"
                strokeDasharray="414.7"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="12"
                style={{ filter: 'drop-shadow(0px 2px 4px rgba(37,83,63,0.35))' }}
              />
            </svg>

            {/* Center Embossed Dial Knob / Reading Disc */}
            <div className="absolute w-36 h-36 rounded-full bg-gradient-to-b from-[#ffffff] to-[#e5f8ea] flex flex-col items-center justify-center shadow-[0_6px_14px_rgba(32,48,39,0.12),inset_0_2px_1px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(32,48,39,0.06)] z-20">
              <span className="material-symbols-outlined text-[20px] text-[#25533f]">local_fire_department</span>
              <div className="flex items-baseline mt-0.5">
                <span className="font-headline text-[28px] text-[#0f1f16] font-bold tracking-tight leading-none">
                  {totalCalories.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-[#414944] uppercase tracking-wider font-semibold mt-0.5 font-sans">
                of {userGoals.dailyCalories.toLocaleString()} kcal
              </span>
              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#e0f3e5] text-[#25533f] shadow-[inset_0_1px_2px_rgba(32,48,39,0.08)]">
                <span className="text-[11px] font-bold font-sans">
                  {calRemaining > 0 ? `${calRemaining.toLocaleString()} left` : 'Target Met 🎉'}
                </span>
              </div>
            </div>
          </div>

          {/* Macro Raised Tactile Pills Row */}
          <div className="grid grid-cols-3 gap-2.5 w-full mt-4">
            {/* Protein Pill */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#e5f8ea] shadow-[0_3px_8px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#0f1f16]">Protein</span>
                <span className="text-[11px] font-bold text-[#25533f]">{proteinPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.12)] overflow-hidden my-1">
                <div
                  className="h-full rounded-full bg-[#3e6b56] transition-all duration-700"
                  style={{ width: `${proteinPercent}%` }}
                ></div>
              </div>
              <div className="flex items-baseline justify-between mt-0.5 text-xs text-[#414944]">
                <span className="font-bold text-[#0f1f16]">{totalProtein}g</span>
                <span className="text-[#717973]">/ {userGoals.dailyProtein}g</span>
              </div>
            </div>

            {/* Carbs Pill */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#e5f8ea] shadow-[0_3px_8px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#0f1f16]">Carbs</span>
                <span className="text-[11px] font-bold text-[#855900]">{carbsPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.12)] overflow-hidden my-1">
                <div
                  className="h-full rounded-full bg-[#f9bc59] transition-all duration-700"
                  style={{ width: `${carbsPercent}%` }}
                ></div>
              </div>
              <div className="flex items-baseline justify-between mt-0.5 text-xs text-[#414944]">
                <span className="font-bold text-[#0f1f16]">{totalCarbs}g</span>
                <span className="text-[#717973]">/ {userGoals.dailyCarbs}g</span>
              </div>
            </div>

            {/* Fats Pill */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#e5f8ea] shadow-[0_3px_8px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#0f1f16]">Fats</span>
                <span className="text-[11px] font-bold text-[#99462a]">{fatPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.12)] overflow-hidden my-1">
                <div
                  className="h-full rounded-full bg-[#fe9572] transition-all duration-700"
                  style={{ width: `${fatPercent}%` }}
                ></div>
              </div>
              <div className="flex items-baseline justify-between mt-0.5 text-xs text-[#414944]">
                <span className="font-bold text-[#0f1f16]">{totalFat}g</span>
                <span className="text-[#717973]">/ {userGoals.dailyFat}g</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tactile Quick Actions */}
      <section className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-[#414944] uppercase tracking-wider">
          Tactile Actions
        </span>
        <div className="grid grid-cols-4 gap-2.5">
          {/* Snap Meal */}
          <button
            onClick={() => onNavigate('scanner')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ffffff] shadow-[0_6px_14px_-2px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] transition-all border border-[#3e6b56]/10"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-b from-[#487A63] to-[#25533f] flex items-center justify-center text-white shadow-[0_4px_10px_rgba(37,83,63,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </div>
            <span className="text-xs font-semibold text-[#0f1f16] mt-2 group-active:text-[#25533f]">
              Snap Meal
            </span>
          </button>

          {/* Log Water */}
          <button
            onClick={onOpenQuickWater}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ffffff] shadow-[0_6px_14px_-2px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] transition-all border border-[#3e6b56]/10"
          >
            <div className="w-11 h-11 rounded-full bg-[#daeddf] flex items-center justify-center text-[#25533f] shadow-[inset_0_2px_4px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.9)]">
              <span className="material-symbols-outlined text-[20px]">water_drop</span>
            </div>
            <span className="text-xs font-semibold text-[#0f1f16] mt-2 group-active:text-[#25533f]">
              Log Water
            </span>
          </button>

          {/* Barcode / Quick Add */}
          <button
            onClick={() => onOpenQuickMeal('lunch')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ffffff] shadow-[0_6px_14px_-2px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] transition-all border border-[#3e6b56]/10"
          >
            <div className="w-11 h-11 rounded-full bg-[#daeddf] flex items-center justify-center text-[#414944] shadow-[inset_0_2px_4px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.9)]">
              <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
            </div>
            <span className="text-xs font-semibold text-[#0f1f16] mt-2 group-active:text-[#25533f]">
              Barcode
            </span>
          </button>

          {/* Voice Log */}
          <button
            onClick={() => onOpenQuickMeal('dinner')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#ffffff] shadow-[0_6px_14px_-2px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] transition-all border border-[#3e6b56]/10"
          >
            <div className="w-11 h-11 rounded-full bg-[#daeddf] flex items-center justify-center text-[#414944] shadow-[inset_0_2px_4px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.9)]">
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </div>
            <span className="text-xs font-semibold text-[#0f1f16] mt-2 group-active:text-[#25533f]">
              Voice Log
            </span>
          </button>
        </div>
      </section>

      {/* 3. Today's Bloom Status Card (Botanical Companion) */}
      <section
        onClick={() => onNavigate('garden')}
        className="rounded-2xl p-4 bg-gradient-to-br from-[#e5f8ea] via-[#ffffff] to-[#e0f3e5] shadow-[0_10px_24px_-4px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15 relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      >
        <div className="flex items-start gap-3.5">
          {/* Mini Plant Preview */}
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-[#d4e7d9] shadow-[inset_0_2px_4px_rgba(32,48,39,0.15)] flex items-center justify-center">
            <img
              alt="Botanical Companion"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=300&q=80"
            />
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-[#25533f]/90 text-white text-[9px] font-bold shadow-sm">
              Lv 4
            </div>
          </div>

          {/* Plant streak story */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h2 className="font-headline text-base text-[#0f1f16] font-semibold truncate">
                {companionPlant.name}
              </h2>
              <span className="text-xs font-bold text-[#25533f] bg-[#bceed3] px-2 py-0.5 rounded-full">
                Blooming 🌿
              </span>
            </div>
            <p className="text-xs text-[#414944] mt-1 line-clamp-2 leading-relaxed">
              Streak: <strong className="text-[#25533f] font-semibold">{streak} Days!</strong> Hydration &amp; nutrients sustained. Keep going to unlock the rare Golden Orchid.
            </p>

            {/* Next bloom stage */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#717973] font-semibold">Next Bloom Stage</span>
                <span className="text-[11px] text-[#25533f] font-bold">85%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_3px_rgba(32,48,39,0.12)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#a1d1b8] via-[#3e6b56] to-[#25533f]"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Today's Meals Timeline */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#25533f]">restaurant_menu</span>
            <h2 className="font-headline text-lg text-[#0f1f16] font-semibold">Meals Timeline</h2>
          </div>
          <span className="text-xs text-[#414944] font-medium font-sans">
            {meals.length} Recorded
          </span>
        </div>

        {meals.map((meal) => (
          <article
            key={meal.id}
            className="p-3.5 rounded-2xl bg-[#ffffff] shadow-[0_4px_12px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/10 flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#e0f3e5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] relative">
                {meal.image ? (
                  <img
                    alt={meal.title}
                    src={meal.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#25533f]">
                    <span className="material-symbols-outlined text-[24px]">restaurant</span>
                  </div>
                )}
                {meal.aiVerified && (
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#25533f] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[10px]">check</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#717973]">
                    {meal.mealType}
                  </span>
                  <span className="text-[#717973] text-xs">•</span>
                  <span className="text-xs text-[#717973]">{meal.time}</span>
                </div>
                <h3 className="text-sm text-[#0f1f16] font-semibold truncate mt-0.5">
                  {meal.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#e5f8ea] text-[#25533f] text-[11px] font-bold">
                    {meal.calories} kcal
                  </span>
                  <span className="text-[#717973] text-xs">{meal.protein}g Protein</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('journal')}
              title="View in Journal"
              className="w-8 h-8 rounded-full bg-[#e5f8ea] flex items-center justify-center text-[#414944] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] active:translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </article>
        ))}

        {/* Dinner Empty Inset Card (+ Plan or Log Dinner) */}
        <div
          onClick={() => onOpenQuickMeal('dinner')}
          className="p-4 rounded-2xl bg-[#e5f8ea]/70 shadow-[inset_0_2px_4px_rgba(32,48,39,0.07),0_1px_0_rgba(255,255,255,0.9)] border border-dashed border-[#3e6b56]/25 flex items-center justify-between gap-3 active:scale-[0.99] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#d4e7d9] flex items-center justify-center text-[#25533f] shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)]">
              <span className="material-symbols-outlined text-[24px]">nightlight</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#717973]">Evening</span>
              <span className="text-sm font-semibold text-[#0f1f16]">Plan or Log Dinner</span>
              <span className="text-xs text-[#717973]">
                Remaining: ~{calRemaining > 0 ? calRemaining : 500} kcal &amp; {Math.max(10, userGoals.dailyProtein - totalProtein)}g Protein
              </span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-gradient-to-b from-[#fe9572] to-[#99462a] flex items-center justify-center text-white shadow-[0_4px_8px_rgba(153,70,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </section>

      {/* 5. Daily Bloom Goals (Tactile Interactive Checklist) */}
      <section className="rounded-2xl p-4 bg-[#ffffff] shadow-[0_12px_28px_-6px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#855900] text-[20px]">military_tech</span>
            <h2 className="font-headline text-base text-[#0f1f16] font-semibold">Daily Bloom Goals</h2>
          </div>
          <span className="text-xs text-[#25533f] font-bold bg-[#e0f3e5] px-2.5 py-0.5 rounded-full">
            {goals.filter((g) => g.completed).length} / {goals.length} Active
          </span>
        </div>

        <div className="flex flex-col gap-2.5 mt-1">
          {goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => onToggleGoal(goal.id)}
              className="p-3 rounded-xl bg-[#e5f8ea] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_4px_rgba(32,48,39,0.04)] flex items-center justify-between gap-3 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {goal.completed ? (
                  <div className="w-6 h-6 rounded-md bg-gradient-to-b from-[#487A63] to-[#25533f] flex items-center justify-center text-white shadow-[0_2px_4px_rgba(37,83,63,0.3)]">
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-[#d4e7d9] shadow-[inset_0_2px_3px_rgba(32,48,39,0.15)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-[#717973] opacity-40">
                      horizontal_rule
                    </span>
                  </div>
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <span
                    className={`text-xs font-semibold ${
                      goal.completed ? 'text-[#0f1f16] line-through opacity-70' : 'text-[#0f1f16]'
                    }`}
                  >
                    {goal.title}
                  </span>
                  <span className="text-[11px] text-[#414944]">{goal.subtitle}</span>
                </div>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  goal.completed
                    ? 'bg-[#bceed3] text-[#25533f]'
                    : 'bg-[#d4e7d9] text-[#717973]'
                }`}
              >
                +{goal.xp} XP
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Mindful Botanical AI Suggestion Box */}
      <div className="rounded-2xl p-4 bg-[#daeddf]/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(32,48,39,0.04)] border border-[#3e6b56]/15 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#855900] shrink-0 shadow-sm mt-0.5">
          <span className="material-symbols-outlined text-[20px]">lightbulb</span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#25533f] uppercase tracking-wider font-sans">
              Botanical AI Suggestion
            </span>
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="text-[11px] font-bold text-[#25533f] hover:underline flex items-center gap-0.5"
              >
                <span>Ask Sage</span>
                <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
              </button>
            )}
          </div>
          <p className="text-xs text-[#414944] leading-relaxed mt-0.5">
            You're {Math.max(10, userGoals.dailyProtein - totalProtein)}g shy of your target protein. A handful of roasted pumpkin seeds with dinner will seal today's Bloom Goal perfectly.
          </p>
        </div>
      </div>
    </div>
  );
};
