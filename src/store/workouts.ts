import { create } from 'zustand';
import { Workout } from '../types';

interface WorkoutStore {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkout: (id: string) => Workout | undefined;
}

// Generate proper UUIDs for sample data
const sampleWorkouts: Workout[] = [
  {
    id: 'c0a80121-1234-4321-9876-543210987654', // Using proper UUID format
    name: 'Full Body Strength',
    description: 'Complete full body workout targeting all major muscle groups',
    exercises: [
      {
        exerciseId: 'e0a80121-1234-4321-9876-543210987654',
        sets: 4,
        reps: 8,
        restBetweenSets: 90
      },
      {
        exerciseId: 'e0a80121-5678-4321-9876-543210987654',
        sets: 3,
        reps: 12,
        restBetweenSets: 60
      }
    ],
    duration: 45,
    difficulty: 'intermediate',
    type: 'strength'
  },
  {
    id: 'c0a80121-5678-4321-9876-543210987654',
    name: 'HIIT Cardio',
    description: 'High-intensity interval training for maximum calorie burn',
    exercises: [
      {
        exerciseId: 'e0a80121-9012-4321-9876-543210987654',
        duration: 30,
        sets: 8,
        restBetweenSets: 60
      }
    ],
    duration: 30,
    difficulty: 'advanced',
    type: 'cardio'
  }
];

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workouts: sampleWorkouts,
  
  addWorkout: (workout) => set((state) => ({
    workouts: [...state.workouts, { ...workout, id: crypto.randomUUID() }]
  })),
  
  updateWorkout: (id, workout) => set((state) => ({
    workouts: state.workouts.map(w => w.id === id ? { ...w, ...workout } : w)
  })),
  
  deleteWorkout: (id) => set((state) => ({
    workouts: state.workouts.filter(w => w.id !== id)
  })),
  
  getWorkout: (id) => get().workouts.find(w => w.id === id)
}));