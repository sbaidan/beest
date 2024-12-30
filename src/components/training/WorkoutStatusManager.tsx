import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { TrainingPlan } from '../../types';

interface WorkoutStatusManagerProps {
  workoutSchedule: TrainingPlan['workoutSchedule'];
  onStatusChange: (weekNumber: number, workoutId: string, completed: boolean) => void;
  selectedWeek?: number;
}

export default function WorkoutStatusManager({ 
  workoutSchedule, 
  onStatusChange,
  selectedWeek 
}: WorkoutStatusManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSchedule = workoutSchedule
    .filter(week => !selectedWeek || week.weekNumber === selectedWeek)
    .map(week => ({
      ...week,
      workouts: week.workouts.filter(workout => 
        !searchTerm || workout.workoutId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredSchedule.map((week) => (
          <div key={week.weekNumber}>
            <h3 className="font-medium text-gray-900 mb-2">Week {week.weekNumber}</h3>
            <div className="space-y-2">
              {week.workouts.map((workout) => (
                <div key={workout.workoutId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={workout.completed}
                        onChange={(e) => onStatusChange(week.weekNumber, workout.workoutId, e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-gray-900">{workout.workoutId}</span>
                    </div>
                    {workout.completed && workout.completedAt && (
                      <p className="text-xs text-gray-500 mt-1 ml-7">
                        Completed on {new Date(workout.completedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}