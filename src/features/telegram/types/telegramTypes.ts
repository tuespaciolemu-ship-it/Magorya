// src/features/telegram/types/telegramTypes.ts
// Tipos para la API de Telegram Bot

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

export interface TelegramMessage {
  message_id: number
  from: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  photo?: TelegramPhotoSize[]
  document?: TelegramDocument
  voice?: TelegramVoice
  video?: TelegramVideo
  audio?: TelegramAudio
  contact?: TelegramContact
  location?: TelegramLocation
  entities?: TelegramMessageEntity[]
}

export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramChat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  first_name?: string
  last_name?: string
  username?: string
  title?: string
}

export interface TelegramPhotoSize {
  file_id: string
  file_unique_id: string
  file_size?: number
  width: number
  height: number
}

export interface TelegramDocument {
  file_id: string
  file_unique_id: string
  file_name?: string
  mime_type?: string
  file_size?: number
  thumb_url?: string
}

export interface TelegramVoice {
  file_id: string
  file_unique_id: string
  duration: number
  mime_type?: string
  file_size?: number
}

export interface TelegramVideo {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  duration: number
  thumb?: TelegramPhotoSize
  mime_type?: string
  file_size?: number
}

export interface TelegramAudio {
  file_id: string
  file_unique_id: string
  duration: number
  performer?: string
  title?: string
  mime_type?: string
  file_size?: number
  thumb?: TelegramPhotoSize
}

export interface TelegramContact {
  phone_number: string
  first_name: string
  last_name?: string
  user_id?: number
}

export interface TelegramLocation {
  latitude: number
  longitude: number
}

export interface TelegramMessageEntity {
  type: 'bot_command' | 'url' | 'mention' | 'hashtag' | 'cashtag' | 'bold' | 'italic' | 'code' | 'pre' | 'text_link' | 'text_mention'
  offset: number
  length: number
  url?: string
}

export interface TelegramCallbackQuery {
  id: string
  from: TelegramUser
  message?: TelegramMessage
  data?: string
}

// Interfaces para enviar mensajes
export interface SendMessageParams {
  chat_id: number | string
  text: string
  parse_mode?: 'Markdown' | 'MarkdownV2' | 'HTML'
  disable_web_page_preview?: boolean
  disable_notification?: boolean
  reply_to_message_id?: number
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup
}

export interface SendPhotoParams {
  chat_id: number | string
  photo: string | Buffer
  caption?: string
  parse_mode?: 'Markdown' | 'MarkdownV2' | 'HTML'
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][]
}

export interface InlineKeyboardButton {
  text: string
  url?: string
  callback_data?: string
}

export interface ReplyKeyboardMarkup {
  keyboard: KeyboardButton[][]
  resize_keyboard?: boolean
  one_time_keyboard?: boolean
}

export interface KeyboardButton {
  text: string
  request_contact?: boolean
  request_location?: boolean
}
