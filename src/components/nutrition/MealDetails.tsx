import React from 'react';
import { Apple, Clock } from 'lucide-react';
import { Meal } from '../../types/nutrition';

interface MealDetailsProps {
  meal: Meal;
}

export default function MealDetails({ meal }: MealDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
          {meal.description && (
            <p className="text-gray-600 mt-1">{meal.description}</p>
          )}
        </div>
        <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
          {meal.mealType}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {meal.calories && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Apple className="w-4 h-4" />
              <p className="text-sm">Calories</p>
            </div>
            <p className="font-medium">{meal.calories} kcal</p>
          </div>
        )}
        {meal.protein && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Protein</p>
            <p className="font-medium">{meal.protein}g</p>
          </div>
        )}
        {meal.carbs && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Carbs</p>
            <p className="font-medium">{meal.carbs}g</p>
          </div>
        )}
        {meal.fats && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Fats</p>
            <p className="font-medium">{meal.fats}g</p>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        Scheduled for {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][meal.dayOfWeek]}
      </div>
    </div>
  );
}