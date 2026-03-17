// src/types/database.ts
// Tipos generados para Supabase

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
          email: string | null
          full_name: string | null
          avatar_url: string | null
          genero: 'mujer' | 'hombre' | 'otro'
          nombre_hada: string
          google_access_token: string | null
          google_refresh_token: string | null
          google_token_expiry: string | null
          google_email: string | null
          google_picture: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          genero?: 'mujer' | 'hombre' | 'otro'
          nombre_hada?: string
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_token_expiry?: string | null
          google_email?: string | null
          google_picture?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          genero?: 'mujer' | 'hombre' | 'otro'
          nombre_hada?: string
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_token_expiry?: string | null
          google_email?: string | null
          google_picture?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          titulo: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          titulo?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          titulo?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          titulo: string
          descripcion: string | null
          completado: boolean
          etiquetas: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          titulo: string
          descripcion?: string | null
          completado?: boolean
          etiquetas?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          titulo?: string
          descripcion?: string | null
          completado?: boolean
          etiquetas?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Export tipos individuales para facilitar imports
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
