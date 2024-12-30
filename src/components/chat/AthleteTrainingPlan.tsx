import React from 'react';
import { Calendar, Clock, Dumbbell } from 'lucide-react';
import { TrainingPlan } from '../../types';
import { useWorkoutStore } from '../../store/workouts';
import { useExerciseStore } from '../../store/exercises';

interface AthleteTrainingPlanProps {
  plan: TrainingPlan;
}

export default function AthleteTrainingPlan({ plan }: AthleteTrainingPlanProps) {
  const getWorkout = useWorkoutStore(state => state.getWorkout);
  const getExercise = useExerciseStore(state => state.getExercise);

  const currentWeek = getCurrentWeek(plan);
  const totalWorkouts = plan.workoutSchedule.reduce(
    (acc, week) => acc + week.workouts.length,
    0
  );
  const completedWorkouts = plan.workoutSchedule.reduce(
    (acc, week) => acc + week.workouts.filter(w => w.completed).length,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Current Training Plan</h3>
        <p className="text-gray-600">{plan.description}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Started {new Date(plan.startDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{plan.weeks} weeks program</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Dumbbell className="w-4 h-4" />
          <span>{completedWorkouts} of {totalWorkouts} workouts completed</span>
        </div>
      </div>

      {currentWeek && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Week {currentWeek.weekNumber}</h4>
          <div className="space-y-3">
            {currentWeek.workouts.map((scheduledWorkout) => {
              const workout = getWorkout(scheduledWorkout.workoutId);
              if (!workout) return null;

              return (
                <div
                  key={scheduledWorkout.workoutId}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">{workout.name}</h5>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      scheduledWorkout.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {scheduledWorkout.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {workout.exercises.length} exercises
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function getCurrentWeek(plan: TrainingPlan): TrainingPlan['workoutSchedule'][0] | undefined {
  const startDate = new Date(plan.startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentWeekNumber = Math.ceil(diffDays / 7);

  return plan.workoutSchedule.find(week => week.weekNumber === currentWeekNumber);
}