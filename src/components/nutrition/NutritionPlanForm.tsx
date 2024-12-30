import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { NutritionPlan } from '../../types/nutrition';
import { useAuthStore } from '../../store/auth';
import AthleteSearch from '../training/AthleteSearch';
import MealScheduleEditor from './MealScheduleEditor';
import { getDefaultNutritionPlan } from '../../utils/sampleNutritionPlan';

interface NutritionPlanFormProps {
  onClose: () => void;
  onSubmit: (plan: Omit<NutritionPlan, 'id'>) => Promise<void>;
  plan?: NutritionPlan;
}

export default function NutritionPlanForm({ onClose, onSubmit, plan }: NutritionPlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weeks, setWeeks] = useState(plan?.weeks || 4);
  const [selectedAthlete, setSelectedAthlete] = useState(plan?.athleteId || '');
  const [mealSchedule, setMealSchedule] = useState(plan?.mealSchedule || []);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  
  const profile = useAuthStore(state => state.profile);

  useEffect(() => {
    if (!plan && profile) {
      getDefaultNutritionPlan(profile.id).then(defaultPlan => {
        setMealSchedule(defaultPlan.mealSchedule);
      });
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const newPlan = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        weeks,
        startDate: formData.get('startDate') as string,
        coachId: profile.id,
        athleteId: selectedAthlete || null,
        mealSchedule
      };

      await onSubmit(newPlan);
    } catch (error) {
      console.error('Error submitting plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {plan ? 'Edit Nutrition Plan' : 'Create New Nutrition Plan'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={plan?.name}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={plan?.description}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weeks" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Weeks
              </label>
              <input
                type="number"
                id="weeks"
                name="weeks"
                min="1"
                max="52"
                value={weeks}
                onChange={(e) => setWeeks(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                defaultValue={plan?.startDate}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="athlete" className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Athlete
            </label>
            <AthleteSearch
              value={selectedAthlete}
              onChange={setSelectedAthlete}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Meal Schedule
              </label>
              <button
                type="button"
                onClick={() => setShowScheduleEditor(true)}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {mealSchedule.some(w => w.meals.length > 0) ? 'Edit Schedule' : 'Add Meals'}
              </button>
            </div>
            
            {mealSchedule.some(w => w.meals.length > 0) ? (
              <div className="border border-gray-200 rounded-lg p-4">
                {mealSchedule.map((week) => (
                  <div key={week.weekNumber} className="mb-4 last:mb-0">
                    <h4 className="font-medium text-gray-900 mb-2">Week {week.weekNumber}</h4>
                    <div className="space-y-2">
                      {week.meals.map((meal, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {meal.name} - {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][meal.dayOfWeek]} ({meal.mealType})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowScheduleEditor(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                <Plus className="w-5 h-5 mx-auto mb-1" />
                Add meals to your plan
              </button>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : (plan ? 'Update Plan' : 'Create Plan')}
            </button>
          </div>
        </form>

        {showScheduleEditor && (
          <MealScheduleEditor
            plan={{ ...plan, mealSchedule } as NutritionPlan}
            onSave={(newSchedule) => {
              setMealSchedule(newSchedule);
              setShowScheduleEditor(false);
            }}
            onClose={() => setShowScheduleEditor(false)}
          />
        )}
      </div>
    </div>
  );
}