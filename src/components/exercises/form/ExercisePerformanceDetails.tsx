import React from 'react';
import { Exercise } from '../../../types';

interface ExercisePerformanceDetailsProps {
  defaultValues?: Pick<Exercise, 'defaultWeight' | 'defaultReps' | 'defaultSets' | 'weightIncrement' | 'restBetweenSets'>;
}

export default function ExercisePerformanceDetails({ defaultValues }: ExercisePerformanceDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="defaultWeight" className="block text-sm font-medium text-gray-700 mb-1">
            Default Weight (kg)
          </label>
          <input
            type="number"
            id="defaultWeight"
            name="defaultWeight"
            defaultValue={defaultValues?.defaultWeight}
            min="0"
            step="0.5"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="weightIncrement" className="block text-sm font-medium text-gray-700 mb-1">
            Weight Increment (kg)
          </label>
          <input
            type="number"
            id="weightIncrement"
            name="weightIncrement"
            defaultValue={defaultValues?.weightIncrement}
            min="0"
            step="0.5"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="defaultSets" className="block text-sm font-medium text-gray-700 mb-1">
            Default Sets
          </label>
          <input
            type="number"
            id="defaultSets"
            name="defaultSets"
            defaultValue={defaultValues?.defaultSets}
            min="1"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="defaultReps" className="block text-sm font-medium text-gray-700 mb-1">
            Default Reps
          </label>
          <input
            type="number"
            id="defaultReps"
            name="defaultReps"
            defaultValue={defaultValues?.defaultReps}
            min="1"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="restBetweenSets" className="block text-sm font-medium text-gray-700 mb-1">
            Rest Between Sets (sec)
          </label>
          <input
            type="number"
            id="restBetweenSets"
            name="restBetweenSets"
            defaultValue={defaultValues?.restBetweenSets}
            min="0"
            step="5"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}