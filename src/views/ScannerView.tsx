import React, { useState, useRef } from 'react';
import { Ingredient, Meal } from '../types/nutrition';
import { PRESET_SCAN_DISHES } from '../data/initialData';
import { analyzeFoodImage } from '../services/api';

interface ScannerViewProps {
  onMealLogged: (meal: Meal, nectarReward: number) => void;
  onCancel: () => void;
  onOpenManualEntry: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onMealLogged,
  onCancel,
  onOpenManualEntry,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const currentPreset = PRESET_SCAN_DISHES[selectedPresetIndex];

  const [dishPhoto, setDishPhoto] = useState<string>(currentPreset.image);
  const [dishName, setDishName] = useState<string>(currentPreset.name);
  const [confidence, setConfidence] = useState<number>(97);
  const [dietaryTags, setDietaryTags] = useState<string[]>(currentPreset.dietaryTags);
  const [botanicalNotes, setBotanicalNotes] = useState<string>(currentPreset.notes);
  const [ingredients, setIngredients] = useState<Ingredient[]>(currentPreset.items);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingMessage, setAnalyzingMessage] = useState('Vision Engine 4.2');
  const [isLogged, setIsLogged] = useState(false);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientWeight, setNewIngredientWeight] = useState(50);
  const [newIngredientCategory, setNewIngredientCategory] = useState<'protein' | 'carb' | 'vegetable' | 'fat' | 'sauce'>('vegetable');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Recalculate totals dynamically based on current ingredient weights and factors
  const totalCalories = ingredients.reduce((sum, item) => sum + Math.round(item.weight * item.unitCals), 0);
  const totalProtein = ingredients.reduce((sum, item) => sum + Math.round(item.weight * item.pFactor), 0);
  const totalCarbs = ingredients.reduce((sum, item) => sum + Math.round(item.weight * item.cFactor), 0);
  const totalFat = ingredients.reduce((sum, item) => sum + Math.round(item.weight * item.fFactor), 0);

  // Adjust portion weights
  const adjustWeight = (id: string, delta: number) => {
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newWeight = Math.max(0, item.weight + delta);
          return {
            ...item,
            weight: newWeight,
            calories: Math.round(newWeight * item.unitCals),
            protein: Math.round(newWeight * item.pFactor),
            carbs: Math.round(newWeight * item.cFactor),
            fat: Math.round(newWeight * item.fFactor),
          };
        }
        return item;
      })
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  // Add custom ingredient
  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;

    let unitCals = 1.0;
    let pFactor = 0.05;
    let cFactor = 0.15;
    let fFactor = 0.02;

    if (newIngredientCategory === 'protein') {
      unitCals = 1.8;
      pFactor = 0.25;
      cFactor = 0.0;
      fFactor = 0.05;
    } else if (newIngredientCategory === 'carb') {
      unitCals = 1.3;
      pFactor = 0.04;
      cFactor = 0.28;
      fFactor = 0.01;
    } else if (newIngredientCategory === 'fat' || newIngredientCategory === 'sauce') {
      unitCals = 6.0;
      pFactor = 0.0;
      cFactor = 0.05;
      fFactor = 0.65;
    } else {
      unitCals = 0.4;
      pFactor = 0.02;
      cFactor = 0.08;
      fFactor = 0.005;
    }

    const newItem: Ingredient = {
      id: `custom-${Date.now()}`,
      name: newIngredientName.trim(),
      weight: newIngredientWeight,
      unit: newIngredientCategory === 'sauce' ? 'ml' : 'g',
      calories: Math.round(newIngredientWeight * unitCals),
      protein: Math.round(newIngredientWeight * pFactor),
      carbs: Math.round(newIngredientWeight * cFactor),
      fat: Math.round(newIngredientWeight * fFactor),
      confidence: 94,
      approxMeasure: `${newIngredientWeight} ${newIngredientCategory === 'sauce' ? 'ml' : 'g'} added`,
      category: newIngredientCategory,
      unitCals,
      pFactor,
      cFactor,
      fFactor,
      pinX: 50,
      pinY: 50,
    };

    setIngredients((prev) => [...prev, newItem]);
    setNewIngredientName('');
    setShowAddIngredientModal(false);
  };

  // File upload / Camera capture analysis
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setDishPhoto(base64);
      analyzePhoto(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async (base64: string) => {
    setIsAnalyzing(true);
    setAnalyzingMessage('Analyzing Plate with Gemini 3.8...');
    try {
      const result = await analyzeFoodImage(base64);
      if (result.success && result.data) {
        setDishName(result.data.dishName);
        setConfidence(result.data.confidence || 96);
        setDietaryTags(result.data.dietaryTags || ['Whole Food', 'High Protein']);
        setBotanicalNotes(result.data.botanicalHarmonyNotes || 'Balanced bioavailable macro blend.');
        if (result.data.detectedItems && result.data.detectedItems.length > 0) {
          setIngredients(result.data.detectedItems as Ingredient[]);
        }
      }
    } catch (err) {
      console.warn('API analysis fallback:', err);
    } finally {
      setIsAnalyzing(false);
      setAnalyzingMessage('Vision Engine 4.2');
    }
  };

  // Switch between presets for instant preview
  const handleSwitchPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    const p = PRESET_SCAN_DISHES[idx];
    setDishPhoto(p.image);
    setDishName(p.name);
    setConfidence(97);
    setDietaryTags(p.dietaryTags);
    setBotanicalNotes(p.notes);
    setIngredients(p.items);
  };

  // Live Camera Stream
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert('Camera access unavailable or declined. Please select a photo from your gallery.');
      setIsCameraActive(false);
    }
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setDishPhoto(dataUrl);
      stopCamera();
      analyzePhoto(dataUrl);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Confirm & Log Meal
  const handleConfirmAndLog = () => {
    setIsLogged(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

      let mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner' = 'dinner';
      const hours = now.getHours();
      if (hours < 11) mealType = 'breakfast';
      else if (hours < 15) mealType = 'lunch';
      else if (hours < 18) mealType = 'snack';

      const newMeal: Meal = {
        id: `meal-${Date.now()}`,
        title: dishName,
        mealType,
        time: timeStr,
        timestamp: Date.now(),
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        fiber: 7,
        sodium: 480,
        image: dishPhoto,
        aiVerified: true,
        confidence,
        dietaryTags,
        botanicalNotes,
        ingredients,
      };

      onMealLogged(newMeal, 15);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 space-y-5 pt-2">
      {/* Hidden File Input for Gallery / Camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preset Quick Chooser Strip */}
      <div className="flex items-center justify-between bg-[#ffffff] p-2 rounded-2xl shadow-[0_4px_12px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-[#3e6b56]/15">
        <span className="text-[11px] font-bold text-[#414944] px-2 uppercase tracking-wider">
          Demo Dishes:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {PRESET_SCAN_DISHES.map((dish, i) => (
            <button
              key={i}
              onClick={() => handleSwitchPreset(i)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPresetIndex === i
                  ? 'bg-[#25533f] text-white shadow-sm'
                  : 'bg-[#e5f8ea] text-[#25533f] hover:bg-[#d4e7d9]'
              }`}
            >
              {i === 0 ? 'Herb Chicken' : i === 1 ? 'Wild Salmon' : 'Avocado Toast'}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Viewfinder & Food Review Canvas */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-[#e0f3e5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_20px_-4px_rgba(32,48,39,0.12)] border border-[#3e6b56]/15">
        {/* Camera Viewport Box */}
        <div className="relative w-full aspect-[4/3] bg-[#d4e7d9] overflow-hidden select-none">
          {isCameraActive ? (
            <div className="relative w-full h-full bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-4 z-30">
                <button
                  onClick={captureCameraFrame}
                  className="px-5 py-2.5 rounded-full bg-white text-[#25533f] font-bold text-xs shadow-lg flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">camera</span>
                  Snap Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2.5 rounded-full bg-black/60 text-white font-semibold text-xs shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <img
              alt="Scanned dish plate"
              className="w-full h-full object-cover"
              src={dishPhoto}
            />
          )}

          {/* Optical Glass Coating Gradient & Flare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3e6b56]/15 via-transparent to-[#ffffff]/30 pointer-events-none"></div>
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/20 blur-xl pointer-events-none"></div>

          {/* Live Analysis HUD Reticle Overlay */}
          <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-6 h-6 border-t-2 border-l-2 border-white/90 rounded-tl"></div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f1f16]/75 text-white backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#bceed3] animate-ping"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">
                  {analyzingMessage}
                </span>
              </div>
              <div className="w-6 h-6 border-t-2 border-r-2 border-white/90 rounded-tr"></div>
            </div>
            <div className="flex justify-between items-end">
              <div className="w-6 h-6 border-b-2 border-l-2 border-white/90 rounded-bl"></div>
              <div className="w-6 h-6 border-b-2 border-r-2 border-white/90 rounded-br"></div>
            </div>
          </div>

          {/* Tactile Dynamic AI Detection Overlays (Pins) */}
          {ingredients.slice(0, 4).map((item, idx) => (
            <div
              key={item.id}
              style={{
                top: `${item.pinY || 25 + idx * 22}%`,
                left: `${item.pinX || 30 + (idx % 2) * 35}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform active:scale-95 z-20"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/95 text-[#0f1f16] shadow-[0_4px_10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-md border border-[#3e6b56]/20">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{
                    color:
                      item.category === 'protein'
                        ? '#25533f'
                        : item.category === 'carb'
                        ? '#99462a'
                        : item.category === 'vegetable'
                        ? '#25533f'
                        : '#855900',
                  }}
                >
                  {item.category === 'protein'
                    ? 'restaurant'
                    : item.category === 'vegetable'
                    ? 'spa'
                    : item.category === 'fat'
                    ? 'water_drop'
                    : 'eco'}
                </span>
                <span className="text-[11px] font-semibold">
                  {item.name} ({item.weight}
                  {item.unit})
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#bceed3] text-[#002114] text-[9px] font-bold">
                  {item.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Viewfinder Bottom Toolbar */}
        <div className="px-4 py-2 bg-[#e5f8ea] flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] border-t border-[#3e6b56]/10">
          <div className="flex items-center gap-1 text-[#414944]">
            <span className="material-symbols-outlined text-[18px] text-[#25533f]">verified</span>
            <span className="text-[11px] font-bold uppercase tracking-wide">Plated Dish Identified</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#d4e7d9] text-[#0f1f16] text-xs font-semibold shadow-[0_1px_2px_rgba(32,48,39,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] active:translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Upload / Scan</span>
            </button>
            <button
              onClick={startCamera}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#25533f] text-white text-xs font-semibold shadow-sm active:translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>Live Lens</span>
            </button>
          </div>
        </div>
      </section>

      {/* Total Nutrition Dimensional Ledger Card */}
      <section className="rounded-2xl bg-[#ffffff] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_6px_16px_-2px_rgba(32,48,39,0.08)] border border-[#3e6b56]/15 flex flex-col space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#414944]">
              Estimated Meal Energy
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-headline text-3xl text-[#0f1f16] font-bold leading-none">
                {totalCalories}
              </span>
              <span className="font-headline text-base text-[#414944]">kcal</span>
            </div>
          </div>

          {/* Tactile Wax-Style Confidence Stamp */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5f8ea] text-[#25533f] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_6px_rgba(32,48,39,0.08)] border border-[#3e6b56]/15">
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] uppercase tracking-wider text-[#414944] font-bold">Confidence</span>
              <span className="text-xs font-bold text-[#25533f]">High ({confidence}%)</span>
            </div>
          </div>
        </div>

        {/* Macro Breakdown Inset Debossed Bed */}
        <div className="grid grid-cols-3 gap-2.5 p-2 rounded-xl bg-[#daeddf] shadow-[inset_0_2px_4px_rgba(32,48,39,0.07),inset_0_-1px_1px_rgba(255,255,255,0.9)]">
          {/* Protein Pill Well */}
          <div className="flex flex-col items-center py-2 px-1 rounded-lg bg-[#ffffff]/80 shadow-[0_1px_2px_rgba(32,48,39,0.04)]">
            <span className="text-xs text-[#414944] font-semibold">Protein</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="font-headline text-lg text-[#25533f] font-bold">{totalProtein}</span>
              <span className="text-[10px] text-[#414944]">g</span>
            </div>
            <div className="w-12 h-1.5 rounded-full bg-[#d4e7d9] mt-1 overflow-hidden">
              <div
                className="h-full bg-[#25533f] rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalProtein / 60) * 100))}%` }}
              ></div>
            </div>
          </div>

          {/* Carbs Pill Well */}
          <div className="flex flex-col items-center py-2 px-1 rounded-lg bg-[#ffffff]/80 shadow-[0_1px_2px_rgba(32,48,39,0.04)]">
            <span className="text-xs text-[#414944] font-semibold">Carbs</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="font-headline text-lg text-[#855900] font-bold">{totalCarbs}</span>
              <span className="text-[10px] text-[#414944]">g</span>
            </div>
            <div className="w-12 h-1.5 rounded-full bg-[#d4e7d9] mt-1 overflow-hidden">
              <div
                className="h-full bg-[#f9bc59] rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalCarbs / 60) * 100))}%` }}
              ></div>
            </div>
          </div>

          {/* Fat Pill Well */}
          <div className="flex flex-col items-center py-2 px-1 rounded-lg bg-[#ffffff]/80 shadow-[0_1px_2px_rgba(32,48,39,0.04)]">
            <span className="text-xs text-[#414944] font-semibold">Fat</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="font-headline text-lg text-[#99462a] font-bold">{totalFat}</span>
              <span className="text-[10px] text-[#414944]">g</span>
            </div>
            <div className="w-12 h-1.5 rounded-full bg-[#d4e7d9] mt-1 overflow-hidden">
              <div
                className="h-full bg-[#fe9572] rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalFat / 30) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Curated Lifestyle Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {dietaryTags.map((tag, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e5f8ea] text-[#0f1f16] shadow-[0_1px_2px_rgba(32,48,39,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[#25533f] text-[14px]">check_circle</span>
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ingredient Detection & Portion Stepper Section */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#25533f] text-[20px]">tune</span>
            <h2 className="font-headline text-base text-[#0f1f16] font-semibold">Adjust Portions</h2>
          </div>
          <span className="text-xs text-[#414944]">Tap +/- to calibrate weight</span>
        </div>

        {/* Ingredient Card Stack */}
        <div className="flex flex-col space-y-2.5">
          {ingredients.map((item) => (
            <article
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#ffffff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(32,48,39,0.06)] border border-[#3e6b56]/15 flex flex-col space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#e0f3e5] overflow-hidden shadow-[inset_0_1px_2px_rgba(32,48,39,0.15)] flex-shrink-0 flex items-center justify-center text-[#25533f]">
                    <span className="material-symbols-outlined text-[22px]">
                      {item.category === 'protein'
                        ? 'restaurant'
                        : item.category === 'carb'
                        ? 'grain'
                        : item.category === 'vegetable'
                        ? 'eco'
                        : item.category === 'fat'
                        ? 'water_drop'
                        : 'soup_kitchen'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-[#0f1f16]">{item.name}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#bceed3] text-[#002114] text-[9px] font-bold">
                        {item.confidence}%
                      </span>
                    </div>
                    <span className="text-xs text-[#414944] mt-0.5">
                      {Math.round(item.weight * item.unitCals)} kcal • P{' '}
                      {Math.round(item.weight * item.pFactor)}g • C{' '}
                      {Math.round(item.weight * item.cFactor)}g • F{' '}
                      {Math.round(item.weight * item.fFactor)}g
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeIngredient(item.id)}
                  aria-label="Remove Ingredient"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#414944] hover:text-[#ba1a1a] bg-[#e5f8ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              {/* Tactile Stepper Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustWeight(item.id, item.unit === 'ml' ? -2 : -15)}
                    className="w-9 h-9 rounded-full bg-[#e5f8ea] text-[#0f1f16] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(32,48,39,0.08)] active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>

                  <div className="px-3 py-1.5 rounded-xl bg-[#daeddf] shadow-[inset_0_2px_4px_rgba(32,48,39,0.1)] flex items-baseline gap-1 min-w-[70px] justify-center">
                    <span className="font-headline text-base text-[#0f1f16] font-semibold">
                      {item.weight}
                    </span>
                    <span className="text-xs text-[#414944]">{item.unit}</span>
                  </div>

                  <button
                    onClick={() => adjustWeight(item.id, item.unit === 'ml' ? 2 : 15)}
                    className="w-9 h-9 rounded-full bg-[#e5f8ea] text-[#0f1f16] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(32,48,39,0.08)] active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>

                <span className="text-xs text-[#717973] font-medium">{item.approxMeasure}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Tactile Recessed Add Ingredient Action */}
        <button
          onClick={() => setShowAddIngredientModal(true)}
          className="w-full py-3 px-4 rounded-2xl bg-[#e5f8ea] text-[#25533f] flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(32,48,39,0.05)] active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.1)] active:translate-y-0.5 transition-all font-semibold text-xs border border-[#3e6b56]/20"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Add Missing Ingredient or Sauce</span>
        </button>
      </section>

      {/* Botanical Delight Reward Banner */}
      <section className="p-4 rounded-2xl bg-[#daeddf] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(32,48,39,0.06)] border border-[#3e6b56]/15 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-[#ffddb0] flex items-center justify-center text-[#855900] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_6px_rgba(133,89,0,0.2)] flex-shrink-0">
          <span className="material-symbols-outlined text-[24px]">psychiatry</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#0f1f16]">Whole Food Harmony</span>
            <span className="text-[10px] uppercase font-bold text-[#855900] tracking-wider">+15 NECTAR</span>
          </div>
          <p className="text-xs text-[#414944] mt-0.5 leading-relaxed">
            {botanicalNotes}
          </p>
        </div>
      </section>

      {/* Bottom Tactile Controls */}
      <section className="pt-2 flex flex-col space-y-2.5">
        {/* Master Raised Botanical Sage Pill Button */}
        <button
          onClick={handleConfirmAndLog}
          disabled={isLogged}
          className={`w-full py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all ${
            isLogged
              ? 'bg-gradient-to-b from-[#fe9572] to-[#99462a] text-white'
              : 'bg-gradient-to-b from-[#3e6b56] to-[#25533f] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_rgba(37,83,63,0.35)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)] active:translate-y-1'
          }`}
        >
          {isLogged ? (
            <>
              <span className="material-symbols-outlined text-[22px] animate-spin">eco</span>
              <span className="text-sm font-semibold tracking-wide">
                Nurturing Garden... Meal Logged!
              </span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
              <span className="text-sm font-semibold tracking-wide">
                Confirm &amp; Log Meal (+15 Garden Nectar)
              </span>
            </>
          )}
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-full bg-[#ffffff] text-[#0f1f16] flex items-center justify-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_5px_rgba(32,48,39,0.06)] active:translate-y-0.5 border border-[#3e6b56]/15 text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            <span>Retake Photo</span>
          </button>
          <button
            onClick={onOpenManualEntry}
            className="w-full py-3 rounded-full bg-[#ffffff] text-[#0f1f16] flex items-center justify-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_5px_rgba(32,48,39,0.06)] active:translate-y-0.5 border border-[#3e6b56]/15 text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Manual Entry</span>
          </button>
        </div>
      </section>

      {/* Modal: Add Missing Ingredient */}
      {showAddIngredientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl border border-[#3e6b56]/20">
            <h3 className="font-headline text-base text-[#0f1f16] font-semibold mb-3">
              Add Ingredient or Sauce
            </h3>
            <form onSubmit={handleAddIngredient} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Ingredient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Avocado oil, Pumpkin seeds"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-medium border border-[#3e6b56]/20 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Weight / Amount</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={newIngredientWeight}
                    onChange={(e) => setNewIngredientWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-medium border border-[#3e6b56]/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0f1f16] block mb-1">Category</label>
                  <select
                    value={newIngredientCategory}
                    onChange={(e) => setNewIngredientCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#e5f8ea] text-[#0f1f16] text-xs font-medium border border-[#3e6b56]/20 focus:outline-none"
                  >
                    <option value="vegetable">Vegetable / Green</option>
                    <option value="protein">Protein</option>
                    <option value="carb">Grain / Carb</option>
                    <option value="fat">Healthy Fat</option>
                    <option value="sauce">Dressing / Sauce</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddIngredientModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[#e5f8ea] text-[#414944] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#25533f] text-white text-xs font-bold shadow-sm"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
