import React from 'react';
import { Calendar, Clock, Apple, X } from 'lucide-react';
import { NutritionPlan } from '../../types/nutrition';
import { useUserStore } from '../../store/users';

interface NutritionPlanDetailsProps {
  plan: NutritionPlan;
  onClose: () => void;
}

export default function NutritionPlanDetails({ plan, onClose }: NutritionPlanDetailsProps) {
  const { users } = useUserStore();
  const assignedAthlete = plan.athleteId ? users.find(user => user.id === plan.athleteId) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
              <p className="text-gray-600 mt-1">{plan.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(plan.startDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {plan.weeks} weeks
            </div>
            {assignedAthlete && (
              <div className="flex items-center gap-1">
                Assigned to: {assignedAthlete.username}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {plan.mealSchedule.map((week) => (
            <div key={week.weekNumber} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Week {week.weekNumber}
              </h3>
              <div className="grid gap-4">
                {week.meals.map((meal, index) => (
                  <div
                    key={`${week.weekNumber}-${index}`}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{meal.name}</h4>
                        <p className="text-sm text-gray-600">{meal.description}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][meal.dayOfWeek]} - {meal.mealType}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        meal.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {meal.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 bg-gray-50 rounded-lg p-3">
                      {meal.calories && (
                        <div>
                          <p className="text-sm text-gray-500">Calories</p>
                          <p className="font-medium">{meal.calories} kcal</p>
                        </div>
                      )}
                      {meal.protein && (
                        <div>
                          <p className="text-sm text-gray-500">Protein</p>
                          <p className="font-medium">{meal.protein}g</p>
                        </div>
                      )}
                      {meal.carbs && (
                        <div>
                          <p className="text-sm text-gray-500">Carbs</p>
                          <p className="font-medium">{meal.carbs}g</p>
                        </div>
                      )}
                      {meal.fats && (
                        <div>
                          <p className="text-sm text-gray-500">Fats</p>
                          <p className="font-medium">{meal.fats}g</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}