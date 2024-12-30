import React, { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useNutritionPlans } from '../hooks/useNutritionPlans';
import NutritionPlanCard from '../components/nutrition/NutritionPlanCard';
import NutritionPlanForm from '../components/nutrition/NutritionPlanForm';
import NutritionPlanFilters from '../components/nutrition/NutritionPlanFilters';

export default function NutritionPlans() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    weeks: '',
    status: '',
    assignment: ''
  });

  const { profile } = useAuthStore();
  const { plans, loading, addPlan } = useNutritionPlans();

  if (!profile) return null;

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesWeeks = !filters.weeks || plan.weeks.toString() === filters.weeks;
    const matchesStatus = !filters.status || getPlanStatus(plan) === filters.status;
    const matchesAssignment = !filters.assignment || 
      (filters.assignment === 'assigned' ? plan.athleteId : !plan.athleteId);

    return matchesSearch && matchesWeeks && matchesStatus && matchesAssignment;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Plans</h1>
          <p className="text-gray-600">
            {filteredPlans.length} of {plans.length} plans
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <NutritionPlanFilters
            filters={filters}
            onFilterChange={setFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <NutritionPlanCard key={plan.id} plan={plan} />
          ))}
          {filteredPlans.length === 0 && (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No nutrition plans found</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <NutritionPlanForm
          onClose={() => setShowForm(false)}
          onSubmit={async (plan) => {
            try {
              await addPlan(plan);
              setShowForm(false);
            } catch (error) {
              console.error('Failed to create plan:', error);
            }
          }}
        />
      )}
    </div>
  );
}

function getPlanStatus(plan: NutritionPlan): string {
  const now = new Date();
  const startDate = new Date(plan.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (plan.weeks * 7));

  if (now < startDate) return 'upcoming';
  if (now > endDate) return 'completed';
  return 'active';
}