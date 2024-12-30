export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          role: 'coach' | 'athlete'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          role: 'coach' | 'athlete'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          role?: 'coach' | 'athlete'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}