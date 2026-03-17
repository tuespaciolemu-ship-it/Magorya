// src/features/googleworkspace/services/calendarService.ts
// Servicio para Google Calendar API

import { getValidAccessToken } from './googleOAuthService'

// Interfaces
export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  location?: string
  attendees?: Array<{ email: string; displayName?: string }>
}

export interface CreateEventParams {
  summary: string
  description?: string
  start: Date | string
  end: Date | string
  location?: string
  attendees?: string[]
}

/**
 * Listar eventos del calendario
 */
export async function listEvents(
  calendarId: string = 'primary',
  timeMin?: Date,
  maxResults: number = 10
): Promise<CalendarEvent[]> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const params = new URLSearchParams({
    maxResults: maxResults.toString(),
    orderBy: 'startTime',
    singleEvents: 'true'
  })

  if (timeMin) {
    params.set('timeMin', timeMin.toISOString())
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al listar eventos')
  }

  const data = await response.json()
  return data.items || []
}

/**
 * Crear nuevo evento
 */
export async function createEvent(params: CreateEventParams): Promise<CalendarEvent> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const event = {
    summary: params.summary,
    description: params.description,
    location: params.location,
    start: formatDateForAPI(params.start),
    end: formatDateForAPI(params.end),
    attendees: params.attendees?.map(email => ({ email }))
  }

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al crear evento')
  }

  return await response.json()
}

/**
 * Actualizar evento existente
 */
export async function updateEvent(
  eventId: string,
  updates: Partial<CreateEventParams>
): Promise<CalendarEvent> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const event: any = {}

  if (updates.summary) event.summary = updates.summary
  if (updates.description) event.description = updates.description
  if (updates.location) event.location = updates.location
  if (updates.start) event.start = formatDateForAPI(updates.start)
  if (updates.end) event.end = formatDateForAPI(updates.end)

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al actualizar evento')
  }

  return await response.json()
}

/**
 * Eliminar evento
 */
export async function deleteEvent(eventId: string): Promise<void> {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Conecta tu cuenta de Google.')
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Error al eliminar evento')
  }
}

/**
 * Formatear fecha para API de Google Calendar
 */
function formatDateForAPI(date: Date | string): { dateTime: string } | { date: string } {
  const d = typeof date === 'string' ? new Date(date) : date

  // Si es hora específica
  if (d.getHours() !== 0 || d.getMinutes() !== 0) {
    return { dateTime: d.toISOString() }
  }

  // Si es todo el día
  return { date: d.toISOString().split('T')[0] }
}

/**
 * Formatear fecha para mostrar
 */
export function formatDateForDisplay(event: CalendarEvent): string {
  if (event.start.dateTime) {
    const date = new Date(event.start.dateTime)
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (event.start.date) {
    const date = new Date(event.start.date)
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return 'Sin fecha'
}
