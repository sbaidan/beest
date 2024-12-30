import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Exercise } from '../../types';
import ExerciseBasicInfo from './form/ExerciseBasicInfo';
import ExercisePerformanceDetails from './form/ExercisePerformanceDetails';
import ExerciseInstructions from './form/ExerciseInstructions';
import ExerciseEquipment from './form/ExerciseEquipment';
import ExerciseMuscleGroups from './form/ExerciseMuscleGroups';
import ExerciseVideo from './form/ExerciseVideo';

interface ExerciseFormProps {
  onClose: () => void;
  onSubmit: (exercise: Omit<Exercise, 'id'>) => void;
  exercise?: Exercise;
}

export default function ExerciseForm({ onClose, onSubmit, exercise }: ExerciseFormProps) {
  const [instructions, setInstructions] = useState<string[]>(exercise?.instructions || ['']);
  const [equipment, setEquipment] = useState<string[]>(exercise?.equipment || ['']);
  const [videoUrl, setVideoUrl] = useState(exercise?.videoUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    onSubmit({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as Exercise['category'],
      difficulty: formData.get('difficulty') as Exercise['difficulty'],
      muscleGroups: formData.get('muscleGroups')?.toString().split(',').map(m => m.trim()) || [],
      equipment: equipment.filter(e => e.trim() !== ''),
      instructions: instructions.filter(i => i.trim() !== ''),
      videoUrl: videoUrl || undefined,
      defaultWeight: Number(formData.get('defaultWeight')) || undefined,
      defaultReps: Number(formData.get('defaultReps')) || undefined,
      defaultSets: Number(formData.get('defaultSets')) || undefined,
      weightIncrement: Number(formData.get('weightIncrement')) || undefined,
      restBetweenSets: Number(formData.get('restBetweenSets')) || undefined,
      creatorId: '1'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {exercise ? 'Edit Exercise' : 'Create New Exercise'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ExerciseBasicInfo defaultValues={exercise} />
          <ExercisePerformanceDetails defaultValues={exercise} />
          <ExerciseMuscleGroups defaultValue={exercise?.muscleGroups} />
          <ExerciseEquipment 
            equipment={equipment}
            onChange={setEquipment}
          />
          <ExerciseInstructions 
            instructions={instructions}
            onChange={setInstructions}
          />
          <ExerciseVideo
            videoUrl={videoUrl}
            onChange={setVideoUrl}
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {exercise ? 'Update Exercise' : 'Create Exercise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}