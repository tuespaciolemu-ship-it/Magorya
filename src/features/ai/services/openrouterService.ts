// src/features/ai/services/openrouterService.ts
import { chatWithOpenRouter } from '@/lib/openrouter/client'
import { getSystemPrompt, getRandomTapPhrase, getSwipePhrase } from '../prompts/systemPrompt'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  text: string
  emotion: 'happy' | 'excited' | 'thinking' | 'magical'
}

/**
 * Get AI response from OpenRouter based on user input
 */
export async function getChatResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  userName?: string
): Promise<ChatResponse> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: getSystemPrompt(userName),
    },
    ...conversationHistory.slice(-10),
    {
      role: 'user',
      content: userMessage,
    },
  ]

  try {
    const text = await chatWithOpenRouter(messages)

    const emotion: ChatResponse['emotion'] = text.includes('✨')
      ? 'magical'
      : text.includes('🌟')
      ? 'excited'
      : text.includes('💫')
      ? 'thinking'
      : 'happy'

    return { text, emotion }
  } catch (error) {
    console.error('OpenRouter API error:', error)
    return {
      text: '¡Un destello de alegría siempre ayuda 🌟',
      emotion: 'happy',
    }
  }
}

/**
 * Get quick magical phrase for tap/swipe interactions
 */
export async function getMagicalPhrase(
  interactionType: 'tap' | 'swipe',
  direction?: 'up' | 'down' | 'left' | 'right'
): Promise<string> {
  if (interactionType === 'tap') {
    return getRandomTapPhrase()
  }

  if (interactionType === 'swipe' && direction) {
    return getSwipePhrase(direction)
  }

  return getRandomTapPhrase()
}

/**
 * Emotion from text analysis
 */
export function getEmotionFromText(text: string): 'happy' | 'excited' | 'thinking' | 'magical' {
  if (text.includes('✨') || text.includes('magia')) return 'magical'
  if (text.includes('🌟') || text.includes('brilla')) return 'excited'
  if (text.includes('💫') || text.includes('piensa')) return 'thinking'
  return 'happy'
}

/**
 * Get fairy response for any interaction
 */
export async function getFairyResponse(
  interaction: {
    type: 'tap' | 'swipe' | 'voice' | 'file'
    direction?: 'up' | 'down' | 'left' | 'right'
    voiceText?: string
    conversationHistory?: ChatMessage[]
    userName?: string
  }
): Promise<{ text: string; emotion: string }> {
  switch (interaction.type) {
    case 'tap':
      const tapPhrase = await getMagicalPhrase('tap')
      return { text: tapPhrase, emotion: 'excited' }

    case 'swipe':
      if (interaction.direction) {
        const swipePhrase = await getMagicalPhrase('swipe', interaction.direction)
        return { text: swipePhrase, emotion: 'magical' }
      }
      const defaultSwipe = await getMagicalPhrase('swipe', 'up')
      return { text: defaultSwipe, emotion: 'magical' }

    case 'voice':
      if (interaction.voiceText) {
        return await getChatResponse(
          interaction.voiceText,
          interaction.conversationHistory || [],
          interaction.userName
        )
      }
      return {
        text: '¡Escuchando tu hechizo mágico! 🎵',
        emotion: 'thinking',
      }

    case 'file':
      return {
        text: '¡Archivo mágico recibido! ✨',
        emotion: 'happy',
      }

    default:
      return {
        text: '✨',
        emotion: 'happy',
      }
  }
}
