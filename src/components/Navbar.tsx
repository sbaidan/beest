import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Dumbbell, Calendar, LogOut, MessageSquare, ClipboardList, Menu, Apple } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useMessagesStore } from '../store/messages';

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const { profile, isCoach, isAthlete } = useAuthStore();
  const { unreadCount, fetchMessages } = useMessagesStore();

  useEffect(() => {
    if (profile) {
      fetchMessages(profile.id);
    }
  }, [profile?.id]);

  const navItems = [
    ...(isCoach() ? [
      { icon: Dumbbell, label: 'Exercises', href: '/exercises' },
      { icon: Calendar, label: 'Workouts', href: '/workouts' },
      { icon: Calendar, label: 'Training Plans', href: '/training-plans' },
      { icon: Apple, label: 'Nutrition Plans', href: '/nutrition-plans' },
    ] : []),
    ...(isAthlete() ? [
      { icon: ClipboardList, label: 'My Plan', href: '/my-plan' },
      { icon: Apple, label: 'My Nutrition', href: '/my-nutrition' },
    ] : []),
    { 
      icon: MessageSquare, 
      label: 'Chat', 
      href: '/chat',
      notification: unreadCount > 0 ? unreadCount : undefined
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Beest</span>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) => 
                  `flex items-center gap-2 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.notification && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.notification}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-700">{profile?.username}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                {profile?.role}
              </span>
            </div>
            <button 
              onClick={() => useAuthStore.getState().signOut()}
              className="text-gray-700 hover:text-indigo-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden text-gray-700 hover:text-indigo-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}