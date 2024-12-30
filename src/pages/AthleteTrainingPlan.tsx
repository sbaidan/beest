import React, { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useTrainingPlans } from '../hooks/useTrainingPlans';
import DetailedTrainingPlan from '../components/training/DetailedTrainingPlan';
import TrainingPlanStatus from '../components/training/TrainingPlanStatus';
import WeekSelector from '../components/training/WeekSelector';
import { Filter, Search, Loader2 } from 'lucide-react';
import { useTrainingPlanStore } from '../store/trainingPlans';

export default function AthleteTrainingPlan() {
  const [selectedWeek, setSelectedWeek] = useState<number>();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  const { profile } = useAuthStore();
  const { plans, loading } = useTrainingPlans();
  const { updateWorkoutStatus } = useTrainingPlanStore();
  
  // Get the active plan for the athlete
  const activePlan = plans[0]; // Since we're already filtering in useTrainingPlans, this should be the athlete's plan

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!activePlan) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Active Training Plan</h1>
          <p className="text-gray-600">You don't have any active training plans at the moment.</p>
        </div>
      </div>
    );
  }

  const totalWorkouts = activePlan.workoutSchedule.reduce(
    (acc, week) => acc + week.workouts.length,
    0
  );
  const completedWorkouts = activePlan.workoutSchedule.reduce(
    (acc, week) => acc + week.workouts.filter(w => w.completed).length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{activePlan.name}</h1>
        <p className="text-gray-600">{activePlan.description}</p>
      </div>

      <TrainingPlanStatus
        startDate={activePlan.startDate}
        weeks={activePlan.weeks}
        completedWorkouts={completedWorkouts}
        totalWorkouts={totalWorkouts}
      />

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <WeekSelector
              totalWeeks={activePlan.weeks}
              selectedWeek={selectedWeek}
              onWeekChange={setSelectedWeek}
            />

            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search workouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Types</option>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="recovery">Recovery</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <DetailedTrainingPlan
            plan={activePlan}
            selectedWeek={selectedWeek}
            searchTerm={searchTerm}
            filters={filters}
            onWorkoutStatusChange={updateWorkoutStatus}
          />
        </div>
      </div>
    </div>
  );
}