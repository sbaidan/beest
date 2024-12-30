import React, { useState } from 'react';
import { Plus, X, Calendar } from 'lucide-react';
import { TrainingPlan, Workout } from '../../types';
import { useWorkoutStore } from '../../store/workouts';

interface WorkoutScheduleEditorProps {
  plan: TrainingPlan;
  onSave: (workoutSchedule: TrainingPlan['workoutSchedule']) => void;
  onClose: () => void;
}

export default function WorkoutScheduleEditor({ plan, onSave, onClose }: WorkoutScheduleEditorProps) {
  const [schedule, setSchedule] = useState(plan.workoutSchedule);
  const workouts = useWorkoutStore(state => state.workouts);

  const handleWorkoutChange = (weekIndex: number, workoutIndex: number, workoutId: string) => {
    const newSchedule = [...schedule];
    // Check if this workout is already scheduled for this week
    const isDuplicate = newSchedule[weekIndex].workouts.some(
      (w, i) => i !== workoutIndex && w.workoutId === workoutId
    );

    if (isDuplicate) {
      alert('This workout is already scheduled for this week. Please choose a different workout.');
      return;
    }

    newSchedule[weekIndex].workouts[workoutIndex].workoutId = workoutId;
    setSchedule(newSchedule);
  };

  const addWorkout = (weekIndex: number) => {
    const newSchedule = [...schedule];
    const week = newSchedule[weekIndex];
    
    // Find a workout that isn't already scheduled for this week
    const availableWorkout = workouts.find(workout => 
      !week.workouts.some(w => w.workoutId === workout.id)
    );

    if (!availableWorkout) {
      alert('All workouts have been scheduled for this week.');
      return;
    }

    week.workouts.push({
      workoutId: availableWorkout.id,
      dayOfWeek: 0,
      completed: false
    });
    
    setSchedule(newSchedule);
  };

  const removeWorkout = (weekIndex: number, workoutIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[weekIndex].workouts.splice(workoutIndex, 1);
    setSchedule(newSchedule);
  };

  const handleDayChange = (weekIndex: number, workoutIndex: number, day: number) => {
    const newSchedule = [...schedule];
    newSchedule[weekIndex].workouts[workoutIndex].dayOfWeek = day;
    setSchedule(newSchedule);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Edit Training Schedule</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {schedule.map((week, weekIndex) => (
            <div key={week.weekNumber} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Week {week.weekNumber}</h3>
                <button
                  onClick={() => addWorkout(weekIndex)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Workout
                </button>
              </div>

              <div className="space-y-4">
                {week.workouts.map((scheduledWorkout, workoutIndex) => {
                  const workout = workouts.find(w => w.id === scheduledWorkout.workoutId);
                  
                  return (
                    <div key={workoutIndex} className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Workout
                            </label>
                            <select
                              value={scheduledWorkout.workoutId}
                              onChange={(e) => handleWorkoutChange(weekIndex, workoutIndex, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {workouts.map(w => (
                                <option 
                                  key={w.id} 
                                  value={w.id}
                                  disabled={week.workouts.some((sw, i) => 
                                    i !== workoutIndex && sw.workoutId === w.id
                                  )}
                                >
                                  {w.name} {week.workouts.some((sw, i) => 
                                    i !== workoutIndex && sw.workoutId === w.id
                                  ) ? '(Already scheduled)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Day
                            </label>
                            <select
                              value={scheduledWorkout.dayOfWeek}
                              onChange={(e) => handleDayChange(weekIndex, workoutIndex, parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value={0}>Sunday</option>
                              <option value={1}>Monday</option>
                              <option value={2}>Tuesday</option>
                              <option value={3}>Wednesday</option>
                              <option value={4}>Thursday</option>
                              <option value={5}>Friday</option>
                              <option value={6}>Saturday</option>
                            </select>
                          </div>
                        </div>
                        {workout && (
                          <div className="mt-2 text-sm text-gray-600">
                            {workout.exercises.length} exercises · {workout.duration} min · {workout.type}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeWorkout(weekIndex, workoutIndex)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}

                {week.workouts.length === 0 && (
                  <button
                    onClick={() => addWorkout(weekIndex)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    <Calendar className="w-5 h-5 mx-auto mb-1" />
                    Add your first workout for Week {week.weekNumber}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(schedule)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}