import { create } from 'zustand';
import { Exercise } from '../types';
import { sampleExercises } from '../data/sampleData';
import { templateExercises } from '../data/templateExercises';

interface ExerciseStore {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id' | 'creatorId'>) => void;
  updateExercise: (id: string, exercise: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  getExercise: (id: string) => Exercise | undefined;
  assignExercise: (id: string, userId: string) => void;
  unassignExercise: (id: string, userId: string) => void;
  resetLibrary: () => void;
  importTemplate: () => void;
  getMyExercises: (userId: string) => Exercise[];
}

// Add creatorId to sample exercises
const initialExercises = sampleExercises.map(exercise => ({
  ...exercise,
  creatorId: '1' // System/template creator ID
}));

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
  exercises: initialExercises,
  
  addExercise: (exercise) => set((state) => ({
    exercises: [...state.exercises, {
      ...exercise,
      id: crypto.randomUUID(),
      creatorId: '2' // Current user ID (Amar)
    }]
  })),
  
  updateExercise: (id, exercise) => set((state) => ({
    exercises: state.exercises.map(e => 
      e.id === id ? { ...e, ...exercise } : e
    )
  })),
  
  deleteExercise: (id) => set((state) => ({
    exercises: state.exercises.filter(e => e.id !== id)
  })),
  
  getExercise: (id) => get().exercises.find(e => e.id === id),
  
  assignExercise: (id, userId) => set((state) => ({
    exercises: state.exercises.map(e => 
      e.id === id 
        ? { ...e, assignedTo: [...(e.assignedTo || []), userId] }
        : e
    )
  })),
  
  unassignExercise: (id, userId) => set((state) => ({
    exercises: state.exercises.map(e => 
      e.id === id 
        ? { ...e, assignedTo: e.assignedTo?.filter(uid => uid !== userId) }
        : e
    )
  })),
  
  resetLibrary: () => set({ exercises: initialExercises }),
  
  importTemplate: () => set((state) => ({
    exercises: [
      ...state.exercises,
      ...templateExercises.map(exercise => ({
        ...exercise,
        id: crypto.randomUUID(),
        creatorId: '1' // System/template creator ID
      }))
    ]
  })),
  
  getMyExercises: (userId) => get().exercises.filter(e => e.creatorId === userId)
}));