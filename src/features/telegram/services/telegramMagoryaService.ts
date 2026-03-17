// src/features/telegram/services/telegramMagoryaService.ts
// Servicio para integrar Magorya AI con Telegram Bot

import { chatWithOpenRouter } from '@/lib/openrouter/client'
import { getSystemPrompt } from '@/features/ai/prompts/systemPrompt'
import {
  sendMessage,
  sendChatAction,
  createInlineKeyboard,
  createReplyKeyboard
} from './telegramService'
import {
  detectAndExecuteGoogleCommand
} from '@/features/googleworkspace/services'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Estado de conversaciones por chat_id
const conversationState = new Map<number, {
  messages: ChatMessage[]
  userName?: string
  waitingForInput?: string
}>()

/**
 * Manejar mensaje de Telegram y responder con Magorya
 */
export async function handleTelegramMessage(
  chatId: number,
  text: string,
  userName?: string
): Promise<void> {

  // Iniciar acción de "escribiendo..."
  await sendChatAction(chatId, 'typing')

  // Obtener o crear estado de conversación
  let state = conversationState.get(chatId)
  if (!state) {
    state = { messages: [], userName }
    conversationState.set(chatId, state)
  }

  // Verificar si es un comando
  if (text.startsWith('/')) {
    await handleCommand(chatId, text, state)
    return
  }

  // Verificar si es comando de Google Workspace
  const googleResult = await detectAndExecuteGoogleCommand(text)
  if (googleResult) {
    await sendMessage({
      chat_id: chatId,
      text: googleResult.response,
      parse_mode: 'Markdown'
    })
    return
  }

  // Respuesta normal con Magorya AI
  state.messages.push({ role: 'user', content: text })

  try {
    const systemPrompt = getSystemPrompt(state.userName)

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...state.messages.slice(-10) // Últimos 10 mensajes
    ]

    const response = await chatWithOpenRouter(messages)

    state.messages.push({ role: 'assistant', content: response })

    await sendMessage({
      chat_id: chatId,
      text: response,
      parse_mode: 'Markdown'
    })

  } catch (error) {
    console.error('Error en chat:', error)
    await sendMessage({
      chat_id: chatId,
      text: '¡Ay! Ocurrió un error 💛\n\nInténtalo de nuevo.'
    })
  }
}

/**
 * Manejar comandos de Telegram
 */
async function handleCommand(
  chatId: number,
  text: string,
  state: { messages: ChatMessage[]; userName?: string }
): Promise<void> {

  const [command, ...args] = text.split(' ')
  const commandLower = command.toLowerCase()

  switch (commandLower) {
    case '/start':
      await handleStart(chatId, state)
      break

    case '/ayuda':
    case '/help':
      await handleHelp(chatId)
      break

    case '/proyectos':
      await handleProjects(chatId)
      break

    case '/limpiar':
      await handleClear(chatId, state)
      break

    case '/google':
      await handleGoogleMenu(chatId)
      break

    case '/calendario':
      await handleCalendarCommand(chatId, args.join(' '))
      break

    case '/emails':
      await handleEmailsCommand(chatId)
      break

    case '/archivos':
      await handleFilesCommand(chatId)
      break

    default:
      await sendMessage({
        chat_id: chatId,
        text: '❌ Comando no reconocido.\n\nUsa /ayuda para ver los comandos disponibles.'
      })
  }
}

/**
 * Comando /start
 */
async function handleStart(chatId: number, state: { userName?: string }): Promise<void> {
  const name = state.userName || 'amigo/a'

  await sendMessage({
    chat_id: chatId,
    text: `¡Hola, ${name}! 🧚‍♀️✨\n\nSoy *Magorya*, tu asistente mágica con psicopedagogía.\n\n¿Qué puedo hacer por ti hoy?`,
    parse_mode: 'Markdown',
    reply_markup: createReplyKeyboard([
      ['📅 Calendario', '📧 Emails'],
      ['📁 Archivos', '🎨 Imagen'],
      ['💡 Consejo', '❓ Ayuda']
    ])
  })
}

/**
 * Comando /ayuda
 */
async function handleHelp(chatId: number): Promise<void> {
  await sendMessage({
    chat_id: chatId,
    text: `*🧚 Magorya - Comandos Disponibles*\n\n*Comandos básicos:*\n/start - Iniciar el bot\n/ayuda - Ver esta ayuda\n/limpiar - Limpiar conversación\n\n*Google Workspace:*\n/google - Menú de Google\n/calendario - Ver eventos\n/emails - Ver emails\n/archivos - Ver archivos\n\n*Comandos de chat:*\n• "Ver calendario" - Mostrar eventos\n• "Enviar email a..." - Enviar correo\n• "Crear documento..." - Crear Google Doc\n• "Mis archivos" - Ver Drive\n\n*Proyectos:*\n/proyectos - Ver tus proyectos\n\n💛 ¡Escribe cualquier cosa y conversaremos!`,
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  })
}

/**
 * Comando /proyectos
 */
async function handleProjects(chatId: number): Promise<void> {
  await sendMessage({
    chat_id: chatId,
    text: `📁 *Mis Proyectos*\n\nEste es un espacio para organizar tus tareas.\n\nPara crear un proyecto, simplemente escribe:\n"Crear proyecto [nombre]"\n\nPara completar un proyecto:\n"Completar proyecto [número]"\n\n💛 ¡Organicémonos!`,
    parse_mode: 'Markdown'
  })
}

/**
 * Comando /limpiar
 */
async function handleClear(chatId: number, state: { messages: ChatMessage[] }): Promise<void> {
  state.messages = []
  conversationState.delete(chatId)

  await sendMessage({
    chat_id: chatId,
    text: `🧹 Memoria limpiada ✨\n\nNuestra conversación empieza de nuevo. ¡Cuéntame, ¿en qué te puedo ayudar?`
  })
}

/**
 * Comando /google - Menú de Google
 */
async function handleGoogleMenu(chatId: number): Promise<void> {
  await sendMessage({
    chat_id: chatId,
    text: `🔗 *Google Workspace*\n\n¿Qué deseas hacer?`,
    parse_mode: 'Markdown',
    reply_markup: createInlineKeyboard([
      [
        { text: '📅 Calendario', callback_data: 'google_calendar' },
        { text: '📧 Emails', callback_data: 'google_emails' }
      ],
      [
        { text: '📁 Drive', callback_data: 'google_drive' },
        { text: '📝 Docs', callback_data: 'google_docs' }
      ],
      [
        { text: '⬅️ Volver', callback_data: 'back_to_menu' }
      ]
    ])
  })
}

/**
 * Comando /calendario
 */
async function handleCalendarCommand(chatId: number, args: string): Promise<void> {
  const googleResult = await detectAndExecuteGoogleCommand('ver calendario')

  if (googleResult) {
    await sendMessage({
      chat_id: chatId,
      text: googleResult.response,
      parse_mode: 'Markdown'
    })
  }
}

/**
 * Comando /emails
 */
async function handleEmailsCommand(chatId: number): Promise<void> {
  const googleResult = await detectAndExecuteGoogleCommand('ver emails')

  if (googleResult) {
    await sendMessage({
      chat_id: chatId,
      text: googleResult.response,
      parse_mode: 'Markdown'
    })
  }
}

/**
 * Comando /archivos
 */
async function handleFilesCommand(chatId: number): Promise<void> {
  const googleResult = await detectAndExecuteGoogleCommand('ver archivos')

  if (googleResult) {
    await sendMessage({
      chat_id: chatId,
      text: googleResult.response,
      parse_mode: 'Markdown'
    })
  }
}

/**
 * Obtener estado de una conversación
 */
export function getConversationState(chatId: number) {
  return conversationState.get(chatId)
}

/**
 * Limpiar estado de una conversación
 */
export function clearConversationState(chatId: number) {
  conversationState.delete(chatId)
}
