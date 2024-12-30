import { create } from 'zustand';
import { supabase, fetchWithRetry } from '../lib/supabase';

interface User {
  id: string;
  username: string;
  role: 'coach' | 'athlete';
}

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  getAthletes: () => User[];
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    if (get().users.length > 0) return; // Don't fetch if we already have users
    
    set({ loading: true, error: null });
    try {
      const { data, error } = await fetchWithRetry(async () => 
        supabase
          .from('profiles')
          .select('*')
          .order('username')
      );

      if (error) throw error;
      set({ users: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ error: error.message, loading: false });
    }
  },

  getAthletes: () => {
    return get().users.filter(user => user.role === 'athlete');
  }
}));