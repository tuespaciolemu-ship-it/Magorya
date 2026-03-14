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
 * Si falla, usa Unsplash API como fallback
 */
export async function generateImageWithOpenRouter(
  prompt: string,
  openRouterKey: string
): Promise<GeneratedImage> {
  try {
    // Intentar primero con OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://magorya.vercel.app',
        'X-Title': 'Magorya AI Assistant'
      },
      body: JSON.stringify({
        model: 'openai/dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      })
    })

    if (response.ok) {
      const data = await response.json()
      return {
        url: data.data[0].url,
        prompt,
        timestamp: new Date()
      }
    }

    // Si OpenRouter falla, usar Unsplash como fallback
    console.log('OpenRouter falló, usando Unsplash como fallback')
    return await generateImageFromUnsplash(prompt)

  } catch (error) {
    console.error('Error con OpenRouter, usando Unsplash:', error)
    // Fallback a Unsplash
    return await generateImageFromUnsplash(prompt)
  }
}

/**
 * Genera imagen usando Unsplash API (búsqueda de fotos reales)
 */
export async function generateImageFromUnsplash(prompt: string): Promise<GeneratedImage> {
  try {
    // Usar Unsplash Search API (no requiere API key para búsquedas básicas)
    const searchQuery = encodeURIComponent(prompt)
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&orientation=landscape`, {
      headers: {
        'Accept-Version': 'v1'
      }
    })

    if (!response.ok) {
      throw new Error('Error en Unsplash API')
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const photo = data.results[0]
      return {
        url: photo.urls.regular, // URL de la imagen
        prompt,
        timestamp: new Date()
      }
    }

    // Si no hay resultados, usar Lorem Picsum con el prompt como seed
    return {
      url: `https://picsum.photos/512/512?random=${encodeURIComponent(prompt)}`,
      prompt,
      timestamp: new Date()
    }

  } catch (error) {
    console.error('Error con Unsplash:', error)

    // Último fallback: Lorem Picsum
    return {
      url: `https://picsum.photos/512/512?random=${Date.now()}`,
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
