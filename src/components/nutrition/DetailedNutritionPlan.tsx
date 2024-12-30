import React, { useState } from 'react';
import { Clock, Apple } from 'lucide-react';
import { NutritionPlan } from '../../types/nutrition';
import { useNutritionPlanStore } from '../../store/nutritionPlans';
import MealStatusToggle from './MealStatusToggle';
import MealDetails from './MealDetails';

interface DetailedNutritionPlanProps {
  plan: NutritionPlan;
  selectedWeek?: number;
  searchTerm: string;
  filters: {
    status: string;
    type: string;
  };
}

export default function DetailedNutritionPlan({
  plan,
  selectedWeek,
  searchTerm,
  filters
}: DetailedNutritionPlanProps) {
  const [updatingMeal, setUpdatingMeal] = useState<string | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const { updateMealStatus } = useNutritionPlanStore();

  const filteredSchedule = plan.mealSchedule
    .filter(week => !selectedWeek || week.weekNumber === selectedWeek)
    .map(week => ({
      ...week,
      meals: week.meals.filter(meal => {
        const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filters.type || meal.mealType === filters.type;
        const matchesStatus = !filters.status || 
          (filters.status === 'completed' ? meal.completed : !meal.completed);

        return matchesSearch && matchesType && matchesStatus;
      })
    }));

  const handleStatusChange = async (weekNumber: number, mealId: string, completed: boolean) => {
    const key = `${weekNumber}-${mealId}`;
    setUpdatingMeal(key);
    try {
      await updateMealStatus(plan.id, weekNumber, mealId, completed);
    } catch (error) {
      console.error('Failed to update meal status:', error);
    } finally {
      setUpdatingMeal(null);
    }
  };

  return (
    <div className="space-y-6">
      {filteredSchedule.map((week) => (
        <div key={week.weekNumber} className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Week {week.weekNumber}</h3>
          </div>

          <div className="p-4 space-y-4">
            {week.meals.map((meal) => {
              const isExpanded = expandedMeal === `${week.weekNumber}-${meal.id}`;

              return (
                <div
                  key={`${week.weekNumber}-${meal.id}`}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <div className="flex-1">
                      <button
                        onClick={() => setExpandedMeal(isExpanded ? null : `${week.weekNumber}-${meal.id}`)}
                        className="text-left"
                      >
                        <h4 className="font-medium text-gray-900">{meal.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][meal.dayOfWeek]}
                          </span>
                          <span className="capitalize">{meal.mealType}</span>
                          {meal.calories && (
                            <span className="flex items-center gap-1">
                              <Apple className="w-4 h-4" />
                              {meal.calories} kcal
                            </span>
                          )}
                        </div>
                      </button>
                    </div>

                    <MealStatusToggle
                      completed={meal.completed}
                      completedAt={meal.completedAt}
                      loading={updatingMeal === `${week.weekNumber}-${meal.id}`}
                      onChange={() => handleStatusChange(
                        week.weekNumber,
                        meal.id,
                        !meal.completed
                      )}
                    />
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-gray-200">
                      <MealDetails meal={meal} />
                    </div>
                  )}
                </div>
              );
            })}

            {week.meals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No meals found for this week
              </div>
            )}
          </div>
        </div>
      ))}

      {filteredSchedule.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No meals found matching your criteria
        </div>
      )}
    </div>
  );
}