import { create } from 'zustand';
import { TrainingPlan } from '../types';
import { supabase, fetchWithRetry } from '../lib/supabase';

interface TrainingPlanStore {
  plans: TrainingPlan[];
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  addPlan: (plan: Omit<TrainingPlan, 'id'>) => Promise<void>;
  updatePlan: (id: string, updates: Partial<TrainingPlan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  duplicatePlan: (id: string) => Promise<void>;
  getAthleteActivePlan: (athleteId: string) => TrainingPlan | undefined;
  updateWorkoutStatus: (planId: string, weekNumber: number, workoutId: string, completed: boolean) => Promise<void>;
}

export const useTrainingPlanStore = create<TrainingPlanStore>((set, get) => ({
  plans: [],
  loading: false,
  error: null,

  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await fetchWithRetry(async () => 
        supabase
          .from('training_plans')
          .select('*, workout_schedule(*)')
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
        workoutSchedule: plan.workout_schedule.reduce((acc: any[], workout: any) => {
          const weekIndex = acc.findIndex(w => w.weekNumber === workout.week_number);
          const workoutData = {
            workoutId: workout.workout_id,
            dayOfWeek: workout.day_of_week,
            completed: workout.completed,
            completedAt: workout.completed_at
          };

          if (weekIndex === -1) {
            acc.push({
              weekNumber: workout.week_number,
              workouts: [workoutData]
            });
          } else {
            acc[weekIndex].workouts.push(workoutData);
          }
          return acc;
        }, [])
      }));

      set({ plans, loading: false });
    } catch (error) {
      console.error('Error fetching plans:', error);
      set({ error: error.message, loading: false });
    }
  },

  addPlan: async (plan) => {
    set({ loading: true, error: null });
    try {
      const { data: newPlan, error: planError } = await supabase
        .from('training_plans')
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

      if (plan.workoutSchedule.length > 0) {
        const scheduleData = plan.workoutSchedule.flatMap(week => 
          week.workouts.map(workout => ({
            training_plan_id: newPlan.id,
            week_number: week.weekNumber,
            workout_id: workout.workoutId,
            day_of_week: workout.dayOfWeek,
            completed: false
          }))
        );

        const { error: scheduleError } = await supabase
          .from('workout_schedule')
          .insert(scheduleData);

        if (scheduleError) throw scheduleError;
      }

      await get().fetchPlans();
    } catch (error) {
      console.error('Error adding plan:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePlan: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('training_plans')
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
        .from('training_plans')
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
        workoutSchedule: originalPlan.workoutSchedule.map(week => ({
          ...week,
          workouts: week.workouts.map(workout => ({
            ...workout,
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

  updateWorkoutStatus: async (planId, weekNumber, workoutId, completed) => {
    try {
      const { error } = await supabase
        .from('workout_schedule')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('training_plan_id', planId)
        .eq('week_number', weekNumber)
        .eq('workout_id', workoutId);

      if (error) throw error;
      await get().fetchPlans();
    } catch (error) {
      console.error('Error updating workout status:', error);
      throw error;
    }
  }
}));