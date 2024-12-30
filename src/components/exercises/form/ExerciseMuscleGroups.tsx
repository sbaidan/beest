import React from 'react';

interface ExerciseMuscleGroupsProps {
  defaultValue?: string[];
}

export default function ExerciseMuscleGroups({ defaultValue }: ExerciseMuscleGroupsProps) {
  return (
    <div>
      <label htmlFor="muscleGroups" className="block text-sm font-medium text-gray-700 mb-1">
        Muscle Groups (comma-separated)
      </label>
      <input
        type="text"
        id="muscleGroups"
        name="muscleGroups"
        defaultValue={defaultValue?.join(', ')}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="e.g., chest, shoulders, triceps"
      />
    </div>
  );
}