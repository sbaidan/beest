import React, { useState } from 'react';
import { Plus, X, Apple } from 'lucide-react';
import { NutritionPlan, Meal } from '../../types/nutrition';

interface MealScheduleEditorProps {
  plan: NutritionPlan;
  onSave: (mealSchedule: NutritionPlan['mealSchedule']) => void;
  onClose: () => void;
}

export default function MealScheduleEditor({ plan, onSave, onClose }: MealScheduleEditorProps) {
  const [schedule, setSchedule] = useState(plan.mealSchedule);

  const addMeal = (weekNumber: number) => {
    const newSchedule = [...schedule];
    const weekIndex = newSchedule.findIndex(w => w.weekNumber === weekNumber);
    
    if (weekIndex === -1) {
      newSchedule.push({
        weekNumber,
        meals: [{
          id: crypto.randomUUID(),
          nutritionPlanId: plan.id,
          weekNumber,
          dayOfWeek: 0,
          mealType: 'breakfast',
          name: '',
          completed: false
        }]
      });
    } else {
      newSchedule[weekIndex].meals.push({
        id: crypto.randomUUID(),
        nutritionPlanId: plan.id,
        weekNumber,
        dayOfWeek: 0,
        mealType: 'breakfast',
        name: '',
        completed: false
      });
    }
    
    setSchedule(newSchedule);
  };

  const updateMeal = (weekNumber: number, mealIndex: number, updates: Partial<Meal>) => {
    const newSchedule = [...schedule];
    const weekIndex = newSchedule.findIndex(w => w.weekNumber === weekNumber);
    if (weekIndex !== -1) {
      newSchedule[weekIndex].meals[mealIndex] = {
        ...newSchedule[weekIndex].meals[mealIndex],
        ...updates
      };
      setSchedule(newSchedule);
    }
  };

  const removeMeal = (weekNumber: number, mealIndex: number) => {
    const newSchedule = [...schedule];
    const weekIndex = newSchedule.findIndex(w => w.weekNumber === weekNumber);
    if (weekIndex !== -1) {
      newSchedule[weekIndex].meals.splice(mealIndex, 1);
      if (newSchedule[weekIndex].meals.length === 0) {
        newSchedule.splice(weekIndex, 1);
      }
      setSchedule(newSchedule);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Edit Meal Schedule</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {Array.from({ length: plan.weeks }, (_, i) => i + 1).map((weekNumber) => {
            const week = schedule.find(w => w.weekNumber === weekNumber);
            
            return (
              <div key={weekNumber} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Week {weekNumber}</h3>
                  <button
                    onClick={() => addMeal(weekNumber)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Meal
                  </button>
                </div>

                <div className="space-y-4">
                  {week?.meals.map((meal, mealIndex) => (
                    <div key={meal.id} className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={meal.name}
                            onChange={(e) => updateMeal(weekNumber, mealIndex, { name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Meal name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Day
                          </label>
                          <select
                            value={meal.dayOfWeek}
                            onChange={(e) => updateMeal(weekNumber, mealIndex, { dayOfWeek: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                              <option key={i} value={i}>{day}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={meal.mealType}
                            onChange={(e) => updateMeal(weekNumber, mealIndex, { mealType: e.target.value as Meal['mealType'] })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Calories
                          </label>
                          <input
                            type="number"
                            value={meal.calories || ''}
                            onChange={(e) => updateMeal(weekNumber, mealIndex, { calories: parseInt(e.target.value) || undefined })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="kcal"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeMeal(weekNumber, mealIndex)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  {(!week || week.meals.length === 0) && (
                    <button
                      onClick={() => addMeal(weekNumber)}
                      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      <Apple className="w-5 h-5 mx-auto mb-1" />
                      Add your first meal for Week {weekNumber}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(schedule)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}