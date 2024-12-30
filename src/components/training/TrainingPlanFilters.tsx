import React from 'react';
import { Filter as FilterIcon } from 'lucide-react';

interface TrainingPlanFiltersProps {
  filters: {
    weeks: string;
    status: string;
    assignment: string;
  };
  onFilterChange: (filters: { weeks: string; status: string; assignment: string }) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function TrainingPlanFilters({
  filters,
  onFilterChange,
  showFilters,
  onToggleFilters
}: TrainingPlanFiltersProps) {
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
                Duration
              </label>
              <select
                value={filters.weeks}
                onChange={(e) => onFilterChange({ ...filters, weeks: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Durations</option>
                <option value="4">4 weeks</option>
                <option value="8">8 weeks</option>
                <option value="12">12 weeks</option>
              </select>
            </div>

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
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment
              </label>
              <select
                value={filters.assignment}
                onChange={(e) => onFilterChange({ ...filters, assignment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Plans</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}