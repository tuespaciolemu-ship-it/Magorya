// src/app/api/telegram/webhook/route.ts
// Webhook para recibir updates de Telegram Bot

import { NextRequest, NextResponse } from 'next/server'
import { type TelegramUpdate } from '@/features/telegram/types/telegramTypes'
import { handleTelegramMessage } from '@/features/telegram/services/telegramMagoryaService'
import { answerCallbackQuery } from '@/features/telegram/services/telegramService'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
// Token secreto para validar el webhook (opcional pero recomendado)
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET

/**
 * POST /api/telegram/webhook
 * Recibe updates de Telegram
 */
export async function POST(request: NextRequest) {
  try {
    // Validar token si está configurado
    if (WEBHOOK_SECRET) {
      const authHeader = request.headers.get('x-telegram-bot-api-secret-token')
      if (authHeader !== WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await request.json() as TelegramUpdate

    // Procesar update
    await processUpdate(body)

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

/**
 * GET /api/telegram/webhook
 * Para verificar que el webhook está funcionando
 */
export async function GET() {
  return NextResponse.json({
    status: 'webhook active',
    bot: TELEGRAM_BOT_TOKEN ? 'configured' : 'not configured'
  })
}

/**
 * Procesar update de Telegram
 */
async function processUpdate(update: TelegramUpdate): Promise<void> {
  // Mensaje
  if (update.message) {
    const { chat, from, text } = update.message

    // Guardar nombre del usuario
    const userName = from.first_name

    // Si hay texto, procesarlo
    if (text) {
      await handleTelegramMessage(chat.id, text, userName)
    } else {
      // Si no hay texto, es multimedia (foto, documento, etc.)
      await handleMultimedia(update.message)
    }
  }

  // Callback query (botones inline)
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query)
  }
}

/**
 * Manejar mensajes multimedia
 */
async function handleMultimedia(message: any): Promise<void> {
  const { chat, photo, document, voice, video, audio } = message

  let responseText = ''

  if (photo) {
    responseText = '¡Qué foto tan bonita! 📷✨'
  } else if (document) {
    responseText = `¡Documento recibido: ${document.file_name || 'Sin nombre'}! 📄✨`
  } else if (voice) {
    responseText = '¡Escuché tu nota de voz! 🎙️✨'
  } else if (video) {
    responseText = '¡Video recibido! 🎥✨'
  } else if (audio) {
    responseText = '¡Audio recibido! 🎵✨'
  } else {
    responseText = '¡Gracias por compartir! ✨'
  }

  await handleTelegramMessage(chat.id, responseText)
}

/**
 * Manejar callback queries (botones)
 */
async function handleCallbackQuery(callbackQuery: any): Promise<void> {
  const { id, data, message } = callbackQuery
  const chatId = message?.chat.id

  if (!chatId) return

  let responseText = ''

  switch (data) {
    case 'google_calendar':
      responseText = '📅 Para ver tu calendario, escribe "ver calendario"'
      break

    case 'google_emails':
      responseText = '📧 Para ver tus emails, escribe "ver emails"'
      break

    case 'google_drive':
      responseText = '📁 Para ver tus archivos, escribe "ver archivos"'
      break

    case 'google_docs':
      responseText = '📝 Para crear un documento, escribe "crear documento [nombre]"'
      break

    case 'back_to_menu':
      // No hacer nada, el usuario puede escribir directamente
      await answerCallbackQuery(id)
      return

    default:
      responseText = '¡Opción recibida! ✨'
  }

  await answerCallbackQuery(id, responseText, false)

  if (responseText) {
    await handleTelegramMessage(chatId, responseText)
  }
}
