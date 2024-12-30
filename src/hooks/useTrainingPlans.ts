import { useEffect } from 'react';
import { useTrainingPlanStore } from '../store/trainingPlans';
import { useAuthStore } from '../store/auth';

export function useTrainingPlans() {
  const { profile } = useAuthStore();
  const { plans, loading, error, fetchPlans } = useTrainingPlanStore();

  useEffect(() => {
    if (profile) {
      fetchPlans();
    }
  }, [profile?.id]);

  // Filter plans based on user role and ID
  const filteredPlans = profile ? plans.filter(plan => {
    if (profile.role === 'coach') {
      return plan.coachId === profile.id;
    } else {
      return plan.athleteId === profile.id;
    }
  }) : [];

  return { plans: filteredPlans, loading, error };
}