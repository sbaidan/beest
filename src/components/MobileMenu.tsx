import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Apple } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useMessagesStore } from '../store/messages';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { profile, isCoach, isAthlete } = useAuthStore();
  const { unreadCount } = useMessagesStore();

  const navItems = [
    ...(isCoach() ? [
     /* { label: 'Dashboard', href: '/' }, */
      { label: 'Exercises', href: '/exercises' },
      { label: 'Workouts', href: '/workouts' },
      { label: 'Training Plans', href: '/training-plans' },
      { label: 'Nutrition Plans', href: '/nutrition-plans' },
    ] : []),
    ...(isAthlete() ? [
      { label: 'My Plan', href: '/my-plan' },
      { label: 'My Nutrition', href: '/my-nutrition' },
    ] : []),
    { 
      label: 'Chat', 
      href: '/chat',
      notification: unreadCount > 0 ? unreadCount : undefined
    },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      
      <div className="fixed top-0 bottom-0 right-0 w-64 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="font-semibold text-gray-900">Menu</span>
          <button onClick={onClose} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.notification && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.notification}
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}