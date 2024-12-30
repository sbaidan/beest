import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Exercise, Workout, WorkoutExercise } from '../../types';
import ExerciseSelector from './ExerciseSelector';
import WorkoutExerciseList from './WorkoutExerciseList';
import { useExerciseStore } from '../../store/exercises';

interface WorkoutFormProps {
  onClose: () => void;
  onSubmit: (workout: Omit<Workout, 'id'>) => void;
  workout?: Workout;
}

export default function WorkoutForm({ onClose, onSubmit, workout }: WorkoutFormProps) {
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(
    workout?.exercises || []
  );
  const getExercise = useExerciseStore(state => state.getExercise);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    onSubmit({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as Workout['type'],
      difficulty: formData.get('difficulty') as Workout['difficulty'],
      duration: parseInt(formData.get('duration') as string, 10),
      exercises: selectedExercises
    });
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    const defaultExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      weight: exercise.defaultWeight,
      restBetweenSets: exercise.restBetweenSets
    };

    setSelectedExercises([...selectedExercises, defaultExercise]);
    setShowExerciseSelector(false);
  };

  const handleExerciseUpdate = (index: number, updates: Partial<WorkoutExercise>) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = { ...updatedExercises[index], ...updates };
    setSelectedExercises(updatedExercises);
  };

  const handleExerciseRemove = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {workout ? 'Edit Workout' : 'Create New Workout'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Workout Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={workout?.name}
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
              rows={3}
              defaultValue={workout?.description}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                defaultValue={workout?.type}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="hybrid">Hybrid</option>
                <option value="recovery">Recovery</option>
              </select>
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                defaultValue={workout?.difficulty}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (min)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                defaultValue={workout?.duration || 45}
                min="1"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Exercises
              </label>
              <button
                type="button"
                onClick={() => setShowExerciseSelector(true)}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Add Exercise
              </button>
            </div>
            
            {selectedExercises.length > 0 ? (
              <WorkoutExerciseList
                exercises={selectedExercises.map((e, index) => ({
                  exercise: getExercise(e.exerciseId)!,
                  sets: e.sets,
                  reps: e.reps,
                  weight: e.weight,
                  restBetweenSets: e.restBetweenSets,
                  onUpdate: (updates) => handleExerciseUpdate(index, updates)
                }))}
                onRemove={handleExerciseRemove}
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowExerciseSelector(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                <Plus className="w-5 h-5 mx-auto mb-1" />
                Add your first exercise
              </button>
            )}
          </div>

          {showExerciseSelector && (
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Select Exercise</h3>
                <button
                  type="button"
                  onClick={() => setShowExerciseSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ExerciseSelector
                onSelect={handleExerciseSelect}
                selectedExercises={selectedExercises.map(e => e.exerciseId)}
              />
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {workout ? 'Update Workout' : 'Create Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}