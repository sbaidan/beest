import React from 'react';
import { Dumbbell, Clock } from 'lucide-react';
import { Exercise } from '../../types';

interface ExerciseDetailsProps {
  exercise: Exercise;
  sets?: number;
  reps?: number;
  weight?: number;
  restBetweenSets?: number;
}

export default function ExerciseDetails({ 
  exercise,
  sets,
  reps,
  weight,
  restBetweenSets
}: ExerciseDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{exercise.name}</h3>
      <p className="text-gray-600 mb-4">{exercise.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {sets && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Sets</p>
            <p className="font-medium">{sets}</p>
          </div>
        )}
        {reps && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Reps</p>
            <p className="font-medium">{reps}</p>
          </div>
        )}
        {weight && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-medium">{weight}kg</p>
          </div>
        )}
        {restBetweenSets && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Rest</p>
            <p className="font-medium">{restBetweenSets}s</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            {exercise.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Equipment Needed</h4>
          <div className="flex flex-wrap gap-2">
            {exercise.equipment.map((item, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Muscle Groups</h4>
          <div className="flex flex-wrap gap-2">
            {exercise.muscleGroups.map((muscle, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}