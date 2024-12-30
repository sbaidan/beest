import React from 'react';

const stats = [
  { label: 'Total Athletes', value: '24' },
  { label: 'Active Workouts', value: '12' },
  { label: 'Completed Sessions', value: '156' },
];

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}