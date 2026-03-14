// src/lib/openrouter/client.ts

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function chatWithOpenRouter(
  messages: OpenRouterMessage[],
  model: string = 'anthropic/claude-3.5-sonnet'
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured')
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 150,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const data: OpenRouterResponse = await response.json()
  return data.choices[0]?.message?.content || '✨'
}

export async function textToSpeech(text: string): Promise<string | null> {
  // Text-to-speech will be implemented with Web Speech API on client side
  // This is a placeholder for future TTS integration
  return null
}

export const openrouterConfig = {
  model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
  apiUrl: OPENROUTER_API_URL,
}
