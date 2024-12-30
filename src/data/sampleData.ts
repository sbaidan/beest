import { Exercise, Workout, TrainingPlan, Message } from '../types';

export const sampleExercises: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Back Squat',
    description: 'A compound lower body exercise targeting quadriceps, hamstrings, and glutes',
    category: 'strength',
    difficulty: 'intermediate',
    equipment: ['barbell', 'squat rack', 'weight plates'],
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'core'],
    instructions: [
      'Position the barbell on your upper back',
      'Stand with feet shoulder-width apart',
      'Break at hips and knees simultaneously',
      'Lower until thighs are parallel to ground',
      'Drive through heels to return to starting position'
    ],
    videoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8'
  },
  {
    id: '2',
    name: 'Push-ups',
    description: 'A bodyweight exercise for upper body strength',
    category: 'strength',
    difficulty: 'beginner',
    equipment: [],
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower body until chest nearly touches ground',
      'Push back up to starting position',
      'Maintain straight body throughout movement'
    ]
  },
  {
    id: '3',
    name: 'Running Intervals',
    description: 'High-intensity cardio training',
    category: 'cardio',
    difficulty: 'intermediate',
    equipment: ['treadmill'],
    muscleGroups: ['legs', 'cardiovascular system'],
    instructions: [
      'Warm up for 5 minutes at easy pace',
      'Sprint for 30 seconds',
      'Walk or jog for 1 minute',
      'Repeat 8-10 times',
      'Cool down for 5 minutes'
    ]
  }
];

export const sampleWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Full Body Strength',
    description: 'Complete full body workout targeting all major muscle groups',
    exercises: [
      {
        exerciseId: '1',
        sets: 4,
        reps: 8,
        restBetweenSets: 90
      },
      {
        exerciseId: '2',
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
    id: '2',
    name: 'HIIT Cardio',
    description: 'High-intensity interval training for maximum calorie burn',
    exercises: [
      {
        exerciseId: '3',
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

export const sampleTrainingPlans: TrainingPlan[] = [
  {
    id: '1',
    name: 'Strength Building Program',
    description: 'Progressive overload program focusing on compound movements',
    weeks: 8,
    startDate: '2024-03-20',
    coachId: '1',
    athleteId: '2',
    workoutSchedule: [
      {
        weekNumber: 1,
        workouts: [
          {
            workoutId: '1',
            dayOfWeek: 1,
            completed: false
          },
          {
            workoutId: '2',
            dayOfWeek: 3,
            completed: false
          }
        ]
      }
    ]
  }
];

export const sampleMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    content: 'How was your workout today?',
    timestamp: Date.now() - 86400000,
    read: true
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    content: 'It was great! Completed all sets of squats with good form.',
    timestamp: Date.now() - 82800000,
    read: true
  }
];