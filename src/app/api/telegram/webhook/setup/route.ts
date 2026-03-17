// src/app/api/telegram/webhook/setup/route.ts
// Endpoint para configurar el webhook de Telegram

import { NextRequest, NextResponse } from 'next/server'
import { setWebhook, getWebhookInfo, getMe } from '@/features/telegram/services/telegramService'

/**
 * POST /api/telegram/webhook/setup
 * Configura el webhook de Telegram
 */
export async function POST(request: NextRequest) {
  try {
    const { webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'webhookUrl es requerido' },
        { status: 400 }
      )
    }

    // Establecer webhook
    const success = await setWebhook(webhookUrl)

    if (!success) {
      return NextResponse.json(
        { error: 'Error al configurar webhook' },
        { status: 500 }
      )
    }

    // Verificar que funcionó
    const webhookInfo = await getWebhookInfo()

    return NextResponse.json({
      success: true,
      webhook: webhookInfo
    })

  } catch (error) {
    console.error('Error en setup webhook:', error)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/telegram/webhook/setup
 * Obtiene información del webhook y del bot
 */
export async function GET() {
  try {
    const [webhookInfo, botInfo] = await Promise.all([
      getWebhookInfo(),
      getMe()
    ])

    return NextResponse.json({
      bot: botInfo,
      webhook: webhookInfo
    })

  } catch (error) {
    console.error('Error en get webhook info:', error)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}
