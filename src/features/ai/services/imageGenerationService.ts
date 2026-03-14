// src/features/ai/services/imageGenerationService.ts
// Servicio de generación de imágenes usando OpenRouter o API directa

export interface GeneratedImage {
  url: string
  prompt: string
  timestamp: Date
}

/**
 * Genera una imagen usando OpenRouter DALL-E o similar
 */
export async function generateImage(
  prompt: string,
  apiKey?: string
): Promise<GeneratedImage> {
  try {
    // Si hay API key de OpenRouter, podemos usar su servicio de imágenes
    // o usar DALL-E directamente a través de OpenAI

    if (!apiKey) {
      // Fallback: retornar imagen placeholder con el prompt
      return {
        url: `https://placehold.co/512x512/pink/yellow?text=${encodeURIComponent(prompt.substring(0, 30))}`,
        prompt,
        timestamp: new Date()
      }
    }

    // Opción 1: Usar OpenAI DALL-E API directamente
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error generando imagen:', error)
      throw new Error(error.error?.message || 'Error al generar imagen')
    }

    const data = await response.json()

    return {
      url: data.data[0].url,
      prompt,
      timestamp: new Date()
    }

  } catch (error) {
    console.error('Error en generateImage:', error)

    // Retornar placeholder en caso de error
    return {
      url: `https://placehold.co/512x512/pink/yellow?text=${encodeURIComponent('Error: ' + prompt.substring(0, 20))}`,
      prompt,
      timestamp: new Date()
    }
  }
}

/**
 * Genera imagen usando OpenRouter (si tienen servicio de imágenes)
 */
export async function generateImageWithOpenRouter(
  prompt: string,
  openRouterKey: string
): Promise<GeneratedImage> {
  try {
    // Usar OpenRouter API para imágenes (soporta DALL-E y otros modelos)
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://magorya.vercel.app', // Opcional
        'X-Title': 'Magorya AI Assistant' // Opcional
      },
      body: JSON.stringify({
        model: 'openai/dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error generando imagen con OpenRouter:', error)
      throw new Error(error.error?.message || 'Error al generar imagen con OpenRouter')
    }

    const data = await response.json()

    return {
      url: data.data[0].url,
      prompt,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('Error con OpenRouter images:', error)

    // Fallback: retornar placeholder con mensaje claro
    return {
      url: `https://placehold.co/512x512/pink/yellow?text=${encodeURIComponent('🔧 Configuración pendiente: ' + prompt.substring(0, 15) + '...')}`,
      prompt,
      timestamp: new Date()
    }
  }
}

/**
 * Genera variaciones de una imagen (requiere API key con permisos)
 */
export async function createImageVariation(
  imageUrl: string,
  apiKey: string
): Promise<GeneratedImage> {
  try {
    const response = await fetch('https://api.openai.com/v1/images/variations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: imageUrl as any
    })

    if (!response.ok) {
      throw new Error('Error al crear variación')
    }

    const data = await response.json()

    return {
      url: data.data[0].url,
      prompt: 'Variation',
      timestamp: new Date()
    }
  } catch (error) {
    console.error('Error en createImageVariation:', error)
    throw error
  }
}
