// src/features/fairy/services/fairyService.ts
import { getFairyResponse, getEmotionFromText } from '@/features/ai/services'
import type { ChatMessage } from '@/features/ai/services'
import type { InteractionType } from '@/types/fairy'

/**
 * Handle fairy interaction and return response
 */
export async function handleFairyInteraction(
  interaction: InteractionType,
  conversationHistory: ChatMessage[] = [],
  userName?: string
): Promise<{ text: string; emotion: string }> {
  return await getFairyResponse({
    type: interaction.type,
    direction: interaction.direction,
    voiceText: interaction.type === 'voice' ? '' : undefined,
    conversationHistory,
    userName,
  })
}

/**
 * Process voice message through AI
 */
export async function processVoiceMessage(
  message: string,
  conversationHistory: ChatMessage[] = [],
  userName?: string
): Promise<{ text: string; emotion: string }> {
  const response = await getFairyResponse({
    type: 'voice',
    voiceText: message,
    conversationHistory,
    userName,
  })
  return response
}

/**
 * Get fairy emotion based on text content
 */
export function getFairyEmotion(text: string): string {
  return getEmotionFromText(text)
}
