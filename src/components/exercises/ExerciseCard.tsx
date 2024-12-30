import React, { useState } from 'react';
import { Pencil, Trash2, Users, Copy } from 'lucide-react';
import { Exercise } from '../../types';
import { useExerciseStore } from '../../store/exercises';
import { useUserStore } from '../../store/users';
import ExerciseForm from './ExerciseForm';

interface ExerciseCardProps {
  exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const { updateExercise, deleteExercise, addExercise } = useExerciseStore();
  const users = useUserStore(state => state.users);

  const assignedUsers = users.filter(user => exercise.assignedTo?.includes(user.id));

  const handleDuplicate = () => {
    const { id, ...exerciseWithoutId } = exercise;
    addExercise({
      ...exerciseWithoutId,
      name: `${exercise.name} (Copy)`,
    });
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Edit"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={handleDuplicate}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Duplicate"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteExercise(exercise.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>
        {exercise.videoUrl && (
          <div className="mb-4 aspect-video">
            <iframe
              src={exercise.videoUrl}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
            {exercise.category}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
            {exercise.difficulty}
          </span>
        </div>
        {assignedUsers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {assignedUsers.map(user => user.name).join(', ')}
          </div>
        )}
      </div>

      {showEditForm && (
        <ExerciseForm
          exercise={exercise}
          onClose={() => setShowEditForm(false)}
          onSubmit={(updatedExercise) => {
            updateExercise(exercise.id, updatedExercise);
            setShowEditForm(false);
          }}
        />
      )}
    </>
  );
}