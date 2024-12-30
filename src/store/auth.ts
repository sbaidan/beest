import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string;
  role: 'coach' | 'athlete';
}

interface AuthStore {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  initialize: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
  isCoach: () => boolean;
  isAthlete: () => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { email: string; password: string; username: string; role: 'coach' | 'athlete' }) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    
    try {
      set({ loading: true, error: null });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ profile, loading: false, initialized: true });
      } else {
        set({ profile: null, loading: false, initialized: true });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ error: error.message, loading: false, initialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ profile, loading: false });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUp: async ({ email, password, username, role }) => {
    try {
      set({ loading: true, error: null });

      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('Username already taken');
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, role }
        }
      });

      if (error) throw error;
      set({ loading: false });
    } catch (error) {
      console.error('Error signing up:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      // First clear the local state
      set({ profile: null });
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Reset the entire store state
      set({ profile: null, loading: false, error: null, initialized: false });
      
      // Force a page reload to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      set({ error: error.message, loading: false });
    }
  },

  setProfile: (profile) => set({ profile }),
  isCoach: () => get().profile?.role === 'coach',
  isAthlete: () => get().profile?.role === 'athlete'
}));