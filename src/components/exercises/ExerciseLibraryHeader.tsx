import React from 'react';
import { Plus, RotateCcw, Import } from 'lucide-react';
import { useExerciseStore } from '../../store/exercises';

interface ExerciseLibraryHeaderProps {
  onCreateClick: () => void;
  viewMode: 'all' | 'my';
  onViewModeChange: (mode: 'all' | 'my') => void;
}

export default function ExerciseLibraryHeader({
  onCreateClick,
  viewMode,
  onViewModeChange
}: ExerciseLibraryHeaderProps) {
  const { resetLibrary, importTemplate } = useExerciseStore();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
        <p className="text-gray-600">Manage and organize your exercises</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => onViewModeChange('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            All Exercises
          </button>
          <button
            onClick={() => onViewModeChange('my')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'my'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            My Exercises
          </button>
        </div>

        <button
          onClick={importTemplate}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:text-indigo-600 hover:border-indigo-600 transition-colors"
        >
          <Import className="w-5 h-5" />
          Import Template
        </button>

        <button
          onClick={resetLibrary}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:text-indigo-600 hover:border-indigo-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Reset Library
        </button>

        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Exercise
        </button>
      </div>
    </div>
  );
}