import React, { useState } from 'react';
import { Calendar, Clock, Users, Pencil, Trash2, Copy, Loader2 } from 'lucide-react';
import { TrainingPlan } from '../../types';
import { useTrainingPlanStore } from '../../store/trainingPlans';
import { useUserStore } from '../../store/users';
import TrainingPlanForm from './TrainingPlanForm';
import TrainingPlanDetails from './TrainingPlanDetails';

interface TrainingPlanCardProps {
  plan: TrainingPlan;
}

export default function TrainingPlanCard({ plan }: TrainingPlanCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState<'delete' | 'duplicate' | null>(null);
  const { updatePlan, deletePlan, duplicatePlan } = useTrainingPlanStore();
  const { users } = useUserStore();

  const assignedAthlete = plan.athleteId ? users.find(user => user.id === plan.athleteId) : null;
  const totalWorkouts = plan.workoutSchedule.reduce(
    (acc, week) => acc + week.workouts.length, 
    0
  );

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this training plan?')) {
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
              <Calendar className="w-5 h-5 text-indigo-600" />
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
            <span>{totalWorkouts} workouts</span>
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
        <TrainingPlanForm
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
        <TrainingPlanDetails
          plan={plan}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}