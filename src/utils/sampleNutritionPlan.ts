import { useUserStore } from '../store/users';

export async function getDefaultNutritionPlan(coachId: string) {
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
    name: "8-Week Nutrition Plan",
    description: "Balanced nutrition plan with focus on whole foods and proper macronutrient distribution",
    weeks: 8,
    startDate: startDate.toISOString().split('T')[0],
    coachId: coachId,
    athleteId: defaultAthlete?.id || '',
    mealSchedule: Array.from({ length: 8 }, (_, weekIndex) => ({
      weekNumber: weekIndex + 1,
      meals: [
        {
          id: crypto.randomUUID(),
          nutritionPlanId: '',
          weekNumber: weekIndex + 1,
          dayOfWeek: 1,
          mealType: 'breakfast',
          name: 'Protein Oatmeal',
          description: 'Oatmeal with protein powder and fruits',
          calories: 400,
          protein: 30,
          carbs: 50,
          fats: 10,
          completed: false
        },
        {
          id: crypto.randomUUID(),
          nutritionPlanId: '',
          weekNumber: weekIndex + 1,
          dayOfWeek: 1,
          mealType: 'lunch',
          name: 'Chicken Salad',
          description: 'Grilled chicken breast with mixed greens',
          calories: 500,
          protein: 40,
          carbs: 30,
          fats: 20,
          completed: false
        }
      ]
    }))
  };
}