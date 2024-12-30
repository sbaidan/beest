import React from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { Exercise, WorkoutExercise } from '../../types';

interface WorkoutExerciseListProps {
  exercises: {
    exercise: Exercise;
    sets?: number;
    reps?: number;
    weight?: number;
    restBetweenSets?: number;
    onUpdate: (updates: Partial<WorkoutExercise>) => void;
  }[];
  onRemove: (index: number) => void;
}

export default function WorkoutExerciseList({ exercises, onRemove }: WorkoutExerciseListProps) {
  if (!exercises || exercises.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {exercises.map(({ exercise, sets, reps, weight, restBetweenSets, onUpdate }, index) => (
        <div 
          key={`${exercise?.id}-${index}`}
          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg group"
        >
          <button 
            type="button"
            className="text-gray-400 hover:text-gray-600 cursor-grab"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{exercise?.name}</h4>
            <div className="grid grid-cols-4 gap-4 mt-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sets</label>
                <input
                  type="number"
                  value={sets || ''}
                  onChange={(e) => onUpdate({ sets: Number(e.target.value) || undefined })}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                  min="1"
                  placeholder={exercise?.defaultSets?.toString()}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Reps</label>
                <input
                  type="number"
                  value={reps || ''}
                  onChange={(e) => onUpdate({ reps: Number(e.target.value) || undefined })}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                  min="1"
                  placeholder={exercise?.defaultReps?.toString()}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight || ''}
                  onChange={(e) => onUpdate({ weight: Number(e.target.value) || undefined })}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                  min="0"
                  step="0.5"
                  placeholder={exercise?.defaultWeight?.toString()}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rest (sec)</label>
                <input
                  type="number"
                  value={restBetweenSets || ''}
                  onChange={(e) => onUpdate({ restBetweenSets: Number(e.target.value) || undefined })}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                  min="0"
                  step="5"
                  placeholder={exercise?.restBetweenSets?.toString()}
                />
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}