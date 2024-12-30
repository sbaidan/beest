import React from 'react';
import { Exercise } from '../../../types';

interface ExerciseBasicInfoProps {
  defaultValues?: Pick<Exercise, 'name' | 'description' | 'category' | 'difficulty'>;
}

export default function ExerciseBasicInfo({ defaultValues }: ExerciseBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Exercise Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
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
          defaultValue={defaultValues?.description}
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={defaultValues?.category}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="balance">Balance</option>
          </select>
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={defaultValues?.difficulty}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
  );
}