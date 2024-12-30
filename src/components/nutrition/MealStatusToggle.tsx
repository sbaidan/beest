import React from 'react';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface MealStatusToggleProps {
  completed: boolean;
  completedAt?: string | null;
  onChange: () => void;
  loading?: boolean;
}

export default function MealStatusToggle({ 
  completed, 
  completedAt, 
  onChange,
  loading = false 
}: MealStatusToggleProps) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
        ${completed 
          ? 'bg-green-50 text-green-700 hover:bg-green-100' 
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : completed ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <Circle className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">
        {loading ? 'Updating...' : completed ? 'Completed' : 'Mark Complete'}
      </span>
      {completed && completedAt && !loading && (
        <span className="text-xs opacity-75 ml-2">
          {new Date(completedAt).toLocaleDateString()}
        </span>
      )}
    </button>
  );
}