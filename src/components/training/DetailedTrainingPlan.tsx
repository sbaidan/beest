import React, { useState } from 'react';
import { Calendar, Clock, Dumbbell } from 'lucide-react';
import { TrainingPlan } from '../../types';
import { useWorkoutStore } from '../../store/workouts';
import { useExerciseStore } from '../../store/exercises';
import WorkoutStatusToggle from './WorkoutStatusToggle';
import ExerciseDetails from '../exercises/ExerciseDetails';

interface DetailedTrainingPlanProps {
  plan: TrainingPlan;
  selectedWeek?: number;
  searchTerm: string;
  filters: {
    status: string;
    type: string;
  };
  onWorkoutStatusChange: (planId: string, weekNumber: number, workoutId: string, completed: boolean) => Promise<void>;
}

export default function DetailedTrainingPlan({
  plan,
  selectedWeek,
  searchTerm,
  filters,
  onWorkoutStatusChange
}: DetailedTrainingPlanProps) {
  const [updatingWorkout, setUpdatingWorkout] = useState<string | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const getWorkout = useWorkoutStore(state => state.getWorkout);
  const getExercise = useExerciseStore(state => state.getExercise);

  const filteredSchedule = plan.workoutSchedule
    .filter(week => !selectedWeek || week.weekNumber === selectedWeek)
    .map(week => ({
      ...week,
      workouts: week.workouts.filter(workout => {
        const workoutDetails = getWorkout(workout.workoutId);
        if (!workoutDetails) return false;

        const matchesSearch = workoutDetails.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filters.type || workoutDetails.type === filters.type;
        const matchesStatus = !filters.status || 
          (filters.status === 'completed' ? workout.completed : !workout.completed);

        return matchesSearch && matchesType && matchesStatus;
      })
    }));

  const handleStatusChange = async (weekNumber: number, workoutId: string, completed: boolean) => {
    const key = `${weekNumber}-${workoutId}`;
    setUpdatingWorkout(key);
    try {
      await onWorkoutStatusChange(plan.id, weekNumber, workoutId, completed);
    } catch (error) {
      console.error('Failed to update workout status:', error);
    } finally {
      setUpdatingWorkout(null);
    }
  };

  return (
    <div className="space-y-6">
      {filteredSchedule.map((week) => (
        <div key={week.weekNumber} className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Week {week.weekNumber}</h3>
          </div>

          <div className="p-4 space-y-4">
            {week.workouts.map((scheduledWorkout) => {
              const workout = getWorkout(scheduledWorkout.workoutId);
              if (!workout) return null;

              const isExpanded = expandedWorkout === `${week.weekNumber}-${scheduledWorkout.workoutId}`;

              return (
                <div
                  key={`${week.weekNumber}-${scheduledWorkout.workoutId}`}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <div className="flex-1">
                      <button
                        onClick={() => setExpandedWorkout(isExpanded ? null : `${week.weekNumber}-${scheduledWorkout.workoutId}`)}
                        className="text-left"
                      >
                        <h4 className="font-medium text-gray-900">{workout.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][scheduledWorkout.dayOfWeek]}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {workout.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Dumbbell className="w-4 h-4" />
                            {workout.exercises.length} exercises
                          </span>
                        </div>
                      </button>
                    </div>

                    <WorkoutStatusToggle
                      completed={scheduledWorkout.completed}
                      completedAt={scheduledWorkout.completedAt}
                      loading={updatingWorkout === `${week.weekNumber}-${scheduledWorkout.workoutId}`}
                      onChange={() => handleStatusChange(
                        week.weekNumber,
                        scheduledWorkout.workoutId,
                        !scheduledWorkout.completed
                      )}
                    />
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-gray-200 space-y-4">
                      {workout.exercises.map((exerciseData) => {
                        const exercise = getExercise(exerciseData.exerciseId);
                        if (!exercise) return null;

                        return (
                          <ExerciseDetails
                            key={exerciseData.exerciseId}
                            exercise={exercise}
                            sets={exerciseData.sets}
                            reps={exerciseData.reps}
                            weight={exerciseData.weight}
                            restBetweenSets={exerciseData.restBetweenSets}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {week.workouts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No workouts found for this week
              </div>
            )}
          </div>
        </div>
      ))}

      {filteredSchedule.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No workouts found matching your criteria
        </div>
      )}
    </div>
  );
}