export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  videoUrl?: string;
  creatorId: string;
  // Performance attributes
  defaultWeight?: number; // Weight in kg
  defaultReps?: number;  // Number of repetitions
  defaultSets?: number;  // Number of series
  weightIncrement?: number; // Suggested weight increment for progression
  restBetweenSets?: number; // Rest time in seconds
}

export interface ExerciseSet {
  weight?: number;
  reps?: number;
  sets?: number;
  restBetweenSets?: number;
  duration?: number; // For timed exercises
}

export interface WorkoutExercise {
  exerciseId: string;
  sets?: number;
  reps?: number;
  weight?: number;
  restBetweenSets?: number;
  duration?: number; // For cardio/timed exercises
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  duration: number; // Total duration in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'strength' | 'cardio' | 'hybrid' | 'recovery';
}