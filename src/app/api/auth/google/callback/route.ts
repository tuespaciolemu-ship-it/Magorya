// src/app/api/auth/google/callback/route.ts
// Callback de OAuth 2.0 de Google

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    // Usuario canceló o hubo error
    redirect('/?google_auth=error')
  }

  if (!code) {
    redirect('/?google_auth=error')
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI

    if (!clientId || !clientSecret) {
      throw new Error('Credenciales de Google no configuradas')
    }

    // Intercambiar code por tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri || '',
        grant_type: 'authorization_code'
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Error al obtener tokens')
    }

    const tokens = await tokenResponse.json()

    // Obtener info del usuario de Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    })

    if (!userInfoResponse.ok) {
      throw new Error('Error al obtener info del usuario')
    }

    const userInfo = await userInfoResponse.json()

    // Guardar tokens en Supabase
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Si no hay usuario de Supabase, crear uno temporal con email de Google
      // Esto es opcional - depende de tu flujo de auth
      redirect('/?google_auth=no_supabase_user')
    }

    // Guardar tokens en profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        google_token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        google_email: userInfo.email,
        google_picture: userInfo.picture,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    redirect('/?google_auth=success')

  } catch (error) {
    console.error('Error en callback de Google:', error)
    redirect('/?google_auth=error')
  }
}
