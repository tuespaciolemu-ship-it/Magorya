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
 * Genera imagen usando Unsplash API con categorías inteligentes
 */
export async function generateImageFromUnsplash(prompt: string): Promise<GeneratedImage> {
  try {
    const optimizedQuery = optimizeSearchQuery(prompt)
    const category = detectCategory(prompt)

    // Construir query con categoría si se detecta
    const searchQuery = category
      ? `${optimizedQuery} ${category}`
      : optimizedQuery

    const encodedQuery = encodeURIComponent(searchQuery)

    // Usar Unsplash Search API
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=1&orientation=landscape`, {
      headers: {
        'Accept-Version': 'v1'
      }
    })

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`)
      throw new Error(`Error en Unsplash API: ${response.status}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const photo = data.results[0]
      return {
        url: photo.urls.regular,
        prompt,
        timestamp: new Date()
      }
    }

    // Si no hay resultados, usar Lorem Picsum con categoría
    console.log('No se encontraron resultados en Unsplash, usando Lorem Picsum con categoría')
    return await generateImageFromLoremPicsum(prompt)

  } catch (error) {
    console.error('Error con Unsplash:', error)
    return await generateImageFromLoremPicsum(prompt)
  }
}

/**
 * Detecta la categoría del prompt para mejorar la búsqueda
 */
function detectCategory(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()

  // Categorías de Unsplash
  const categories = {
    // Animales
    animals: ['perro', 'gato', 'animal', 'mascota', 'caballo', 'pájaro', 'pez', 'tigre', 'león', 'elefante', 'mono', 'loro'],

    // Naturaleza
    nature: ['árbol', 'flor', 'bosque', 'montaña', 'río', 'lago', 'playa', 'mar', 'océano', 'cielo', 'nube', 'sol', 'luna', 'estrella'],

    // Personas
    people: ['persona', 'hombre', 'mujer', 'niño', 'niña', 'familia', 'amigo', 'pareja'],

    // Arquitectura
    architecture: ['casa', 'edificio', 'ciudad', 'puente', 'torre', 'castillo', 'iglesia', 'templo'],

    // Tecnología
    technology: ['computadora', 'teléfono', 'robot', 'astronauta', 'cohete', 'espacio', 'nave', 'satélite'],

    // Comida
    food: ['comida', 'fruta', 'verdura', 'plato', 'pizza', 'hamburguesa', 'pastel'],

    // Deportes
    sports: ['fútbol', 'baloncesto', 'tenis', 'natación', 'correr', 'bicicleta'],

    // Arte
    arts: ['pintura', 'escultura', 'música', 'danza', 'teatro', 'cine']
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      return category
    }
  }

  return '' // Sin categoría específica
}

/**
 * Optimiza el query para búsqueda en Unsplash
 */
function optimizeSearchQuery(prompt: string): string {
  // Convertir a minúsculas y limpiar
  let query = prompt.toLowerCase().trim()

  // Remover artículos y palabras innecesarias
  query = query
    .replace(/\b(un|una|el|la|los|las|de|del|y|o|en|con|por|para)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Traducciones comunes al inglés para mejor búsqueda
  const translations: { [key: string]: string } = {
    'gato': 'cat',
    'perro': 'dog',
    'casa': 'house',
    'ciudad': 'city',
    'playa': 'beach',
    'montaña': 'mountain',
    'árbol': 'tree',
    'flor': 'flower',
    'sol': 'sun',
    'luna': 'moon',
    'estrella': 'star',
    'cielo': 'sky',
    'mar': 'sea',
    'río': 'river',
    'bosque': 'forest',
    'desierto': 'desert',
    'nieve': 'snow',
    'fuego': 'fire',
    'agua': 'water',
    'tierra': 'earth',
    'gris': 'gray',
    'azul': 'blue',
    'rojo': 'red',
    'verde': 'green',
    'amarillo': 'yellow',
    'negro': 'black',
    'blanco': 'white',
    'rosa': 'pink',
    'morado': 'purple',
    'naranja': 'orange',
    'marrón': 'brown'
  }

  // Aplicar traducciones
  Object.keys(translations).forEach(spanish => {
    const english = translations[spanish]
    query = query.replace(new RegExp(`\\b${spanish}\\b`, 'g'), english)
  })

  return query.trim()
}

/**
 * Simplifica el query removiendo modificadores para búsqueda más amplia
 */
function simplifyQuery(prompt: string): string {
  const optimized = optimizeSearchQuery(prompt)

  // Tomar solo las primeras 1-2 palabras clave
  const words = optimized.split(' ')
  return words.slice(0, 2).join(' ')
}

/**
 * Genera imagen usando Lorem Picsum con seed inteligente y categorías
 */
export async function generateImageFromLoremPicsum(prompt: string): Promise<GeneratedImage> {
  try {
    const optimizedSeed = optimizeSearchQuery(prompt)
    const category = detectCategory(prompt)

    // Crear seed que incluya la categoría para más variedad
    const seed = category
      ? `${optimizedSeed}_${category}`
      : optimizedSeed

    const hash = simpleHash(seed)

    // Usar Lorem Picsum con seed para consistencia
    const url = `https://picsum.photos/seed/${hash}/512/512`

    return {
      url,
      prompt,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('Error con Lorem Picsum:', error)
    // Fallback final
    return {
      url: `https://picsum.photos/512/512?random=${Date.now()}`,
      prompt,
      timestamp: new Date()
    }
  }
}

/**
 * Crea un hash simple para seeds consistentes
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convertir a 32 bits
  }
  return Math.abs(hash).toString()
}
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
