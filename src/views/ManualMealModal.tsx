import React, { useState } from 'react';
import { Meal } from '../types/nutrition';

interface ManualMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeal: (meal: Meal) => void;
  defaultMealType?: 'breakfast' | 'lunch' | 'snack' | 'dinner';
}

export const ManualMealModal: React.FC<ManualMealModalProps> = ({
  isOpen,
  onClose,
  onSaveMeal,
  defaultMealType = 'lunch',
}) => {
  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>(defaultMealType);
  const [calories, setCalories] = useState(450);
  const [protein, setProtein] = useState(25);
  const [carbs, setCarbs] = useState(45);
  const [fat, setFat] = useState(14);
  const [dietaryTagsInput, setDietaryTagsInput] = useState('High Protein, Whole Food');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const newMeal: Meal = {
      id: `manual-${Date.now()}`,
      title: title.trim(),
      mealType,
      time: timeStr,
      timestamp: Date.now(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      fiber: 6,
      sodium: 400,
      dietaryTags: dietaryTagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      botanicalNotes: 'Hand-logged balanced plate nourishing cellular vibrancy.',
      ingredients: [],
    };

    onSaveMeal(newMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-[#3e6b56]/20 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#d4e7d9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#25533f]">edit_note</span>
            <h3 className="font-headline text-base font-bold text-[#0f1f16]">Manual Meal Entry</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#e5f8ea] flex items-center justify-center text-[#414944]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Meal Title</label>
            <input
              type="text"
              placeholder="e.g. Garden Quinoa Salad with Walnuts"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-medium border border-[#3e6b56]/20 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Meal Slot</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-medium border border-[#3e6b56]/20 focus:outline-none"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snack">Afternoon Snack</option>
              <option value="dinner">Evening Dinner</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Calories (kcal)</label>
              <input
                type="number"
                min="0"
                max="3000"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-bold border border-[#3e6b56]/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Protein (g)</label>
              <input
                type="number"
                min="0"
                max="200"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-bold border border-[#3e6b56]/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Carbs (g)</label>
              <input
                type="number"
                min="0"
                max="300"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-bold border border-[#3e6b56]/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Fats (g)</label>
              <input
                type="number"
                min="0"
                max="150"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-bold border border-[#3e6b56]/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Gluten-Free, Organic"
              value={dietaryTagsInput}
              onChange={(e) => setDietaryTagsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-medium border border-[#3e6b56]/20 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#e5f8ea] text-[#414944] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#25533f] text-white text-xs font-bold shadow-sm"
            >
              Save Meal (+10 Nectar)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
