import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useWorkoutStore } from '../../store/workouts';
import WorkoutCard from './WorkoutCard';
import WorkoutFilters from './WorkoutFilters';

export default function WorkoutList() {
  const workouts = useWorkoutStore(state => state.workouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    difficulty: ''
  });

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          workout.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !filters.type || workout.type === filters.type;
      const matchesDifficulty = !filters.difficulty || workout.difficulty === filters.difficulty;

      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [workouts, searchTerm, filters]);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">Workout Library</h2>
            <p className="text-sm text-gray-500">
              {filteredWorkouts.length} of {workouts.length} workouts
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <WorkoutFilters
              filters={filters}
              onFilterChange={setFilters}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}