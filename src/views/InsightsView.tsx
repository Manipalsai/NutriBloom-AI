import React, { useState } from 'react';
import { Meal } from '../types/nutrition';

interface InsightsViewProps {
  onPrelogMeal: (meal: Meal) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onPrelogMeal }) => {
  const [activePeriod, setActivePeriod] = useState<'Day' | 'Week' | 'Month' | '90 Days'>('Week');
  const [selectedDayFeedback, setSelectedDayFeedback] = useState<{
    day: string;
    harmony: string;
    detail: string;
  }>({
    day: '6 of 7 Bloom Milestones Complete',
    harmony: 'High Balance',
    detail: 'Tap any bar to inspect daily rhythm',
  });

  const [preloggedBfast, setPreloggedBfast] = useState(false);
  const [preloggedLunch, setPreloggedLunch] = useState(false);
  const [healthSync, setHealthSync] = useState(true);
  const [exporting, setExporting] = useState(false);

  const daysData = [
    { day: 'M', height: '84%', cals: '2,080 kcal', protein: '98g Protein', star: '★' },
    { day: 'T', height: '92%', cals: '2,110 kcal', protein: '104g Protein', star: '★' },
    { day: 'W', height: '78%', cals: '1,990 kcal', protein: '92g Protein', star: '★' },
    { day: 'T', height: '88%', cals: '2,050 kcal', protein: '110g Protein', star: '★' },
    { day: 'F', height: '94%', cals: '2,140 kcal', protein: '101g Protein', star: '★' },
    { day: 'S', height: '80%', cals: '1,960 kcal', protein: '89g Protein', star: '★' },
    { day: 'Sun', height: '65%', cals: '1,480 kcal logged', protein: '92g Protein', active: true },
  ];

  const handleInspectDay = (dayName: string, cals: string, prot: string) => {
    setSelectedDayFeedback({
      day: `${dayName} Vitality Rhythm`,
      harmony: '96% Harmony Index',
      detail: `${cals} · ${prot}`,
    });
  };

  const handlePrelog = (which: 'bfast' | 'lunch') => {
    if (which === 'bfast') {
      setPreloggedBfast(true);
      onPrelogMeal({
        id: `prelog-bfast-${Date.now()}`,
        title: 'Spinach, Feta & Tomato Omelet',
        mealType: 'breakfast',
        time: '8:00 AM (Tomorrow)',
        timestamp: Date.now() + 24 * 3600 * 1000,
        calories: 380,
        protein: 28,
        carbs: 6,
        fat: 26,
        fiber: 5,
        sodium: 420,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
        aiVerified: true,
        dietaryTags: ['High Protein', 'Keto Friendly', 'Restores Iron'],
        botanicalNotes: 'Dark leafy greens paired with vitamin C restores iron synthesis.',
        ingredients: [],
      });
    } else {
      setPreloggedLunch(true);
      onPrelogMeal({
        id: `prelog-lunch-${Date.now()}`,
        title: 'Warm Lemon Herb Chickpea Bowl',
        mealType: 'lunch',
        time: '12:30 PM (Tomorrow)',
        timestamp: Date.now() + 28 * 3600 * 1000,
        calories: 520,
        protein: 22,
        carbs: 68,
        fat: 16,
        fiber: 14,
        sodium: 480,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        aiVerified: true,
        dietaryTags: ['Vegan', 'High Fiber', 'Gut Prebiotic'],
        botanicalNotes: 'Soluble legume fiber sustains balanced microbial fermentation.',
        ingredients: [],
      });
    }
  };

  const handleSimulateExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      window.print();
    }, 900);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 space-y-5 pt-2">
      {/* Segmented Tactile Period Switch */}
      <div className="w-full pt-1">
        <div className="relative bg-[#e5f8ea] p-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(32,48,39,0.08),0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-between gap-1 border border-[#3e6b56]/15">
          {(['Day', 'Week', 'Month', '90 Days'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`flex-1 py-1.5 text-center rounded-full text-xs font-semibold transition-all ${
                activePeriod === period
                  ? 'bg-[#25533f] text-white shadow-[0_3px_8px_rgba(37,83,63,0.32),inset_0_1px_0_rgba(255,255,255,0.35)]'
                  : 'text-[#414944] hover:text-[#0f1f16]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Summary Scorecard (Embossed Parchment) */}
      <div className="relative rounded-2xl bg-[#ffffff] p-4 shadow-[0_12px_24px_-4px_rgba(32,48,39,0.08),0_4px_12px_-2px_rgba(32,48,39,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15">
        {/* Top Score Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#25533f]">
                Digestive &amp; Vital Harmony
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3e6b56]"></span>
            </div>
            <h2 className="font-headline text-lg text-[#0f1f16] font-semibold">
              Weekly Balance Index
            </h2>
          </div>

          {/* Score Medallion */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#daeddf] shadow-[inset_0_1px_2px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.85)] border border-[#3e6b56]/10">
            <span className="font-headline text-2xl leading-none text-[#25533f] font-bold">
              94
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#414944] leading-none font-bold">/100</span>
              <span className="text-[10px] text-[#855900] font-bold mt-0.5">⭐ +6%</span>
            </div>
          </div>
        </div>

        {/* Debossed Metric Wells Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Calories Well */}
          <div className="p-2.5 rounded-xl bg-[#e5f8ea] shadow-[inset_0_2px_4px_rgba(32,48,39,0.06),0_1px_0_rgba(255,255,255,0.9)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#414944] font-bold uppercase">Calories</span>
              <span className="material-symbols-outlined text-[#99462a] text-[16px]">local_fire_department</span>
            </div>
            <div>
              <span className="font-headline text-base text-[#0f1f16] font-bold block leading-tight">2,040</span>
              <span className="text-[10px] text-[#414944] block mt-0.5">Goal 2.1k</span>
            </div>
            <div className="mt-2 w-full h-1.5 rounded-full bg-[#d4e7d9] overflow-hidden">
              <div className="h-full rounded-full bg-[#fe9572]" style={{ width: '97%' }}></div>
            </div>
          </div>

          {/* Hydration Well */}
          <div className="p-2.5 rounded-xl bg-[#e5f8ea] shadow-[inset_0_2px_4px_rgba(32,48,39,0.06),0_1px_0_rgba(255,255,255,0.9)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#414944] font-bold uppercase">Hydration</span>
              <span className="material-symbols-outlined text-[#855900] text-[16px]">water_drop</span>
            </div>
            <div>
              <span className="font-headline text-base text-[#0f1f16] font-bold block leading-tight">2.7L</span>
              <span className="text-[10px] text-[#414944] block mt-0.5">Goal 2.8L</span>
            </div>
            <div className="mt-2 w-full h-1.5 rounded-full bg-[#d4e7d9] overflow-hidden">
              <div className="h-full rounded-full bg-[#f9bc59]" style={{ width: '96%' }}></div>
            </div>
          </div>

          {/* AI Logs Well */}
          <div className="p-2.5 rounded-xl bg-[#e5f8ea] shadow-[inset_0_2px_4px_rgba(32,48,39,0.06),0_1px_0_rgba(255,255,255,0.9)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#414944] font-bold uppercase">AI Logs</span>
              <span className="material-symbols-outlined text-[#25533f] text-[16px]">document_scanner</span>
            </div>
            <div>
              <span className="font-headline text-base text-[#0f1f16] font-bold block leading-tight">21</span>
              <span className="text-[10px] text-[#414944] block mt-0.5">3 / day</span>
            </div>
            <div className="mt-2 w-full h-1.5 rounded-full bg-[#d4e7d9] overflow-hidden">
              <div className="h-full rounded-full bg-[#25533f]" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeuomorphic Grooved Chart Container */}
      <div className="rounded-2xl bg-[#ffffff] p-4 shadow-[0_12px_24px_-4px_rgba(32,48,39,0.08),0_4px_12px_-2px_rgba(32,48,39,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <h3 className="font-headline text-base text-[#0f1f16] font-semibold">Weekly Rhythm &amp; Load</h3>
            <p className="text-xs text-[#414944]">Protein, Hydration &amp; Caloric consistency</p>
          </div>

          {/* Legend Pill */}
          <div className="flex items-center gap-2 bg-[#daeddf] px-2.5 py-1 rounded-full shadow-[inset_0_1px_1px_rgba(32,48,39,0.06)]">
            <span className="w-2 h-2 rounded-full bg-[#25533f]" title="Protein"></span>
            <span className="w-2 h-2 rounded-full bg-[#f9bc59]" title="Water"></span>
            <span className="w-2 h-2 rounded-full bg-[#fe9572]" title="Calories"></span>
          </div>
        </div>

        {/* Debossed Groove Canvas */}
        <div className="relative rounded-xl bg-[#e5f8ea] p-3 shadow-[inset_0_2px_6px_rgba(32,48,39,0.08),0_1px_0_rgba(255,255,255,0.9)] overflow-hidden">
          {/* Faint Journal Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between py-3 pointer-events-none opacity-40 px-3">
            <div className="w-full h-px bg-[#d4e7d9]"></div>
            <div className="w-full h-px bg-[#d4e7d9]"></div>
            <div className="w-full h-px bg-[#d4e7d9]"></div>
            <div className="w-full h-px bg-[#d4e7d9]"></div>
          </div>

          {/* 7 Day Column Bar Chart */}
          <div className="relative z-10 grid grid-cols-7 gap-1.5 h-44 items-end pt-4 pb-1">
            {daysData.map((col, idx) => (
              <div
                key={idx}
                onClick={() => handleInspectDay(col.day, col.cals, col.protein)}
                className="flex flex-col items-center h-full justify-end group cursor-pointer active:scale-95 transition-transform"
              >
                <span className={`text-[10px] leading-none mb-1 ${col.active ? 'text-[#855900] animate-pulse' : 'text-[#25533f]'}`}>
                  {col.active ? '●' : '★'}
                </span>

                <div
                  className={`w-3.5 rounded-full flex flex-col justify-end gap-0.5 ${
                    col.active ? 'opacity-90 ring-1 ring-[#25533f]' : ''
                  }`}
                  style={{ height: col.height }}
                >
                  <div className="w-full h-[32%] rounded-t-full bg-[#fe9572] shadow-sm"></div>
                  <div className="w-full h-[40%] bg-[#f9bc59] shadow-sm"></div>
                  <div className="w-full h-[28%] rounded-b-full bg-[#25533f] shadow-sm"></div>
                </div>

                <span
                  className={`text-[11px] font-bold mt-1.5 ${
                    col.active ? 'text-[#25533f]' : 'text-[#414944]'
                  }`}
                >
                  {col.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Tap Feedback Strip */}
        <div className="mt-3 px-3 py-2 rounded-xl bg-[#e0f3e5] flex items-center justify-between text-[#0f1f16] border border-[#3e6b56]/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#25533f] text-[18px]">verified</span>
            <span className="text-xs font-semibold">{selectedDayFeedback.day}</span>
          </div>
          <span className="text-xs text-[#414944]">{selectedDayFeedback.detail}</span>
        </div>
      </div>

      {/* AI Nutrition Intelligence & Habit Trends */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#25533f] text-[20px]">psychology</span>
            <h3 className="font-headline text-base text-[#0f1f16] font-semibold">Intelligence &amp; Patterns</h3>
          </div>
          <span className="text-xs text-[#414944]">Archived Weekly</span>
        </div>

        {/* Insight Card 1: Protein Timing */}
        <div className="p-4 rounded-2xl bg-[#ffffff] shadow-[0_6px_16px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#daeddf] flex items-center justify-center text-[#855900]">
              <span className="material-symbols-outlined text-[16px]">lightbulb</span>
            </div>
            <span className="text-xs font-bold text-[#0f1f16]">Protein Timing Insight</span>
          </div>
          <p className="text-xs text-[#414944] pl-9 leading-relaxed">
            You consistently hit peak afternoon energy on days when you consume at least{' '}
            <strong className="text-[#0f1f16]">30g protein before 12:00 PM</strong>.
          </p>
        </div>

        {/* Insight Card 2: Hydration Rhythm */}
        <div className="p-4 rounded-2xl bg-[#ffffff] shadow-[0_6px_16px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#daeddf] flex items-center justify-center text-[#25533f]">
              <span className="material-symbols-outlined text-[16px]">water_drop</span>
            </div>
            <span className="text-xs font-bold text-[#0f1f16]">Hydration Curve</span>
          </div>
          <p className="text-xs text-[#414944] pl-9 leading-relaxed">
            Your water intake peaks between 10 AM and 2 PM, but dips sharply after 6 PM. Consider introducing a calming{' '}
            <strong className="text-[#0f1f16]">herbal tea evening ritual</strong>.
          </p>
        </div>

        {/* Insight Card 3: Micronutrients */}
        <div className="p-4 rounded-2xl bg-[#ffffff] shadow-[0_6px_16px_-2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#daeddf] flex items-center justify-center text-[#99462a]">
              <span className="material-symbols-outlined text-[16px]">local_florist</span>
            </div>
            <span className="text-xs font-bold text-[#0f1f16]">Micronutrient Diversity</span>
          </div>
          <p className="text-xs text-[#414944] pl-9 leading-relaxed">
            High levels of Vitamin C &amp; Magnesium sustained all week; slightly low on Iron. Adding{' '}
            <strong className="text-[#0f1f16]">steamed spinach or warm lentils</strong> tomorrow will restore balance.
          </p>
        </div>
      </div>

      {/* Personalized AI Meal Suggestions for Tomorrow */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#25533f] text-[20px]">restaurant_menu</span>
            <h3 className="font-headline text-base text-[#0f1f16] font-semibold">Tomorrow's Adaptive Menu</h3>
          </div>
          <span className="text-xs text-[#25533f] font-bold">AI Tailored</span>
        </div>

        {/* Suggestion 1: Breakfast Omelet */}
        <div className="rounded-2xl bg-[#ffffff] p-3.5 shadow-[0_8px_20px_-4px_rgba(32,48,39,0.07),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 flex gap-3 items-center">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#e0f3e5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
            <img
              alt="Spinach, Feta & Tomato Omelet"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-[#99462a] font-bold uppercase tracking-wider block">
              Breakfast Target
            </span>
            <h4 className="text-sm font-semibold text-[#0f1f16] truncate">
              Spinach, Feta &amp; Tomato Omelet
            </h4>
            <p className="text-xs text-[#414944] mt-0.5">380 kcal · 28g P · Restores Iron</p>
            <div className="mt-2">
              <button
                onClick={() => handlePrelog('bfast')}
                disabled={preloggedBfast}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  preloggedBfast
                    ? 'bg-[#25533f] text-white shadow-inner'
                    : 'bg-[#e0f3e5] text-[#25533f] shadow-sm active:scale-95'
                }`}
              >
                {preloggedBfast ? '✓ Pre-logged' : '+ Pre-log'}
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion 2: Mediterranean Chickpea Bowl */}
        <div className="rounded-2xl bg-[#ffffff] p-3.5 shadow-[0_8px_20px_-4px_rgba(32,48,39,0.07),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 flex gap-3 items-center">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#e0f3e5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
            <img
              alt="Warm Lemon Herb Chickpea Bowl"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-[#25533f] font-bold uppercase tracking-wider block">
              Lunch Target
            </span>
            <h4 className="text-sm font-semibold text-[#0f1f16] truncate">
              Warm Lemon Herb Chickpea Bowl
            </h4>
            <p className="text-xs text-[#414944] mt-0.5">520 kcal · 22g P · High Fiber</p>
            <div className="mt-2">
              <button
                onClick={() => handlePrelog('lunch')}
                disabled={preloggedLunch}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  preloggedLunch
                    ? 'bg-[#25533f] text-white shadow-inner'
                    : 'bg-[#e0f3e5] text-[#25533f] shadow-sm active:scale-95'
                }`}
              >
                {preloggedLunch ? '✓ Pre-logged' : '+ Pre-log'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Export & App Sync Section */}
      <div className="rounded-2xl bg-[#ffffff] p-4 shadow-[0_12px_24px_-4px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] border border-[#3e6b56]/15 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#daeddf] flex items-center justify-center text-[#25533f]">
              <span className="material-symbols-outlined text-[18px]">sync_saved_locally</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0f1f16]">Data Bridges &amp; Export</h4>
              <p className="text-xs text-[#414944]">Continuous two-way vital synchronization</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#e0f3e5] text-[#25533f] text-[10px] font-bold">
            Live
          </span>
        </div>

        {/* Action Buttons Stack */}
        <div className="flex flex-col gap-2">
          {/* Apple Health & Google Fit Button */}
          <button
            onClick={() => setHealthSync(!healthSync)}
            className="w-full py-3 px-4 rounded-xl bg-[#e5f8ea] shadow-[0_3px_8px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] flex items-center justify-between active:translate-y-0.5 border border-[#3e6b56]/10 text-xs font-semibold"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#99462a] text-[20px]">vital_signs</span>
              <span className="text-[#0f1f16]">Apple Health &amp; Google Fit</span>
            </div>
            <div className="flex items-center gap-1 text-[#25533f]">
              <span>{healthSync ? 'Synced' : 'Disabled'}</span>
              <span className="material-symbols-outlined text-[16px]">
                {healthSync ? 'check_circle' : 'cancel'}
              </span>
            </div>
          </button>

          {/* Dietitian Summary Export */}
          <button
            onClick={handleSimulateExport}
            disabled={exporting}
            className="w-full py-3 px-4 rounded-xl bg-[#25533f] text-white shadow-[0_6px_14px_rgba(37,83,63,0.3),inset_0_1px_0_rgba(255,255,255,0.35)] flex items-center justify-between active:translate-y-0.5 text-xs font-bold"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">description</span>
              <span>{exporting ? 'Generating Report...' : 'Export Dietitian Summary (PDF)'}</span>
            </div>
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
