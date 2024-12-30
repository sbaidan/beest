import React, { useState } from 'react';
import { Calendar, Clock, Dumbbell, Edit2 } from 'lucide-react';
import { TrainingPlan } from '../../types';
import { useWorkoutStore } from '../../store/workouts';
import { useExerciseStore } from '../../store/exercises';
import { useTrainingPlanStore } from '../../store/trainingPlans';
import WorkoutScheduleEditor from './WorkoutScheduleEditor';

interface TrainingPlanDetailsProps {
  plan: TrainingPlan;
  onClose: () => void;
}

export default function TrainingPlanDetails({ plan, onClose }: TrainingPlanDetailsProps) {
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const getWorkout = useWorkoutStore(state => state.getWorkout);
  const getExercise = useExerciseStore(state => state.getExercise);
  const updatePlan = useTrainingPlanStore(state => state.updatePlan);

  const handleScheduleUpdate = (workoutSchedule: TrainingPlan['workoutSchedule']) => {
    updatePlan(plan.id, { workoutSchedule });
    setShowScheduleEditor(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
              <p className="text-gray-600 mt-1">{plan.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowScheduleEditor(true)}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700"
              >
                <Edit2 className="w-5 h-5" />
                Edit Schedule
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(plan.startDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {plan.weeks} weeks
            </div>
          </div>
        </div>

        <div className="p-6">
          {plan.workoutSchedule.map((week) => (
            <div key={week.weekNumber} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Week {week.weekNumber}
              </h3>
              <div className="grid gap-4">
                {week.workouts.map((scheduledWorkout, workoutIndex) => {
                  const workout = getWorkout(scheduledWorkout.workoutId);
                  if (!workout) return null;

                  const workoutKey = `${week.weekNumber}-${scheduledWorkout.workoutId}-${workoutIndex}`;

                  return (
                    <div
                      key={workoutKey}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{workout.name}</h4>
                          <p className="text-sm text-gray-600">{workout.description}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][scheduledWorkout.dayOfWeek]}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-sm rounded-full ${
                          scheduledWorkout.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {scheduledWorkout.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {workout.exercises.map((exercise, exerciseIndex) => {
                          const exerciseDetails = getExercise(exercise.exerciseId);
                          if (!exerciseDetails) return null;

                          return (
                            <div
                              key={`${workoutKey}-exercise-${exercise.exerciseId}-${exerciseIndex}`}
                              className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
                            >
                              <Dumbbell className="w-5 h-5 text-gray-400 mt-1" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {exerciseDetails.name}
                                </p>
                                <div className="text-sm text-gray-600 mt-1">
                                  {exercise.sets && (
                                    <span className="mr-3">{exercise.sets} sets</span>
                                  )}
                                  {exercise.reps && (
                                    <span className="mr-3">{exercise.reps} reps</span>
                                  )}
                                  {exercise.duration && (
                                    <span className="mr-3">{exercise.duration}s</span>
                                  )}
                                  {exercise.restBetweenSets && (
                                    <span>{exercise.restBetweenSets}s rest</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showScheduleEditor && (
        <WorkoutScheduleEditor
          plan={plan}
          onSave={handleScheduleUpdate}
          onClose={() => setShowScheduleEditor(false)}
        />
      )}
    </div>
  );
}