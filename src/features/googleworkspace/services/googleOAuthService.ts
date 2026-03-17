// src/features/googleworkspace/services/googleOAuthService.ts
// Servicio de OAuth 2.0 para Google Workspace

import { createClient } from '@/lib/supabase/client'

// Sc necesarios para Google Workspace
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets'
]

interface GoogleTokens {
  access_token: string
  refresh_token: string
  expiry_date: number
}

interface GoogleAuthState {
  connected: boolean
  email: string | null
}

/**
 * Generar URL de autorización OAuth
 */
export function getGoogleAuthURL(): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${window.location.origin}/api/auth/google/callback`

  if (!clientId) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID no está configurado')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent'
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * Guardar tokens en Supabase
 */
export async function saveGoogleTokens(tokens: GoogleTokens, email?: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuario no autenticado')
  }

  // Guardar tokens en la tabla profiles
  const { error } = await supabase
    .from('profiles')
    .update({
      google_access_token: tokens.access_token,
      google_refresh_token: tokens.refresh_token,
      google_token_expiry: new Date(tokens.expiry_date).toISOString(),
      google_email: email || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    throw error
  }
}

/**
 * Obtener tokens guardados
 */
export async function getGoogleTokens(): Promise<GoogleTokens | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data } = await supabase
    .from('profiles')
    .select('google_access_token, google_refresh_token, google_token_expiry')
    .eq('id', user.id)
    .single()

  if (!data || !data.google_access_token) {
    return null
  }

  return {
    access_token: data.google_access_token,
    refresh_token: data.google_refresh_token,
    expiry_date: new Date(data.google_token_expiry).getTime()
  }
}

/**
 * Verificar si el token expiró y renovar si es necesario
 */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getGoogleTokens()

  if (!tokens) {
    return null
  }

  // Si el token aún es válido (con margen de 5 minutos)
  if (tokens.expiry_date > Date.now() + 5 * 60 * 1000) {
    return tokens.access_token
  }

  // Token expirado, renovar usando refresh_token
  return await refreshAccessToken(tokens.refresh_token)
}

/**
 * Renovar access token usando refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('Credenciales de Google no configuradas')
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    })

    if (!response.ok) {
      throw new Error('Error al renovar token')
    }

    const data = await response.json()

    const newTokens: GoogleTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      expiry_date: Date.now() + data.expires_in * 1000
    }

    await saveGoogleTokens(newTokens)

    return newTokens.access_token

  } catch (error) {
    console.error('Error renovando token:', error)
    return null
  }
}

/**
 * Verificar estado de autenticación con Google
 */
export async function getGoogleAuthState(): Promise<GoogleAuthState> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { connected: false, email: null }
  }

  const { data } = await supabase
    .from('profiles')
    .select('google_email, google_access_token')
    .eq('id', user.id)
    .single()

  return {
    connected: !!data?.google_access_token,
    email: data?.google_email || null
  }
}

/**
 * Desconectar Google (eliminar tokens)
 */
export async function disconnectGoogle(): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuario no autenticado')
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      google_access_token: null,
      google_refresh_token: null,
      google_token_expiry: null,
      google_email: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    throw error
  }
}
