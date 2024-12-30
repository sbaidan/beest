import React, { useState } from 'react';
import ExerciseList from '../components/exercises/ExerciseList';
import ExerciseForm from '../components/exercises/ExerciseForm';
import ExerciseLibraryHeader from '../components/exercises/ExerciseLibraryHeader';
import { useExerciseStore } from '../store/exercises';

export default function Exercises() {
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const { exercises, addExercise, getMyExercises } = useExerciseStore();

  // Current user ID (Amar)
  const currentUserId = '2';
  
  const displayedExercises = viewMode === 'all' 
    ? exercises 
    : getMyExercises(currentUserId);

  return (
    <div className="max-w-7xl mx-auto">
      <ExerciseLibraryHeader
        onCreateClick={() => setShowForm(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ExerciseList exercises={displayedExercises} />
      
      {showForm && (
        <ExerciseForm
          onClose={() => setShowForm(false)}
          onSubmit={(exercise) => {
            addExercise(exercise);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}