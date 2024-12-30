import { create } from 'zustand';
import { NutritionPlan } from '../types/nutrition';
import { supabase, fetchWithRetry } from '../lib/supabase';

interface NutritionPlanStore {
  plans: NutritionPlan[];
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  addPlan: (plan: Omit<NutritionPlan, 'id'>) => Promise<void>;
  updatePlan: (id: string, updates: Partial<NutritionPlan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  duplicatePlan: (id: string) => Promise<void>;
  getAthleteActivePlan: (athleteId: string) => NutritionPlan | undefined;
  updateMealStatus: (planId: string, weekNumber: number, mealId: string, completed: boolean) => Promise<void>;
}

export const useNutritionPlanStore = create<NutritionPlanStore>((set, get) => ({
  plans: [],
  loading: false,
  error: null,

  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await fetchWithRetry(async () => 
        supabase
          .from('nutrition_plans')
          .select('*, meal_schedule(*)')
          .order('created_at', { ascending: false })
      );

      if (error) throw error;

      const plans = data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        weeks: plan.weeks,
        startDate: plan.start_date,
        coachId: plan.coach_id,
        athleteId: plan.athlete_id,
        mealSchedule: plan.meal_schedule.reduce((acc: any[], meal: any) => {
          const weekIndex = acc.findIndex(w => w.weekNumber === meal.week_number);
          const mealData = {
            id: meal.id,
            nutritionPlanId: meal.nutrition_plan_id,
            weekNumber: meal.week_number,
            dayOfWeek: meal.day_of_week,
            mealType: meal.meal_type,
            name: meal.name,
            description: meal.description,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fats,
            completed: meal.completed,
            completedAt: meal.completed_at
          };

          if (weekIndex === -1) {
            acc.push({
              weekNumber: meal.week_number,
              meals: [mealData]
            });
          } else {
            acc[weekIndex].meals.push(mealData);
          }
          return acc;
        }, [])
      }));

      set({ plans, loading: false });
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
      set({ error: error.message, loading: false });
    }
  },

  addPlan: async (plan) => {
    set({ loading: true, error: null });
    try {
      const { data: newPlan, error: planError } = await supabase
        .from('nutrition_plans')
        .insert({
          name: plan.name,
          description: plan.description,
          weeks: plan.weeks,
          start_date: plan.startDate,
          coach_id: plan.coachId,
          athlete_id: plan.athleteId || null
        })
        .select()
        .single();

      if (planError) throw planError;

      if (plan.mealSchedule.length > 0) {
        const mealData = plan.mealSchedule.flatMap(week => 
          week.meals.map(meal => ({
            nutrition_plan_id: newPlan.id,
            week_number: week.weekNumber,
            day_of_week: meal.dayOfWeek,
            meal_type: meal.mealType,
            name: meal.name,
            description: meal.description,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fats,
            completed: false
          }))
        );

        const { error: mealError } = await supabase
          .from('meal_schedule')
          .insert(mealData);

        if (mealError) throw mealError;
      }

      await get().fetchPlans();
    } catch (error) {
      console.error('Error adding nutrition plan:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePlan: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('nutrition_plans')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await get().fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  },

  deletePlan: async (id) => {
    try {
      const { error } = await supabase
        .from('nutrition_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        plans: state.plans.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  },

  duplicatePlan: async (id) => {
    set({ loading: true, error: null });
    try {
      const originalPlan = get().plans.find(p => p.id === id);
      if (!originalPlan) throw new Error('Plan not found');

      await get().addPlan({
        ...originalPlan,
        name: `${originalPlan.name} (Copy)`,
        athleteId: null,
        mealSchedule: originalPlan.mealSchedule.map(week => ({
          ...week,
          meals: week.meals.map(meal => ({
            ...meal,
            completed: false,
            completedAt: null
          }))
        }))
      });

      set({ loading: false });
    } catch (error) {
      console.error('Error duplicating plan:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getAthleteActivePlan: (athleteId) => {
    return get().plans.find(p => p.athleteId === athleteId);
  },

  updateMealStatus: async (planId, weekNumber, mealId, completed) => {
    try {
      const { error } = await supabase
        .from('meal_schedule')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('nutrition_plan_id', planId)
        .eq('week_number', weekNumber)
        .eq('id', mealId);

      if (error) throw error;
      await get().fetchPlans();
    } catch (error) {
      console.error('Error updating meal status:', error);
      throw error;
    }
  }
}));