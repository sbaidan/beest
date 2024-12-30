import { useWorkoutStore } from '../store/workouts';
import { useUserStore } from '../store/users';

export async function getDefaultTrainingPlan(coachId: string) {
  const workouts = useWorkoutStore.getState().workouts;
  const userStore = useUserStore.getState();
  
  // Ensure users are loaded
  if (userStore.users.length === 0) {
    await userStore.fetchUsers();
  }
  
  // Get the first available athlete
  const defaultAthlete = userStore.users.find(user => user.role === 'athlete');
  
  if (!defaultAthlete) {
    console.warn('No athletes found in the system');
  }

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 1); // Start tomorrow

  return {
    name: "8-Week Strength Building Program",
    description: "Progressive overload program focusing on compound movements and functional strength",
    weeks: 8,
    startDate: startDate.toISOString().split('T')[0],
    coachId: coachId,
    athleteId: defaultAthlete?.id || '', // Use actual athlete ID if available
    workoutSchedule: Array.from({ length: 8 }, (_, weekIndex) => ({
      weekNumber: weekIndex + 1,
      workouts: [
        {
          workoutId: workouts[0]?.id || '',
          dayOfWeek: 1, // Monday
          completed: false
        },
        {
          workoutId: workouts[1]?.id || '',
          dayOfWeek: 3, // Wednesday
          completed: false
        }
      ]
    }))
  };
}