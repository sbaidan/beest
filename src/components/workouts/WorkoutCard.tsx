import React, { useState } from 'react';
import { Clock, Dumbbell, Pencil, Trash2, Copy } from 'lucide-react';
import { Workout } from '../../types';
import { useWorkoutStore } from '../../store/workouts';
import WorkoutForm from './WorkoutForm';

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const { updateWorkout, deleteWorkout, addWorkout } = useWorkoutStore();

  const handleDuplicate = () => {
    const { id, ...workoutWithoutId } = workout;
    addWorkout({
      ...workoutWithoutId,
      name: `${workout.name} (Copy)`,
    });
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Edit"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={handleDuplicate}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Duplicate"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteWorkout(workout.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">{workout.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" />
            {workout.type}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {workout.duration}min
          </span>
          <span className="capitalize">{workout.difficulty}</span>
        </div>
        <div className="mt-3 text-sm text-gray-500">
          {workout.exercises.length} exercises
        </div>
      </div>

      {showEditForm && (
        <WorkoutForm
          workout={workout}
          onClose={() => setShowEditForm(false)}
          onSubmit={(updatedWorkout) => {
            updateWorkout(workout.id, updatedWorkout);
            setShowEditForm(false);
          }}
        />
      )}
    </>
  );
}