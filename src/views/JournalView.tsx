import React, { useState } from 'react';
import { Meal, UserGoals } from '../types/nutrition';
import { getMealSuggestion } from '../services/api';

interface JournalViewProps {
  meals: Meal[];
  userGoals: UserGoals;
  onAddMeal: (meal: Meal) => void;
  onDeleteMeal: (id: string) => void;
  onOpenScanner: () => void;
  onOpenManualEntry: (mealType?: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  meals,
  userGoals,
  onAddMeal,
  onDeleteMeal,
  onOpenScanner,
  onOpenManualEntry,
}) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState(0); // 0 = today, -1 = yesterday, etc.
  const [expandedMealId, setExpandedMealId] = useState<string | null>('meal-breakfast-1');
  const [suggestionAdded, setSuggestionAdded] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  // Dynamic date calculation
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + selectedDayOffset);
  const dateFormatted =
    selectedDayOffset === 0
      ? `Today, ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Totals
  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.fat || 0), 0);
  const totalFiber = meals.reduce((sum, m) => sum + (m.fiber || 6), 0);
  const totalSodium = meals.reduce((sum, m) => sum + (m.sodium || 350), 0);

  const calRemaining = Math.max(0, userGoals.dailyCalories - totalCalories);
  const calPercent = Math.min(100, Math.round((totalCalories / userGoals.dailyCalories) * 100));

  // Suggestion Recipe State
  const [kitchenSuggestion, setKitchenSuggestion] = useState({
    title: 'Baked Tofu & Sesame Soba Bowl',
    description: 'Tailored to close your remaining micronutrient deficit while maintaining an anti-inflammatory gut state.',
    calories: 480,
    protein: 30,
    fiber: 9,
    carbs: 45,
    fat: 14,
  });

  const handleApplySuggestion = () => {
    const suggestedMeal: Meal = {
      id: `suggested-${Date.now()}`,
      title: kitchenSuggestion.title,
      mealType: 'dinner',
      time: '7:30 PM',
      timestamp: Date.now(),
      calories: kitchenSuggestion.calories,
      protein: kitchenSuggestion.protein,
      carbs: kitchenSuggestion.carbs,
      fat: kitchenSuggestion.fat,
      fiber: kitchenSuggestion.fiber,
      sodium: 440,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      aiVerified: true,
      confidence: 96,
      dietaryTags: ['Vegan', 'High Fiber', 'Anti-Inflammatory'],
      botanicalNotes: kitchenSuggestion.description,
      ingredients: [
        {
          id: 'sug-1',
          name: 'Crispy Baked Organic Tofu',
          weight: 150,
          unit: 'g',
          calories: 220,
          protein: 24,
          carbs: 3,
          fat: 12,
          confidence: 97,
          approxMeasure: 'Pan-baked cubes',
          category: 'protein',
          unitCals: 1.46,
          pFactor: 0.16,
          cFactor: 0.02,
          fFactor: 0.08,
        },
        {
          id: 'sug-2',
          name: 'Buckwheat Soba & Bok Choy',
          weight: 120,
          unit: 'g',
          calories: 190,
          protein: 6,
          carbs: 40,
          fat: 1,
          confidence: 95,
          approxMeasure: '1 cup noodles with greens',
          category: 'carb',
          unitCals: 1.58,
          pFactor: 0.05,
          cFactor: 0.33,
          fFactor: 0.01,
        },
        {
          id: 'sug-3',
          name: 'Toasted Sesame Ginger Dressing',
          weight: 15,
          unit: 'ml',
          calories: 70,
          protein: 0,
          carbs: 2,
          fat: 7,
          confidence: 94,
          approxMeasure: '1 tbsp glaze',
          category: 'sauce',
          unitCals: 4.67,
          pFactor: 0.0,
          cFactor: 0.13,
          fFactor: 0.47,
        },
      ],
    };

    onAddMeal(suggestedMeal);
    setSuggestionAdded(true);
  };

  const handleFetchNewSuggestion = async () => {
    setIsLoadingSuggestion(true);
    try {
      const res = await getMealSuggestion({
        remainingCalories: calRemaining > 0 ? calRemaining : 500,
        remainingProtein: Math.max(15, userGoals.dailyProtein - totalProtein),
        remainingCarbs: Math.max(20, userGoals.dailyCarbs - totalCarbs),
        remainingFat: Math.max(10, userGoals.dailyFat - totalFat),
        mealType: 'dinner',
      });
      if (res.success && res.suggestion) {
        setKitchenSuggestion({
          title: res.suggestion.recipeName,
          description: res.suggestion.botanicalReason,
          calories: res.suggestion.calories,
          protein: res.suggestion.protein,
          fiber: res.suggestion.fiber || 8,
          carbs: res.suggestion.carbs,
          fat: res.suggestion.fat,
        });
        setSuggestionAdded(false);
      }
    } catch (e) {
      console.warn('Suggestion refresh fallback:', e);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 space-y-5 pt-2">
      {/* 1. DATE NAVIGATION & STREAK BLOOM */}
      <section className="flex flex-col space-y-2.5">
        {/* Tactile Ceramic / Pressed Wood Date Pill */}
        <div className="flex items-center justify-between bg-[#e5f8ea] px-3 py-2 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),0_3px_8px_-1px_rgba(32,48,39,0.12),inset_0_-2px_4px_rgba(32,48,39,0.05)] border border-[#3e6b56]/15">
          <button
            onClick={() => setSelectedDayOffset((prev) => prev - 1)}
            aria-label="Previous Day"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#25533f] hover:bg-[#d4e7d9] transition-transform active:scale-90 shadow-[0_1px_2px_rgba(32,48,39,0.08)] bg-white"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined text-[#25533f] text-[18px]">calendar_today</span>
            <span className="font-headline text-base text-[#25533f] font-semibold tracking-tight">
              {dateFormatted}
            </span>
          </div>
          <button
            onClick={() => setSelectedDayOffset((prev) => Math.min(0, prev + 1))}
            disabled={selectedDayOffset >= 0}
            aria-label="Next Day"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-[0_1px_2px_rgba(32,48,39,0.08)] ${
              selectedDayOffset >= 0
                ? 'opacity-40 text-[#717973] cursor-not-allowed'
                : 'text-[#25533f] bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* 7-Day Blooming Micro-Streak Strip */}
        <div className="bg-[#ffffff] px-4 py-2.5 rounded-2xl shadow-[0_2px_8px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase text-[#25533f] tracking-wider">
              Week Bloom
            </span>
            <span className="text-xs text-[#414944] font-medium">(5/7 Met)</span>
          </div>
          <div className="flex items-center space-x-2.5">
            {['S', 'S', 'M', 'T', 'W'].map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-0.5">
                <span className="text-xs">🌸</span>
                <span className="text-[10px] font-semibold text-[#25533f]">{day}</span>
              </div>
            ))}
            {/* Today */}
            <div className="flex flex-col items-center gap-0.5 relative">
              <div className="w-5 h-5 rounded-full bg-[#fe9572]/40 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)]">
                <span className="text-xs">🌱</span>
              </div>
              <span className="text-[10px] font-bold text-[#99462a]">T</span>
            </div>
            {/* Tomorrow */}
            <div className="flex flex-col items-center gap-0.5 opacity-40">
              <div className="w-4 h-4 rounded-full bg-[#d4e7d9]"></div>
              <span className="text-[10px] text-[#717973]">F</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DAILY NUTRITION SCORECARD (EMBOSSED PHYSICAL SLATE) */}
      <section className="bg-[#ffffff] rounded-2xl p-4 shadow-[0_8px_20px_-4px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(32,48,39,0.04)] border border-[#3e6b56]/15 relative overflow-hidden">
        {/* Corner Apothecary watermark */}
        <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-[#e5f8ea]/60 flex items-center justify-center pointer-events-none rotate-12">
          <span className="material-symbols-outlined text-[#25533f]/20 text-3xl">spa</span>
        </div>

        {/* Header & Net Calories Gauge */}
        <div className="flex items-center justify-between pb-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#414944]">
              Daily Fuel Budget
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline text-2xl text-[#25533f] font-bold tracking-tight">
                {totalCalories.toLocaleString()}
              </span>
              <span className="text-xs text-[#414944]">/ {userGoals.dailyCalories.toLocaleString()} kcal</span>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2.5 py-1 rounded-full bg-[#e0f3e5] text-[#25533f] text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(32,48,39,0.05)]">
              {calRemaining > 0 ? `${calRemaining} kcal left` : 'Goal achieved'}
            </span>
          </div>
        </div>

        {/* Debossed Primary Net Energy Groove */}
        <div className="w-full h-3 rounded-full bg-[#d4e7d9] shadow-[inset_0_2px_4px_rgba(32,48,39,0.12),0_1px_0_rgba(255,255,255,0.9)] overflow-hidden p-0.5 mb-4">
          <div
            className="h-full rounded-full bg-[#25533f] transition-all duration-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
            style={{ width: `${calPercent}%` }}
          ></div>
        </div>

        {/* Macro Wells Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Protein */}
          <div className="bg-[#e5f8ea] p-2.5 rounded-xl shadow-[inset_0_1px_2px_rgba(32,48,39,0.06),0_1px_0_rgba(255,255,255,0.9)] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold uppercase text-[#414944]">Protein</span>
              <span className="text-xs font-bold text-[#99462a]">{totalProtein}g</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#99462a]"
                style={{ width: `${Math.min(100, Math.round((totalProtein / userGoals.dailyProtein) * 100))}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#414944]/80 mt-1">Goal: {userGoals.dailyProtein}g</span>
          </div>

          {/* Carbs */}
          <div className="bg-[#e5f8ea] p-2.5 rounded-xl shadow-[inset_0_1px_2px_rgba(32,48,39,0.06),0_1px_0_rgba(255,255,255,0.9)] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold uppercase text-[#414944]">Carbs</span>
              <span className="text-xs font-bold text-[#855900]">{totalCarbs}g</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#855900]"
                style={{ width: `${Math.min(100, Math.round((totalCarbs / userGoals.dailyCarbs) * 100))}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#414944]/80 mt-1">Goal: {userGoals.dailyCarbs}g</span>
          </div>

          {/* Fats */}
          <div className="bg-[#e5f8ea] p-2.5 rounded-xl shadow-[inset_0_1px_2px_rgba(32,48,39,0.06),0_1px_0_rgba(255,255,255,0.9)] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold uppercase text-[#414944]">Fats</span>
              <span className="text-xs font-bold text-[#3e6b56]">{totalFat}g</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#d4e7d9] shadow-[inset_0_1px_2px_rgba(32,48,39,0.1)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#3e6b56]"
                style={{ width: `${Math.min(100, Math.round((totalFat / userGoals.dailyFat) * 100))}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#414944]/80 mt-1">Goal: {userGoals.dailyFat}g</span>
          </div>
        </div>

        {/* Secondary Micronutrients debossed slot */}
        <div className="mt-3 pt-2.5 flex items-center justify-between text-[#414944] border-t border-[#3e6b56]/10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#25533f]">grain</span>
            <span className="text-xs">
              Fiber: <strong className="text-[#25533f] font-bold">{totalFiber}g</strong> / 35g
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#855900]">water</span>
            <span className="text-xs">
              Sodium: <strong className="text-[#0f1f16] font-bold">{totalSodium}mg</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 3. MEAL CATEGORIZED LOG ENTRIES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-lg text-[#0f1f16] font-semibold">Today's Plates</h2>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#25533f] uppercase font-bold tracking-wider">
              {meals.length} Recorded
            </span>
            <button
              onClick={() => onOpenManualEntry('lunch')}
              className="px-2.5 py-1 rounded-full bg-[#e5f8ea] text-[#25533f] text-xs font-semibold shadow-sm active:translate-y-0.5"
            >
              + Add Meal
            </button>
          </div>
        </div>

        {meals.map((meal) => {
          const isExpanded = expandedMealId === meal.id;
          return (
            <article
              key={meal.id}
              className="bg-[#ffffff] rounded-2xl p-3.5 shadow-[0_4px_12px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 transition-all"
            >
              <div
                className="flex gap-3 cursor-pointer"
                onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-[inset_0_1px_2px_rgba(32,48,39,0.2)] bg-[#e0f3e5] relative">
                  {meal.image ? (
                    <img
                      alt={meal.title}
                      className="w-full h-full object-cover"
                      src={meal.image}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#25533f]">
                      <span className="material-symbols-outlined text-[28px]">restaurant</span>
                    </div>
                  )}
                  {meal.aiVerified && (
                    <div className="absolute top-1 left-1 px-1 py-0.5 rounded-full bg-[#25533f]/90 text-white text-[9px] font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">check</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#414944] uppercase tracking-wider font-bold">
                        {meal.mealType} • {meal.time}
                      </span>
                      <span className="text-xs font-bold text-[#25533f]">{meal.calories} kcal</span>
                    </div>
                    <p className="text-sm font-semibold text-[#0f1f16] truncate mt-0.5">
                      {meal.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#e5f8ea] text-[#99462a] text-[10px] font-bold">
                      {meal.protein}g P
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#e5f8ea] text-[#855900] text-[10px] font-bold">
                      {meal.carbs}g C
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#e5f8ea] text-[#3e6b56] text-[10px] font-bold">
                      {meal.fat}g F
                    </span>
                  </div>
                </div>
              </div>

              {/* Expandable Micronutrient Note & Ingredient breakdown */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#3e6b56]/10 text-[#414944] space-y-2">
                  <div className="bg-[#e5f8ea] p-2.5 rounded-xl text-xs space-y-1 shadow-[inset_0_1px_2px_rgba(32,48,39,0.06)]">
                    <div className="flex justify-between items-center font-semibold text-[#25533f]">
                      <span>🌿 Micronutrient Spotlight:</span>
                      <span className="text-[11px]">Fiber {meal.fiber || 6}g</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#414944]">
                      {meal.botanicalNotes || 'Balanced bioavailable micronutrient profile nourishing microbiome health.'}
                    </p>
                  </div>

                  {/* Ingredients list if present */}
                  {meal.ingredients && meal.ingredients.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#717973] block">
                        Ingredients Detected:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {meal.ingredients.map((ing) => (
                          <span
                            key={ing.id}
                            className="px-2 py-0.5 rounded-lg bg-white text-[11px] border border-[#d4e7d9] text-[#0f1f16]"
                          >
                            {ing.name} ({ing.weight}{ing.unit})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onDeleteMeal(meal.id)}
                      className="text-xs text-[#ba1a1a] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      Remove Entry
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {/* Dinner Pending Card */}
        <article className="bg-[#e5f8ea]/70 rounded-2xl p-4 shadow-[inset_0_2px_4px_rgba(32,48,39,0.06),0_1px_0_rgba(255,255,255,0.9)] border border-dashed border-[#3e6b56]/25 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#99462a] animate-pulse"></span>
              <span className="font-headline text-base text-[#0f1f16] font-semibold">Evening Ritual</span>
            </div>
            <span className="text-xs font-semibold text-[#414944]">Dinner</span>
          </div>

          <div className="bg-[#ffffff] p-3 rounded-xl shadow-[inset_0_1px_2px_rgba(32,48,39,0.04)] flex items-start gap-2.5">
            <span className="text-base leading-none">💡</span>
            <p className="text-xs text-[#414944] leading-relaxed">
              <strong className="text-[#0f1f16]">Smart Target:</strong> Aim for{' '}
              <span className="text-[#25533f] font-bold">
                {calRemaining > 0 ? `${calRemaining - 100}–${calRemaining} kcal` : '450–550 kcal'}
              </span>{' '}
              with at least{' '}
              <span className="text-[#99462a] font-bold">
                {Math.max(15, userGoals.dailyProtein - totalProtein)}g protein
              </span>{' '}
              to complete your daily macros cleanly.
            </p>
          </div>

          <button
            onClick={() => onOpenScanner()}
            className="w-full py-3 rounded-xl bg-gradient-to-b from-[#fe9572] to-[#99462a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(153,70,42,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            <span>Record Dinner with AI Scanner</span>
          </button>
        </article>
      </section>

      {/* 4. TACTILE SUGGESTION PARCHMENT WITH RIBBON BOOKMARK */}
      <section className="relative bg-[#ffffff] rounded-2xl p-4 shadow-[0_8px_24px_-4px_rgba(32,48,39,0.1),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 overflow-hidden">
        {/* Crimson Ribbon Bookmark Detail */}
        <div className="absolute top-0 right-6 w-5 h-8 bg-[#99462a] shadow-[0_2px_4px_rgba(0,0,0,0.25)] flex items-end justify-center pb-1">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[6px] border-b-[#ffffff] absolute -bottom-1"></div>
        </div>

        <div className="flex items-center justify-between mb-1 pr-8">
          <div className="flex items-center gap-1.5 text-[#25533f]">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span className="text-[11px] uppercase tracking-wider font-bold">
              Parchment Kitchen Suggestion
            </span>
          </div>
          <button
            onClick={handleFetchNewSuggestion}
            title="Refresh Suggestion"
            disabled={isLoadingSuggestion}
            className="text-xs text-[#25533f] font-semibold hover:underline flex items-center gap-0.5"
          >
            <span className={`material-symbols-outlined text-[14px] ${isLoadingSuggestion ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
        </div>

        <h3 className="font-headline text-lg text-[#0f1f16] font-semibold pr-8">
          {kitchenSuggestion.title}
        </h3>
        <p className="text-xs text-[#414944] mt-1 leading-relaxed">
          {kitchenSuggestion.description}
        </p>

        {/* Nutrition breakdown pill row */}
        <div className="flex items-center gap-2.5 my-3">
          <div className="px-2.5 py-1 rounded-full bg-[#e5f8ea] text-xs font-semibold text-[#0f1f16] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
            {kitchenSuggestion.calories} kcal
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#e5f8ea] text-xs font-bold text-[#99462a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
            {kitchenSuggestion.protein}g Protein
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#e5f8ea] text-xs font-bold text-[#25533f] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
            {kitchenSuggestion.fiber}g Fiber
          </div>
        </div>

        {/* One-Tap Action Button */}
        <button
          onClick={handleApplySuggestion}
          disabled={suggestionAdded}
          className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
            suggestionAdded
              ? 'bg-[#3e6b56] text-white shadow-inner cursor-default'
              : 'bg-[#25533f] text-white shadow-[0_4px_8px_rgba(37,83,63,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] active:translate-y-0.5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {suggestionAdded ? 'done' : 'bookmark_add'}
          </span>
          <span>{suggestionAdded ? "Added to Today's Journal ✓" : 'One-Tap Add to Plan'}</span>
        </button>
      </section>

      {/* 5. ARCHIVE EXPORT ACTION */}
      <section className="pt-1 pb-4">
        <button
          onClick={() => setShowExportModal(true)}
          className="w-full py-3 rounded-2xl bg-[#e5f8ea] text-[#25533f] font-semibold text-xs flex items-center justify-center gap-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(32,48,39,0.06)] active:scale-[0.98] transition-all border border-[#3e6b56]/20"
        >
          <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
          <span>Download Daily Physical PDF Report</span>
        </button>
        <p className="text-center text-xs text-[#717973] mt-2 font-serif italic">
          Encrypted log • NutriBloom Archival Volume VI
        </p>
      </section>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#3e6b56]/20 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#d4e7d9]">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <h3 className="font-headline text-lg font-bold text-[#0f1f16]">Daily Physical Report</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-7 h-7 rounded-full bg-[#e5f8ea] flex items-center justify-center text-[#414944]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="bg-[#ebfef0] p-4 rounded-xl space-y-2 text-xs border border-[#3e6b56]/20 font-mono">
              <div className="flex justify-between font-bold text-[#25533f]">
                <span>NUTRIBLOOM ARCHIVAL REPORT</span>
                <span>{dateFormatted}</span>
              </div>
              <div className="border-b border-[#3e6b56]/15 my-1"></div>
              <div className="flex justify-between">
                <span>Total Energy:</span>
                <span className="font-bold">{totalCalories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span>Macronutrients:</span>
                <span>P: {totalProtein}g | C: {totalCarbs}g | F: {totalFat}g</span>
              </div>
              <div className="flex justify-between">
                <span>Fiber &amp; Sodium:</span>
                <span>{totalFiber}g fiber | {totalSodium}mg Na</span>
              </div>
              <div className="flex justify-between">
                <span>Plates Logged:</span>
                <span>{meals.length} entries verified</span>
              </div>
              <div className="border-b border-[#3e6b56]/15 my-1"></div>
              <div className="text-[11px] text-[#414944]">
                Signed: Dr. Elena Vance, Botanical Clinical Nutritionist.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-full bg-[#25533f] text-white text-xs font-bold shadow-sm"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="py-2.5 px-4 rounded-full bg-[#e5f8ea] text-[#414944] text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
