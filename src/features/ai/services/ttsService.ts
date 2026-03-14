// src/features/ai/services/ttsService.ts - Servicio de Texto a Voz
interface TTSApiResponse {
  audio_url: string
  duration?: number
}

interface TTSOptions {
  emotion?: 'neutral' | 'alegre' | 'triste' | 'emocionado'
  speed?: number
  pitch?: number
}

const TTS_API_URL = 'https://api.z.ai/text-to-speech'
const TTS_API_KEY = process.env.NEXT_PUBLIC_TTS_API_KEY || ''

/**
 * Generar audio con API externa (Z.AI o similar)
 */
export async function generateSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<string | null> {
  // Si no hay API key, retornar null para usar fallback
  if (!TTS_API_KEY) {
    console.log('TTS API key no configurada, usando Web Speech API')
    return null
  }

  try {
    const response = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TTS_API_KEY}`
      },
      body: JSON.stringify({
        input: text,
        voice: 'alloy', // voz expresiva
        language: 'es-MX',
        emotion: options.emotion || 'neutral',
        speed: options.speed || 1.0,
        pitch: options.pitch || (options.emotion === 'alegre' ? 1.2 : 1.0)
      })
    })

    if (!response.ok) {
      console.error('TTS API error:', response.status)
      return null
    }

    const data: TTSApiResponse = await response.json()
    console.log('Audio generado:', data.audio_url)

    return data.audio_url

  } catch (error) {
    console.error('Error en TTS API:', error)
    return null
  }
}

/**
 * Reproducir audio con Web Speech API (fallback)
 */
export function speakWithWebSpeechAPI(
  text: string,
  lang: string = 'es-MX',
  pitch: number = 1.2,
  rate: number = 1
): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch

    // Buscar voz femenina en español
    const voices = speechSynthesis.getVoices()
    const femaleVoice = voices.find(voice =>
      voice.lang.includes('es') &&
      (voice.name.toLowerCase().includes('female') ||
       voice.name.toLowerCase().includes('mujer') ||
       voice.name.toLowerCase().includes('google') ||
       voice.name.toLowerCase().includes('mex'))
    )

    const selectedVoice = femaleVoice || voices.find(voice => voice.lang.includes('es-MX'))
    if (selectedVoice) utterance.voice = selectedVoice

    speechSynthesis.speak(utterance)
  }
}

/**
 * Función principal de texto a voz
 * Intenta usar API externa, si falla usa Web Speech API
 */
export async function speak(
  text: string,
  options: {
    lang?: string
    pitch?: number
    rate?: number
    emotion?: 'neutral' | 'alegre' | 'triste' | 'emocionado'
    useApi?: boolean
  } = {}
): Promise<void> {
  const {
    lang = 'es-MX',
    pitch = 1.2,
    rate = 1,
    emotion = 'neutral',
    useApi = true
  } = options

  // Primero intentar con API externa
  if (useApi && TTS_API_KEY) {
    const audioUrl = await generateSpeech(text, { emotion, speed: rate, pitch })

    if (audioUrl) {
      // Reproducir audio generado
      const audio = new Audio(audioUrl)
      audio.play().catch(err => console.error('Error reproduciendo audio:', err))
      return
    }
  }

  // Fallback a Web Speech API
  speakWithWebSpeechAPI(text, lang, pitch, rate)
}
