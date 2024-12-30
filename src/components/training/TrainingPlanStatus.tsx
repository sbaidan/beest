import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface TrainingPlanStatusProps {
  startDate: string;
  weeks: number;
  completedWorkouts: number;
  totalWorkouts: number;
}

export default function TrainingPlanStatus({ startDate, weeks, completedWorkouts, totalWorkouts }: TrainingPlanStatusProps) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + weeks * 7);
  
  const progress = (completedWorkouts / totalWorkouts) * 100;
  const now = new Date();
  const status = now < new Date(startDate) ? 'upcoming' : now > endDate ? 'completed' : 'active';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Progress</h3>
        <p className="text-2xl font-bold text-gray-900">
          {completedWorkouts} / {totalWorkouts}
        </p>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <p className="text-2xl font-bold text-gray-900">{weeks} weeks</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-2xl font-bold text-gray-900 capitalize">{status}</p>
            <p className="text-sm text-gray-600">
              {new Date(startDate).toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}