import React from 'react';
import { Filter } from 'lucide-react';

interface WorkoutFiltersProps {
  filters: {
    status: string;
    type: string;
  };
  onFilterChange: (filters: { status: string; type: string }) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function WorkoutFilters({
  filters,
  onFilterChange,
  showFilters,
  onToggleFilters
}: WorkoutFiltersProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <Filter className="w-5 h-5" />
        Filter
      </button>

      {showFilters && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Types</option>
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Recovery">Recovery</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}