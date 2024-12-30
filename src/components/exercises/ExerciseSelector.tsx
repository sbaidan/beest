import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Exercise } from '../../types';
import ExerciseCard from './ExerciseCard';

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  selectedExercises: Exercise[];
}

// Mock data - replace with actual data later
const availableExercises: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Squat',
    description: 'Compound lower body exercise',
    category: 'strength',
    difficulty: 'intermediate',
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes'],
    equipment: ['barbell', 'rack'],
    instructions: ['Step 1', 'Step 2']
  },
  {
    id: '2',
    name: 'Push-ups',
    description: 'Bodyweight upper body exercise',
    category: 'strength',
    difficulty: 'beginner',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: [],
    instructions: ['Step 1', 'Step 2']
  }
];

export default function ExerciseSelector({ onSelect, selectedExercises }: ExerciseSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = availableExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
        {filteredExercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            selected={selectedExercises.some(e => e.id === exercise.id)}
            onSelect={() => onSelect(exercise)}
          />
        ))}
      </div>
    </div>
  );
}