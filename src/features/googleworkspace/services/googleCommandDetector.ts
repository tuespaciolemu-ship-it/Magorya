// src/features/googleworkspace/services/googleCommandDetector.ts
// Detector y ejecutor de comandos de Google Workspace en el chat

import {
  listEvents,
  createEvent,
  formatDateForDisplay
} from './calendarService'

import {
  listEmails,
  sendEmail,
  formatDateForEmail,
  type EmailDetail
} from './gmailService'

import {
  listFiles,
  uploadFile,
  createFolder,
  searchFiles,
  getShareLink,
  formatFileSize,
  getFileIcon
} from './driveService'

import {
  createDoc,
  createSheet,
  getDocUrl,
  getSheetUrl
} from './docsSheetsService'

import {
  getGoogleAuthState,
  getGoogleAuthURL
} from './googleOAuthService'

export interface CommandResult {
  response: string
  data?: any
}

/**
 * Detectar y ejecutar comandos de Google Workspace
 */
export async function detectAndExecuteGoogleCommand(
  input: string
): Promise<CommandResult | null> {

  const lowerInput = input.toLowerCase().trim()

  // =================== CALENDARIO ===================
  if (lowerInput.includes('calendario') || lowerInput.includes('eventos') || lowerInput.includes('agenda')) {
    if (lowerInput.includes('ver') || lowerInput.includes('mostrar') || lowerInput.includes('listar')) {
      return await handleListCalendar()
    }

    if (lowerInput.includes('crear') || lowerInput.includes('nuevo')) {
      return await handleCreateEvent(input)
    }
  }

  // =================== GMAIL ===================
  if (lowerInput.includes('email') || lowerInput.includes('correo') || lowerInput.includes('mail')) {
    if (lowerInput.includes('ver') || lowerInput.includes('mostrar') || lowerInput.includes('listar') || lowerInput.includes('tengo')) {
      return await handleListEmails()
    }

    if (lowerInput.includes('enviar') || lowerInput.includes('manda') || lowerInput.includes('escribir')) {
      return await handleSendEmail(input)
    }
  }

  // =================== DRIVE ===================
  if (lowerInput.includes('archivos') || lowerInput.includes('drive')) {
    if (lowerInput.includes('ver') || lowerInput.includes('mostrar') || lowerInput.includes('listar')) {
      return await handleListFiles()
    }

    if (lowerInput.includes('subir')) {
      return await handleUploadFile(input)
    }

    if (lowerInput.includes('carpeta')) {
      return await handleCreateFolder(input)
    }

    if (lowerInput.includes('buscar')) {
      return await handleSearchFiles(input)
    }
  }

  // =================== DOCS ===================
  if (lowerInput.includes('documento') || lowerInput.includes('doc')) {
    if (lowerInput.includes('crear') || lowerInput.includes('nuevo')) {
      return await handleCreateDoc(input)
    }
  }

  // =================== SHEETS ===================
  if (lowerInput.includes('hoja') || lowerInput.includes('sheet') || lowerInput.includes('excel')) {
    if (lowerInput.includes('crear') || lowerInput.includes('nuevo')) {
      return await handleCreateSheet(input)
    }
  }

  return null
}

// =================== HANDLERS ===================

async function handleListCalendar(): Promise<CommandResult> {
  try {
    const events = await listEvents('primary', new Date(), 5)

    if (events.length === 0) {
      return {
        response: '📅 No tienes eventos próximos en tu calendario.'
      }
    }

    const eventList = events
      .filter(e => e.summary)
      .map(event => {
        const date = formatDateForDisplay(event)
        const time = event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
          : ''
        return `• ${event.summary}${time ? ` a las ${time}` : ''} - ${date}`
      })
      .join('\n')

    return {
      response: `📅 Tus próximos eventos:\n\n${eventList}`
    }
  } catch (error: any) {
    return {
      response: `❌ Error: ${error.message}`
    }
  }
}

async function handleCreateEvent(input: string): Promise<CommandResult> {
  try {
    // Extraer título del evento
    const tituloMatch = input.match(/crear?\s+(?:evento\s+)?"?([^"]+)"?/i) ||
                       input.match(/evento\s+:\s*(.+)/i)

    if (!tituloMatch) {
      return {
        response: '📅 ¿Qué título quieres para el evento? Ejemplo: "Crear evento Reunión de trabajo mañana a las 10am"'
      }
    }

    const titulo = tituloMatch[1].trim()

    // Crear evento para mañana a las 10am (default)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)

    const dayAfter = new Date(tomorrow)
    dayAfter.setHours(11, 0, 0, 0)

    const event = await createEvent({
      summary: titulo,
      start: tomorrow,
      end: dayAfter
    })

    return {
      response: `✅ Evento creado:\n📅 "${titulo}"\n🕐 Mañana a las 10:00 AM\n\n${getDocUrl(event.id)}`.replace('docs.google.com/document', 'calendar.google.com/event')
    }

  } catch (error: any) {
    return {
      response: `❌ Error: ${error.message}`
    }
  }
}

async function handleListEmails(): Promise<CommandResult> {
  try {
    const messages = await listEmails(5)

    if (messages.length === 0) {
      return {
        response: '📧 No tienes emails recientes.'
      }
    }

    const emailList = messages.map((msg, i) => {
      return `${i + 1}. ${msg.snippet || 'Sin asunto'}`
    }).join('\n\n')

    return {
      response: `📧 Tienes ${messages.length} emails recientes:\n\n${emailList}`
    }

  } catch (error: any) {
    return {
      response: `❌ Error: ${error.message}`
    }
  }
}

async function handleSendEmail(input: string): Promise<CommandResult> {
  try {
    // Extraer destinatario
    const toMatch = input.match(/a\s+(\S+@\S+)/i) ||
                   input.match(/para\s+(\S+@\S+)/i)

    if (!toMatch) {
      return {
        response: '📧 ¿A qué email quieres enviar? Ejemplo: "Enviar email a juan@gmail.com con el asunto Hola"'
      }
    }

    const to = toMatch[1]

    const email = await sendEmail({
      to,
      subject: 'Mensaje desde Magorya ✨',
      body: input
    })

    return {
      response: `✅ Email enviado a ${to} 📧`
    }

  } catch (error: any) {
    return {
      response: `❌ Error: ${error.message}`
    }
  }
}

async function handleListFiles(): Promise<CommandResult> {
  try {
    const files = await listFiles(10)

    if (files.length === 0) {
      return {
        response: '📁 No tienes archivos recientes en Drive.'
      }
    }

    const fileList = files.map(file => {
      const icon = getFileIcon(file.mimeType)
      const size = file.size ? formatFileSize(file.size) : ''
      const shared = file.shared ? ' 🔗' : ''
      return `${icon} ${file.name}${shared}${size ? ` (${size})` : ''}`
    }).join('\n')

    return {
      response: `📁 Tus archivos recientes:\n\n${fileList}`
    }

  } catch (error: any) {
    return {
      response: `❌ Error: ${error.message}`
    }
  }
}

async function handleUploadFile(input: string): Promise<CommandResult> {
  return {
    response: '📁 Para subir archivos, puedes arrastrarlos al chat o usar el botón 📁. Luego te ayudo a organizarlos en Drive. ✨'
  }
}

async function handleCreateFolder(input: string): Promise<CommandResult> {
  try {
    const nombreMatch = input.match(/carpeta\s+(?:llamada\s+)?"?([^"]+)"?/i) ||
                       input.match(/crear\s+carpeta\s+(.+)/i)

    if (!nombreMatch) {
      return {
        response: '📁 ¿Qué nombre quieres para la carpeta? Ejemplo: "Crear carpeta llamada Mis documentos"'
      }
    }

    const nombre = nombreMatch[1].trim()

    const folder = await createFolder(nombre)

    return {
      response: `✅ Carpeta creada:\n📁 "${nombre}"\n\n${getShareLink(folder.id)}`
    }

  } catch (error: any) {
    return {
      response: `❌ Error: ${error.message}`
    }
  }
}

async function handleSearchFiles(input: string): Promise<CommandResult> {
  try {
    // Extraer término de búsqueda
    const searchMatch = input.match(/buscar\s+(?:archivos?\s+)?(?:de\s+)?(.+)/i) ||
                       input.match(/search\s+(.+)/i)

    if (!searchMatch) {
      return {
        response: '🔍 ¿Qué quieres buscar? Ejemplo: "Buscar archivos de fotos"'
      }
    }

    const query = searchMatch[1].trim()

    const files = await searchFiles(query, 10)

    if (files.length === 0) {
      return {
        response: `🔍 No encontré archivos con "${query}"`
      }
    }

    const fileList = files.map(file => {
      const icon = getFileIcon(file.mimeType)
      return `${icon} ${file.name}`
    }).join('\n')

    return {
      response: `🔍 ${files.length} archivos encontrados con "${query}":\n\n${fileList}`
    }

  } catch (error: any) {
    return {
      response: `❌ Error: ${error.message}`
    }
  }
}

async function handleCreateDoc(input: string): Promise<CommandResult> {
  try {
    const tituloMatch = input.match(/documento\s+(?:llamado\s+)?"?([^"]+)"?/i) ||
                       input.match(/crear?\s+doc\s+(.+)/i)

    if (!tituloMatch) {
      return {
        response: '📝 ¿Qué título quieres para el documento? Ejemplo: "Crear documento llamado Notas de reunión"'
      }
    }

    const titulo = tituloMatch[1].trim()

    const doc = await createDoc({ title: titulo })

    return {
      response: `✅ Documento creado:\n📝 "${titulo}"\n\n${getDocUrl(doc.documentId)}`
    }

  } catch (error: any) {
    return {
      response: `❌ Error: ${error.message}`
    }
  }
}

async function handleCreateSheet(input: string): Promise<CommandResult> {
  try {
    const tituloMatch = input.match(/hoja\s+(?:llamada\s+)?"?([^"]+)"?/i) ||
                       input.match(/crear?\s+sheet\s+(.+)/i) ||
                       input.match(/crear?\s+(?:tabla|excel)\s+(.+)/i)

    if (!tituloMatch) {
      return {
        response: '📊 ¿Qué título quieres para la hoja de cálculo? Ejemplo: "Crear hoja llamada Presupuesto"'
      }
    }

    const titulo = tituloMatch[1].trim()

    const sheet = await createSheet({ title: titulo })

    return {
      response: `✅ Hoja de cálculo creada:\n📊 "${titulo}"\n\n${getSheetUrl(sheet.spreadsheetId)}`
    }

  } catch (error: any) {
    return {
      response: `❌ Error: ${error.message}`
    }
  }
}

/**
 * Verificar si Google está conectado
 */
export async function isGoogleConnected(): Promise<boolean> {
  const state = await getGoogleAuthState()
  return state.connected
}

/**
 * Obtener URL para conectar Google
 */
export function getConnectGoogleURL(): string {
  return getGoogleAuthURL()
}
