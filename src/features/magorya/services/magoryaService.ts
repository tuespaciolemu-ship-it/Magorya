// src/features/magorya/services/magoryaService.ts
// Servicios de Supabase para Magorya

import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

// Types
export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  genero: 'mujer' | 'hombre' | 'otro'
  nombre_hada: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  titulo: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  titulo: string
  descripcion: string | null
  completado: boolean
  etiquetas: string[] | null
  created_at: string
  updated_at: string
}

// Conversaciones
export const conversationService = {
  async getAll() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data as Conversation[]
  },

  async create(titulo: string = 'Nueva conversación') {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('conversations')
      .insert({ titulo })
      .select()
      .single()

    if (error) throw error
    return data as Conversation
  },

  async update(id: string, changes: Partial<Conversation>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('conversations')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Conversation
  },

  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Mensajes
export const messageService = {
  async getByConversation(conversationId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as Message[]
  },

  async create(conversationId: string, role: 'user' | 'assistant' | 'system', content: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, role, content })
      .select()
      .single()

    if (error) throw error
    return data as Message
  },

  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Proyectos
export const projectService = {
  async getAll() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data as Project[]
  },

  async create(titulo: string, descripcion?: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .insert({ titulo, descripcion })
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  async update(id: string, changes: Partial<Project>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async toggleCompletado(id: string) {
    const supabase = createClient()
    // First get current state
    const { data: current } = await supabase
      .from('projects')
      .select('completado')
      .eq('id', id)
      .single()

    if (!current) throw new Error('Project not found')

    const { data, error } = await supabase
      .from('projects')
      .update({ completado: !current.completado })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Project
  }
}

// Perfil
export const profileService = {
  async get() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data as Profile
  },

  async update(changes: Partial<Profile>) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .update(changes)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  }
}
