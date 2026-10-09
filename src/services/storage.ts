import { Meal, WaterLog, GardenPlant, DailyGoal, UserGoals, Badge } from '../types/nutrition';
import {
  INITIAL_MEALS,
  INITIAL_WATER_LOGS,
  INITIAL_PLANTS,
  INITIAL_DAILY_GOALS,
  INITIAL_USER_GOALS,
  INITIAL_BADGES,
} from '../data/initialData';

const STORAGE_KEYS = {
  MEALS: 'nutribloom_meals_v1',
  WATER: 'nutribloom_water_v1',
  PLANTS: 'nutribloom_plants_v1',
  GOALS: 'nutribloom_goals_v1',
  USER_GOALS: 'nutribloom_user_goals_v1',
  BADGES: 'nutribloom_badges_v1',
  RESERVES: 'nutribloom_reserves_v1',
  STREAK: 'nutribloom_streak_v1',
};

export interface GardenReserves {
  waterDrops: number;
  sunNectar: number;
  oasisLevel: number;
}

const DEFAULT_RESERVES: GardenReserves = {
  waterDrops: 450,
  sunNectar: 120,
  oasisLevel: 8,
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Storage save error for key ${key}:`, e);
  }
}

export const StorageService = {
  getMeals(): Meal[] {
    return safeGet<Meal[]>(STORAGE_KEYS.MEALS, INITIAL_MEALS);
  },
  saveMeals(meals: Meal[]): void {
    safeSet(STORAGE_KEYS.MEALS, meals);
  },
  addMeal(meal: Meal): Meal[] {
    const existing = this.getMeals();
    const updated = [meal, ...existing];
    this.saveMeals(updated);
    return updated;
  },
  deleteMeal(id: string): Meal[] {
    const existing = this.getMeals();
    const updated = existing.filter((m) => m.id !== id);
    this.saveMeals(updated);
    return updated;
  },

  getWaterLogs(): WaterLog[] {
    return safeGet<WaterLog[]>(STORAGE_KEYS.WATER, INITIAL_WATER_LOGS);
  },
  saveWaterLogs(logs: WaterLog[]): void {
    safeSet(STORAGE_KEYS.WATER, logs);
  },
  addWaterLog(log: WaterLog): WaterLog[] {
    const existing = this.getWaterLogs();
    const updated = [log, ...existing];
    this.saveWaterLogs(updated);
    return updated;
  },
  removeLastWaterLog(): WaterLog[] {
    const existing = this.getWaterLogs();
    if (existing.length === 0) return existing;
    const updated = existing.slice(1);
    this.saveWaterLogs(updated);
    return updated;
  },

  getPlants(): GardenPlant[] {
    return safeGet<GardenPlant[]>(STORAGE_KEYS.PLANTS, INITIAL_PLANTS);
  },
  savePlants(plants: GardenPlant[]): void {
    safeSet(STORAGE_KEYS.PLANTS, plants);
  },

  getDailyGoals(): DailyGoal[] {
    return safeGet<DailyGoal[]>(STORAGE_KEYS.GOALS, INITIAL_DAILY_GOALS);
  },
  saveDailyGoals(goals: DailyGoal[]): void {
    safeSet(STORAGE_KEYS.GOALS, goals);
  },

  getUserGoals(): UserGoals {
    return safeGet<UserGoals>(STORAGE_KEYS.USER_GOALS, INITIAL_USER_GOALS);
  },
  saveUserGoals(goals: UserGoals): void {
    safeSet(STORAGE_KEYS.USER_GOALS, goals);
  },

  getBadges(): Badge[] {
    return safeGet<Badge[]>(STORAGE_KEYS.BADGES, INITIAL_BADGES);
  },
  saveBadges(badges: Badge[]): void {
    safeSet(STORAGE_KEYS.BADGES, badges);
  },

  getReserves(): GardenReserves {
    return safeGet<GardenReserves>(STORAGE_KEYS.RESERVES, DEFAULT_RESERVES);
  },
  saveReserves(reserves: GardenReserves): void {
    safeSet(STORAGE_KEYS.RESERVES, reserves);
  },

  getStreak(): number {
    return safeGet<number>(STORAGE_KEYS.STREAK, 12);
  },
  saveStreak(streak: number): void {
    safeSet(STORAGE_KEYS.STREAK, streak);
  },

  resetToDefaults(): void {
    try {
      localStorage.clear();
    } catch {}
  },
};
