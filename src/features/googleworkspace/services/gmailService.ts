// src/features/googleworkspace/services/gmailService.ts
// Servicio para Google Gmail API

import { getValidAccessToken } from './googleOAuthService'

// Interfaces
export interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  payload: {
    headers?: Array<{ name: string; value: string }>
    parts?: any[]
  }
  internalDate: string
}

export interface EmailDetail {
  id: string
  threadId: string
  subject: string
  from: string
  to: string
  date: string
  body: string
  snippet: string
}

export interface SendEmailParams {
  to: string
  subject: string
  body: string
  cc?: string[]
  bcc?: string[]
}

/**
 * Listar emails
 */
export async function listEmails(maxResults: number = 10, labelIds: string[] = ['INBOX']): Promise<GmailMessage[]> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const params = new URLSearchParams({
    maxResults: maxResults.toString(),
    labelIds: labelIds.join(',')
  })

  const response = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al listar emails')
  }

  const data = await response.json()
  return data.messages || []
}

/**
 * Obtener detalle completo de un email
 */
export async function getEmail(messageId: string): Promise<EmailDetail> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const response = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al obtener email')
  }

  const message = await response.json()
  return parseEmail(message)
}

/**
 * Enviar email
 */
export async function sendEmail(params: SendEmailParams): Promise<string> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  // Crear email en formato RFC 2822
  const email = [
    `To: ${params.to}`,
    params.cc ? `Cc: ${params.cc.join(', ')}` : '',
    params.bcc ? `Bcc: ${params.bcc.join(', ')}` : '',
    `Subject: ${params.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    '',
    params.body
  ].filter(line => line !== '').join('\r\n')

  // Codificar en base64url
  const encodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const response = await fetch(
    'https://www.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: encodedEmail
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al enviar email')
  }

  const data = await response.json()
  return data.id
}

/**
 * Buscar emails
 */
export async function searchEmails(query: string, maxResults: number = 10): Promise<GmailMessage[]> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const params = new URLSearchParams({
    q: query,
    maxResults: maxResults.toString()
  })

  const response = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/messages/search?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al buscar emails')
  }

  const data = await response.json()
  return data.messages || []
}

/**
 * Parsear email de formato Gmail a formato legible
 */
function parseEmail(message: any): EmailDetail {
  const headers = message.payload.headers || []
  const getHeader = (name: string) => {
    const header = headers.find((h: any) => h.name === name)
    return header ? header.value : ''
  }

  const subject = getHeader('Subject') || 'Sin asunto'
  const from = getHeader('From') || 'Desconocido'
  const to = getHeader('To') || ''
  const date = getHeader('Date') || ''
  const body = extractBody(message.payload)

  return {
    id: message.id,
    threadId: message.threadId,
    subject,
    from,
    to,
    date,
    body,
    snippet: message.snippet || ''
  }
}

/**
 * Extraer cuerpo del email (texto plano)
 */
function extractBody(payload: any): string {
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8')
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8')
      }
      if (part.parts) {
        const nestedBody = extractBody(part)
        if (nestedBody) return nestedBody
      }
    }
  }

  return ''
}

/**
 * Formatear fecha para mostrar
 */
export function formatDateForEmail(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Ayer'
  } else if (diffDays < 7) {
    return date.toLocaleDateString('es-ES', { weekday: 'long' })
  } else {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }
}
