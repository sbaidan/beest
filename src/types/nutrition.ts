export interface Meal {
  id: string;
  nutritionPlanId: string;
  weekNumber: number;
  dayOfWeek: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  completed: boolean;
  completedAt?: string | null;
}

export interface NutritionPlan {
  id: string;
  name: string;
  description?: string;
  weeks: number;
  startDate: string;
  coachId: string;
  athleteId?: string;
  mealSchedule: {
    weekNumber: number;
    meals: Meal[];
  }[];
}