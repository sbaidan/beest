import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import WorkoutList from '../components/workouts/WorkoutList';
import WorkoutForm from '../components/workouts/WorkoutForm';
import { useWorkoutStore } from '../store/workouts';

export default function Workouts() {
  const [showForm, setShowForm] = useState(false);
  const addWorkout = useWorkoutStore(state => state.addWorkout);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
          <p className="text-gray-600">Create and manage your workout programs</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Workout
        </button>
      </div>

      <WorkoutList />
      
      {showForm && (
        <WorkoutForm
          onClose={() => setShowForm(false)}
          onSubmit={(workout) => {
            addWorkout(workout);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}