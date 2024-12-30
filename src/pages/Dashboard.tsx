import React from 'react';
import StatsOverview from '../components/dashboard/StatsOverview';
import RecentWorkouts from '../components/dashboard/RecentWorkouts';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your fitness program</p>
      </div>
      
      <StatsOverview />
      <RecentWorkouts />
    </div>
  );
}