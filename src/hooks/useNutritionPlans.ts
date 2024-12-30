import { useEffect } from 'react';
import { useNutritionPlanStore } from '../store/nutritionPlans';
import { useAuthStore } from '../store/auth';

export function useNutritionPlans() {
  const { profile } = useAuthStore();
  const { plans, loading, error, fetchPlans, addPlan } = useNutritionPlanStore();

  useEffect(() => {
    if (profile) {
      fetchPlans();
    }
  }, [profile?.id]);

  // Filter plans based on user role and ID
  const filteredPlans = profile ? plans.filter(plan => 
    profile.role === 'coach' 
      ? plan.coachId === profile.id 
      : plan.athleteId === profile.id
  ) : [];

  return { plans: filteredPlans, loading, error, addPlan };
}