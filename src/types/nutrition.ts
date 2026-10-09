export interface Ingredient {
  id: string;
  name: string;
  weight: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  approxMeasure: string;
  category: 'protein' | 'carb' | 'vegetable' | 'fat' | 'sauce' | 'fruit' | 'dairy';
  pinX?: number;
  pinY?: number;
  unitCals: number;
  pFactor: number;
  cFactor: number;
  fFactor: number;
  image?: string;
}

export interface Meal {
  id: string;
  title: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  time: string;
  timestamp: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  image?: string;
  aiVerified?: boolean;
  confidence?: number;
  dietaryTags?: string[];
  botanicalNotes?: string;
  ingredients: Ingredient[];
}

export interface WaterLog {
  id: string;
  amount: number; // in ml
  type: 'Pure Spring Water' | 'Herbal & Chamomile' | 'Electrolyte Citrus' | 'Custom';
  label: string;
  time: string;
  timestamp: number;
}

export interface GardenPlant {
  id: string;
  name: string;
  species: string;
  stage: number;
  maxStage: number;
  health: number; // 0 to 100
  image: string;
  streakDays: number;
  metricType: 'streak' | 'hydration' | 'protein' | 'mindfulness';
  metricLabel: string;
  description: string;
  isLocked?: boolean;
  unlockCondition?: string;
  currentProgress?: number;
  targetProgress?: number;
}

export interface DailyGoal {
  id: string;
  title: string;
  subtitle: string;
  target: number;
  current: number;
  unit: string;
  xp: number;
  completed: boolean;
  type: 'water' | 'protein' | 'veggies' | 'mindful';
}

export interface UserGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyWaterMl: number;
}

export interface Badge {
  id: string;
  title: string;
  subtitle: string;
  unlocked: boolean;
  progressText?: string;
  progressPercent?: number;
  icon: string;
  type: 'brass' | 'ceramic' | 'silver' | 'gold';
}
