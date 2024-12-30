import React from 'react';
import { Users } from 'lucide-react';
import { useUserStore } from '../../../store/users';

interface ExerciseAssignmentProps {
  selectedUsers: string[];
  onChange: (users: string[]) => void;
  showSelector: boolean;
  onToggleSelector: () => void;
}

export default function ExerciseAssignment({ 
  selectedUsers, 
  onChange,
  showSelector,
  onToggleSelector
}: ExerciseAssignmentProps) {
  const users = useUserStore(state => state.users);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Assign to Users
        </label>
        <button
          type="button"
          onClick={onToggleSelector}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Users className="w-5 h-5" />
        </button>
      </div>
      {showSelector && (
        <div className="mt-2 space-y-2">
          {users.map(user => (
            <label key={user.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedUsers, user.id]);
                  } else {
                    onChange(selectedUsers.filter(id => id !== user.id));
                  }
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {user.username}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}