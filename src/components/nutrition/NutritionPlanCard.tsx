import React, { useState } from 'react';
import { Calendar, Clock, Users, Pencil, Trash2, Copy, Loader2, Apple } from 'lucide-react';
import { NutritionPlan } from '../../types/nutrition';
import { useNutritionPlanStore } from '../../store/nutritionPlans';
import { useUserStore } from '../../store/users';
import NutritionPlanForm from './NutritionPlanForm';
import NutritionPlanDetails from './NutritionPlanDetails';

interface NutritionPlanCardProps {
  plan: NutritionPlan;
}

export default function NutritionPlanCard({ plan }: NutritionPlanCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState<'delete' | 'duplicate' | null>(null);
  const { updatePlan, deletePlan, duplicatePlan } = useNutritionPlanStore();
  const { users } = useUserStore();

  const assignedAthlete = plan.athleteId ? users.find(user => user.id === plan.athleteId) : null;
  const totalMeals = plan.mealSchedule.reduce(
    (acc, week) => acc + week.meals.length, 
    0
  );

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this nutrition plan?')) {
      return;
    }

    setLoading('delete');
    try {
      await deletePlan(plan.id);
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleDuplicate = async () => {
    setLoading('duplicate');
    try {
      await duplicatePlan(plan.id);
    } catch (error) {
      console.error('Failed to duplicate plan:', error);
      alert('Failed to duplicate plan. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-indigo-500 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div className="cursor-pointer" onClick={() => setShowDetails(true)}>
            <div className="flex items-center gap-2 mb-2">
              <Apple className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            </div>
            <p className="text-gray-600 text-sm">{plan.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Edit"
              disabled={loading !== null}
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={handleDuplicate}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Duplicate"
              disabled={loading !== null}
            >
              {loading === 'duplicate' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete"
              disabled={loading !== null}
            >
              {loading === 'delete' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{plan.weeks} weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{totalMeals} meals</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Assigned to: {assignedAthlete ? assignedAthlete.username : 'Unassigned'}</span>
          </div>
          <div>
            Starts: {new Date(plan.startDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {showEditForm && (
        <NutritionPlanForm
          plan={plan}
          onClose={() => setShowEditForm(false)}
          onSubmit={async (updatedPlan) => {
            try {
              await updatePlan(plan.id, updatedPlan);
              setShowEditForm(false);
            } catch (error) {
              console.error('Failed to update plan:', error);
              alert('Failed to update plan. Please try again.');
            }
          }}
        />
      )}

      {showDetails && (
        <NutritionPlanDetails
          plan={plan}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}