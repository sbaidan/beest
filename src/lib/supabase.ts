import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage // Explicitly set storage
  }
});

// Retry logic with exponential backoff
export async function fetchWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on auth errors
      if (error?.message?.includes('JWT')) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = initialDelay * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
      
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Helper to check if error is network related
export function isNetworkError(error: any): boolean {
  return (
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('Network request failed') ||
    error?.name === 'TypeError'
  );
}