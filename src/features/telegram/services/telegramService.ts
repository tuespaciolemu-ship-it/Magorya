// src/features/telegram/services/telegramService.ts
// Servicio para interactuar con la API de Telegram Bot

import type {
  SendMessageParams,
  SendPhotoParams,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  TelegramUser
} from '../types/telegramTypes'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

if (!TELEGRAM_BOT_TOKEN) {
  console.warn('TELEGRAM_BOT_TOKEN no está configurado')
}

/**
 * Obtener información del bot
 */
export async function getMe(): Promise<TelegramUser | null> {
  if (!TELEGRAM_BOT_TOKEN) return null

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getMe`)
    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Error al obtener info del bot')
    }

    return data.result
  } catch (error) {
    console.error('Error en getMe:', error)
    return null
  }
}

/**
 * Establecer webhook
 */
export async function setWebhook(url: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Error al establecer webhook')
    }

    return true
  } catch (error) {
    console.error('Error en setWebhook:', error)
    return false
  }
}

/**
 * Obtener información del webhook
 */
export async function getWebhookInfo(): Promise<any> {
  if (!TELEGRAM_BOT_TOKEN) return null

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getWebhookInfo`)
    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Error al obtener webhook info')
    }

    return data.result
  } catch (error) {
    console.error('Error en getWebhookInfo:', error)
    return null
  }
}

/**
 * Eliminar webhook
 */
export async function deleteWebhook(): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/deleteWebhook`)
    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Error al eliminar webhook')
    }

    return true
  } catch (error) {
    console.error('Error en deleteWebhook:', error)
    return false
  }
}

/**
 * Enviar mensaje de texto
 */
export async function sendMessage(params: SendMessageParams): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Error al enviar mensaje')
    }

    return true
  } catch (error) {
    console.error('Error en sendMessage:', error)
    return false
  }
}

/**
 * Enviar foto
 */
export async function sendPhoto(params: SendPhotoParams): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false

  try {
    let body: any = {
      chat_id: params.chat_id,
      photo: params.photo
    }

    if (params.caption) {
      body.caption = params.caption
    }

    if (params.parse_mode) {
      body.parse_mode = params.parse_mode
    }

    const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Error al enviar foto')
    }

    return true
  } catch (error) {
    console.error('Error en sendPhoto:', error)
    return false
  }
}

/**
 * Enviar documento
 */
export async function sendDocument(
  chatId: number | string,
  document: string,
  caption?: string
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false

  try {
    const body: any = {
      chat_id: chatId,
      document: document
    }

    if (caption) {
      body.caption = caption
    }

    const response = await fetch(`${TELEGRAM_API_URL}/sendDocument`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Error al enviar documento')
    }

    return true
  } catch (error) {
    console.error('Error en sendDocument:', error)
    return false
  }
}

/**
 * Enviar acción de "escribiendo..."
 */
export async function sendChatAction(
  chatId: number | string,
  action: 'typing' | 'upload_photo' | 'record_video' | 'upload_video' | 'record_audio' | 'upload_audio' | 'find_location' = 'typing'
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        action: action
      })
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Error al enviar acción')
    }

    return true
  } catch (error) {
    console.error('Error en sendChatAction:', error)
    return false
  }
}

/**
 * Responder a un callback query
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert?: boolean
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false

  try {
    const body: any = {
      callback_query_id: callbackQueryId
    }

    if (text) {
      body.text = text
    }

    if (showAlert !== undefined) {
      body.show_alert = showAlert
    }

    const response = await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Error al responder callback')
    }

    return true
  } catch (error) {
    console.error('Error en answerCallbackQuery:', error)
    return false
  }
}

/**
 * Crear teclado inline
 */
export function createInlineKeyboard(buttons: { text: string; callback_data?: string; url?: string }[][]): InlineKeyboardMarkup {
  return {
    inline_keyboard: buttons.map(row =>
      row.map(btn => ({
        text: btn.text,
        ...(btn.callback_data && { callback_data: btn.callback_data }),
        ...(btn.url && { url: btn.url })
      }))
    )
  }
}

/**
 * Crear teclado de reply
 */
export function createReplyKeyboard(buttons: string[][], resize: boolean = true): ReplyKeyboardMarkup {
  return {
    keyboard: buttons.map(row => row.map(text => ({ text }))),
    resize_keyboard: resize,
    one_time_keyboard: false
  }
}
