import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthResponse<T> {
  data: T | null;
  error: AuthError | null;
}

export class AuthService {
  private static instance: AuthService;
  private currentSession: Session | null = null;
  private sessionChangeCallbacks: Set<(session: Session | null) => void> = new Set();

  private constructor() {
    supabase.auth.onAuthStateChange((_, session) => {
      this.currentSession = session;
      this.sessionChangeCallbacks.forEach(callback => callback(session));
    });
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async initialize(): Promise<AuthResponse<Session>> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      this.currentSession = session;
      return { data: session, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  async signOut(): Promise<AuthResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
      
      this.currentSession = null;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  onSessionChange(callback: (session: Session | null) => void): () => void {
    this.sessionChangeCallbacks.add(callback);
    return () => this.sessionChangeCallbacks.delete(callback);
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return !!this.currentSession?.user;
  }
}

export const authService = AuthService.getInstance();