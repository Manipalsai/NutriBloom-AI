export interface FoodAnalysisResponse {
  success: boolean;
  data: {
    dishName: string;
    confidence: number;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    fiber?: number;
    sodium?: number;
    dietaryTags: string[];
    botanicalHarmonyNotes: string;
    nectarEarned?: number;
    detectedItems: Array<{
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
      category: string;
      pinX?: number;
      pinY?: number;
      unitCals: number;
      pFactor: number;
      cFactor: number;
      fFactor: number;
    }>;
  };
  fallbackUsed?: boolean;
}

export interface MealSuggestionResponse {
  success: boolean;
  suggestion: {
    recipeName: string;
    subtitle?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    prepTime?: string;
    botanicalReason: string;
    ingredients?: string[];
  };
}

export async function analyzeFoodImage(
  imageBase64: string,
  dishHint?: string
): Promise<FoodAnalysisResponse> {
  const response = await fetch('/api/analyze-food', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      dishHint,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(err.error || 'Failed to analyze food image');
  }

  return response.json();
}

export async function getMealSuggestion(params: {
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs: number;
  remainingFat: number;
  mealType?: string;
}): Promise<MealSuggestionResponse> {
  const response = await fetch('/api/suggest-meal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Suggestion failed' }));
    throw new Error(err.error || 'Failed to get meal suggestion');
  }

  return response.json();
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export async function sendChatMessage(
  messages: Array<{ role: 'user' | 'model'; content: string }>,
  userContext: any
): Promise<{ success: boolean; reply: string }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      userContext,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Chat failed' }));
    throw new Error(err.error || 'Failed to communicate with Sage AI');
  }

  return response.json();
}
