import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useExerciseStore } from '../../store/exercises';
import { Exercise } from '../../types';

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  selectedExercises: string[];
}

export default function ExerciseSelector({ onSelect, selectedExercises }: ExerciseSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const exercises = useExerciseStore(state => state.exercises);

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedExercises.includes(exercise.id)
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
          <div
            key={exercise.id}
            onClick={() => onSelect(exercise)}
            className="p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
          >
            <h4 className="font-medium text-gray-900">{exercise.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{exercise.category}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{exercise.difficulty}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}