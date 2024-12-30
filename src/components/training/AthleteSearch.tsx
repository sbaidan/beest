import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useUserStore } from '../../store/users';

interface AthleteSearchProps {
  value: string;
  onChange: (athleteId: string) => void;
}

export default function AthleteSearch({ value, onChange }: AthleteSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { users, loading, fetchUsers } = useUserStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get athletes and filter by search term
  const athletes = users.filter(user => 
    user.role === 'athlete' && 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected athlete
  const selectedAthlete = users.find(user => user.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder={selectedAthlete ? selectedAthlete.username : "Search athletes..."}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-indigo-600" />
            </div>
          ) : athletes.length > 0 ? (
            <div className="py-1">
              {athletes.map(athlete => (
                <button
                  key={athlete.id}
                  onClick={() => {
                    onChange(athlete.id);
                    setSearchTerm('');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="font-medium">{athlete.username}</span>
                  <span className="text-sm text-gray-500">Athlete</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No athletes found
            </div>
          )}
        </div>
      )}
    </div>
  );
}