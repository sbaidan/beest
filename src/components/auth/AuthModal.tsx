import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

interface AuthModalProps {
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'coach' | 'athlete'>('athlete');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        // Validate username
        if (username.length < 3) {
          throw new Error('Username must be at least 3 characters long');
        }

        await signUp({
          email,
          password,
          username,
          role
        });
      }

      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                minLength={3}
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="athlete"
                    checked={role === 'athlete'}
                    onChange={(e) => setRole(e.target.value as 'athlete')}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  Athlete
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="coach"
                    checked={role === 'coach'}
                    onChange={(e) => setRole(e.target.value as 'coach')}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  Coach
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading 
                ? (mode === 'login' ? 'Logging in...' : 'Creating Account...') 
                : (mode === 'login' ? 'Login' : 'Create Account')}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700"
              disabled={isLoading}
            >
              {mode === 'login' 
                ? "Don't have an account? Create one" 
                : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}