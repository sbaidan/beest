import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import WorkoutFilters from './WorkoutFilters';

const workouts = [
  {
    name: 'Full Body Strength',
    type: 'Strength',
    duration: '45 min',
    assignedTo: '8 athletes',
    status: 'Active',
  },
  {
    name: 'HIIT Cardio',
    type: 'Cardio',
    duration: '30 min',
    assignedTo: '12 athletes',
    status: 'Active',
  },
  {
    name: 'Recovery Session',
    type: 'Recovery',
    duration: '60 min',
    assignedTo: '5 athletes',
    status: 'Draft',
  },
];

export default function RecentWorkouts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      const matchesSearch = 
        workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filters.status || workout.status === filters.status;
      const matchesType = !filters.type || workout.type === filters.type;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [workouts, searchTerm, filters]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">Recent Workouts</h2>
          <p className="text-sm text-gray-500">
            {filteredWorkouts.length} of {workouts.length} workouts
          </p>
        </div>
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
          <WorkoutFilters
            filters={filters}
            onFilterChange={setFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Workout Name</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Duration</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Assigned To</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkouts.map((workout, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-900">{workout.name}</p>
                </td>
                <td className="py-3 px-4 text-gray-600">{workout.type}</td>
                <td className="py-3 px-4 text-gray-600">{workout.duration}</td>
                <td className="py-3 px-4 text-gray-600">{workout.assignedTo}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    workout.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workout.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}