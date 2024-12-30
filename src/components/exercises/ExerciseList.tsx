import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import ExerciseCard from './ExerciseCard';
import ExerciseFilters from './ExerciseFilters';
import { Exercise } from '../../types';

interface ExerciseListProps {
  exercises: Exercise[];
}

export default function ExerciseList({ exercises }: ExerciseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: ''
  });

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || exercise.category === filters.category;
      const matchesDifficulty = !filters.difficulty || exercise.difficulty === filters.difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [exercises, searchTerm, filters]);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {filteredExercises.length} of {exercises.length} exercises
          </p>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <ExerciseFilters
              filters={filters}
              onFilterChange={setFilters}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}