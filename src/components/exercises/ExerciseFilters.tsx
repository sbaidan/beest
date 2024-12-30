import React from 'react';
import { Filter as FilterIcon } from 'lucide-react';

interface ExerciseFiltersProps {
  filters: {
    category: string;
    difficulty: string;
  };
  onFilterChange: (filters: { category: string; difficulty: string }) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function ExerciseFilters({ 
  filters, 
  onFilterChange, 
  showFilters, 
  onToggleFilters 
}: ExerciseFiltersProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <FilterIcon className="w-5 h-5" />
        Filter
      </button>

      {showFilters && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="balance">Balance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}