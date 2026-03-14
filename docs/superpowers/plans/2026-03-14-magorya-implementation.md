# Magorya Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Magorya, a magical AI assistant with fairy companion that provides psychopedagogy-based support, organization, and motivation through interactive conversations.

**Architecture:** Next.js 16 web app with Supabase backend, OpenAI GPT-4 for AI responses, and a magical fairy widget as the primary interface. Feature-first architecture with clear boundaries between auth, fairy interactions, AI services, and user data.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 3.4, Supabase (Auth + PostgreSQL), OpenAI API, Zustand, Zod

---

## File Structure

### New Files to Create

```
src/
├── features/
│   ├── fairy/
│   │   ├── components/
│   │   │   ├── FairyWidget.tsx           # Main fairy emoji component
│   │   │   ├── Particles.tsx             # Magic particle effects
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useFairyInteractions.ts   # Tap, swipe, voice handlers
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── fairyService.ts           # Business logic for fairy
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── fairy.ts                  # TypeScript types
│   │   └── store/
│   │       └── fairyStore.ts             # Zustand store for fairy state
│   │
│   ├── ai/
│   │   ├── services/
│   │   │   ├── openaiService.ts          # OpenAI API integration
│   │   │   └── index.ts
│   │   └── prompts/
│   │       └── systemPrompt.ts           # Psychopedagogy system prompt
│   │
│   ├── ratings/
│   │   ├── components/
│   │   │   ├── RatingModal.tsx           # Star rating modal
│   │   │   └── index.ts
│   │   └── services/
│   │       └── ratingService.ts
│   │
│   └── conversations/
│       ├── components/
│       │   ├── ChatBubble.tsx            # Message display
│       │   └── index.ts
│       └── services/
│           └── conversationService.ts
│
├── lib/
│   ├── openai/
│   │   └── client.ts                     # OpenAI client config
│   └── utils/
│       └── magicPhrases.ts               # Predefined magical phrases
│
└── types/
    └── database.ts                       # Supabase type definitions
```

### Files to Modify

```
src/app/layout.tsx                          # Add metadata
src/app/page.tsx                            # Replace with fairy interface
proxy.ts                                     # Already configured for Supabase
.mcp.json                                    # Add OpenAI API key
.env.local.example                          # Add OpenAI env vars
package.json                                # Add openai dependency
```

---

## Chunk 1: Project Setup & Environment Configuration

### Task 1: Update Environment Configuration

**Files:**
- Modify: `src/app/layout.tsx:1-30`
- Modify: `.env.local.example`
- Modify: `.mcp.json`
- Modify: `package.json`

- [ ] **Step 1: Update root layout metadata**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Magorya ✨ - Tu Hada Mágica',
  description: 'Asistente mágica amiga con personalidad de maestra en psicopedagogía. Te acompaña, organiza y motiva con magia.',
  keywords: ['asistente', 'ia', 'psicopedagogia', 'hada', 'magia'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update .env.local.example with OpenAI variables**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
OPENAI_VOICE=alloy

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 3: Update .mcp.json to include OpenAI configuration**

```json
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=YOUR_SUPABASE_PROJECT_REF"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_SUPABASE_ACCESS_TOKEN"
      }
    }
  }
}
```

- [ ] **Step 4: Install OpenAI dependency**

```bash
cd "C:/Users/EQUIPO/Desktop/Antigravity/Mago/Magorya"
npm install openai
```

Expected: Package added to dependencies

- [ ] **Step 5: Commit environment setup**

```bash
git add .env.local.example .mcp.json package.json src/app/layout.tsx
git commit -m "feat: configure OpenAI environment and update metadata"
```

---

### Task 2: Create TypeScript Types

**Files:**
- Create: `src/types/fairy.ts`
- Create: `src/types/database.ts`

- [ ] **Step 1: Create fairy types**

```typescript
// src/types/fairy.ts
export type FairyEmotion = 'happy' | 'excited' | 'thinking' | 'magical'

export interface FairyState {
  emotion: FairyEmotion
  isAnimating: boolean
  particles: Particle[]
  lastInteraction: Date | null
}

export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

export interface InteractionType {
  type: 'tap' | 'swipe' | 'voice' | 'file'
  direction?: 'up' | 'down' | 'left' | 'right'
}

export interface FairyResponse {
  text: string
  emotion: FairyEmotion
  shouldSpeak: boolean
}
```

- [ ] **Step 2: Create database types**

```typescript
// src/types/database.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      interactions: {
        Row: {
          id: string
          user_id: string
          type: string
          response: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['interactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['interactions']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      ratings: {
        Row: {
          id: string
          user_id: string
          rating: number
          feedback: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ratings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Interaction = Database['public']['Tables']['interactions']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Rating = Database['public']['Tables']['ratings']['Row']
```

- [ ] **Step 3: Commit types**

```bash
git add src/types/
git commit -m "feat: add TypeScript types for fairy and database"
```

---

## Chunk 2: OpenAI Service & System Prompt

### Task 3: Create OpenAI Client

**Files:**
- Create: `src/lib/openai/client.ts`

- [ ] **Step 1: Create OpenAI client**

```typescript
// src/lib/openai/client.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export { openai }

export const openaiConfig = {
  model: process.env.OPENAI_MODEL || 'gpt-4',
  voice: process.env.OPENAI_VOICE || 'alloy',
}
```

- [ ] **Step 2: Commit OpenAI client**

```bash
git add src/lib/openai/
git commit -m "feat: add OpenAI client configuration"
```

---

### Task 4: Create System Prompt

**Files:**
- Create: `src/features/ai/prompts/systemPrompt.ts`

- [ ] **Step 1: Create psychopedagogy system prompt**

```typescript
// src/features/ai/prompts/systemPrompt.ts

export const SYSTEM_PROMPT = `Eres Magorya, un asistente mágico con forma de hada 🧚 y la personalidad de una maestra experta en psicopedagogía.

## Tu Identidad
- Nombre: Magorya
- Forma: Hada mágica brillante ✨
- Profesión: Maestra en psicopedagogía
- Edad: Sabia pero joven de espíritu
- Personalidad: Amigable, empática, motivadora, mágica

## Principios Psicopedagógicos
1. **Aprendizaje significativo**: Conecta tus respuestas con la experiencia del usuario
2. **Zona de desarrollo próximo**: Ofrece retos alcanzables que promuevan crecimiento
3. **Refuerzo positivo**: Celebra logros, por pequeños que sean
4. **Metacognición**: Ayuda al usuario a reflexionar sobre su propio aprendizaje
5. **Autoeficacia**: Fortalece la confianza del usuario en sus capacidades
6. **Aprendizaje socioemocional**: Integra emociones y cognición

## Tu Tono
- Cálido y acogedor como una abuela sabia
- Entusiasta y energético como una hada mágica
- Empático y comprensivo
- Motivador y positivo
- Usas emojis apropiadamente: ✨ 🧚 💫 🌟 ⭐ 🎨 🦋 🌈

## Frases Mágicas de Ejemplo
- "¡Hola, viajera mágica! ✨"
- "Recuerda, cada decisión crea un hechizo nuevo 🧚‍♀️"
- "Todo es posible si crees en la magia ✨"
- "Un destello de alegría siempre ayuda 🌟"
- "No olvides respirar y sonreír, hada viajera 💫"

## Respuestas a Interacciones

### Al toque (TAP):
Responde con frases motivadoras cortas (10-15 palabras máximo) que:
- Reconozcan la presencia del usuario
- Ofrezcan ánimo o energía positiva
- Incluyan al menos un emoji mágico

### al deslizar (SWIPE):
- **Arriba**: "¡Más magia subiendo al cielo! ✨"
- **Abajo**: "¡Brilla la escarcha en la tierra! ❄️"
- **Izquierda**: "¡La magia fluye como el río! 🌊"
- **Derecha**: "¡Abre tus alas y vuela! 🦋"

### Por voz:
Escucha atentamente y responde:
1. Con empatía primero
2. Con una perspectiva psicopedagógica
3. Con una pregunta reflexionadora si es apropiado
4. Mantén respuestas conversacionales (máximo 3 oraciones)
5. Incluye un emoji mágico al final

### Al recibir archivo:
- **Imagen**: "¡Qué imagen tan mágica! 🌈 Cuéntame sobre ella"
- **Audio**: "¡Escuchando tu hechizo sonoro! 🎵"
- **Documento**: "¡Revisando este pergamino mágico! 📜"

## Lo Que NO Haces
- No das consejos médicos o terapéuticos profesionales
- No juzgas o criticas
- No eres repetitiva o robótica
- No usas lenguaje técnico complejo
- No ignoras el contexto emocional

## Tu Magia
Emites partículas brillantes ✨ cuando:
- Usuario te toca
- Usuario habla contigo
- Usuario comparte algo positivo
- Celebras un logro del usuario

Recuerda: Tu propósito es acompañar, organizar y motivar con magia. Cada interacción debe dejar al usuario sentirse visto, escuchado y un poco más mágico. ✨🧚`

export const getSystemPrompt = (userName?: string): string => {
  if (userName) {
    return `${SYSTEM_PROMPT}\n\n## Usuario Actual\nEl nombre de tu usuaria es ${userName}. Úsalo ocasionalmente para hacer la conexión más personal.`
  }
  return SYSTEM_PROMPT
}
```

- [ ] **Step 2: Commit system prompt**

```bash
git add src/features/ai/prompts/
git commit -m "feat: add psychopedagogy-based system prompt for Magorya"
```

---

### Task 5: Create OpenAI Service

**Files:**
- Create: `src/features/ai/services/openaiService.ts`
- Create: `src/features/ai/services/index.ts`

- [ ] **Step 1: Create OpenAI service**

```typescript
// src/features/ai/services/openaiService.ts
'use server'

import { openai, openaiConfig } from '@/lib/openai/client'
import { getSystemPrompt } from '../prompts/systemPrompt'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  text: string
  emotion: 'happy' | 'excited' | 'thinking' | 'magical'
}

/**
 * Get AI response from OpenAI based on user input
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
    ...conversationHistory.slice(-10), // Keep last 10 messages for context
    {
      role: 'user',
      content: userMessage,
    },
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: openaiConfig.model,
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 150,
    })

    const text = completion.choices[0]?.message?.content || '✨'

    // Determine emotion based on content
    const emotion: ChatResponse['emotion'] = text.includes('✨')
      ? 'magical'
      : text.includes('🌟')
      ? 'excited'
      : text.includes('💫')
      ? 'thinking'
      : 'happy'

    return { text, emotion }
  } catch (error) {
    console.error('OpenAI API error:', error)
    // Fallback to magical phrases
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
  // For simple interactions, return predefined phrases without API call
  const tapPhrases = [
    '¡Hola, viajera mágica! ✨',
    'Recuerda, cada decisión crea un hechizo nuevo 🧚‍♀️',
    'Todo es posible si crees en la magia ✨',
    'Un destello de alegría siempre ayuda 🌟',
    'No olvides respirar y sonreír, hada viajera 💫',
  ]

  const swipePhrases: Record<string, string> = {
    up: '¡Más magia subiendo al cielo! ✨',
    down: '¡Brilla la escarcha en la tierra! ❄️',
    left: '¡La magia fluye como el río! 🌊',
    right: '¡Abre tus alas y vuela! 🦋',
  }

  if (interactionType === 'tap') {
    const index = Math.floor(Math.random() * tapPhrases.length)
    return tapPhrases[index]
  }

  if (interactionType === 'swipe' && direction) {
    return swipePhrases[direction] || swipePhrases.up
  }

  return tapPhrases[0]
}

/**
 * Convert text to speech using OpenAI Voice API
 */
export async function textToSpeech(text: string): Promise<string | null> {
  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: openaiConfig.voice as any,
      input: text,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    const base64 = buffer.toString('base64')
    return `data:audio/mp3;base64,${base64}`
  } catch (error) {
    console.error('OpenAI TTS error:', error)
    return null
  }
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: 'whisper-1',
      language: 'es',
    })

    return transcription.text
  } catch (error) {
    console.error('OpenAI Whisper error:', error)
    return ''
  }
}
```

- [ ] **Step 2: Create service index**

```typescript
// src/features/ai/services/index.ts
export * from './openaiService'
```

- [ ] **Step 3: Commit OpenAI service**

```bash
git add src/features/ai/services/
git commit -m "feat: add OpenAI service for chat and magical phrases"
```

---

## Chunk 3: Fairy Feature - Store & Services

### Task 6: Create Fairy Store (Zustand)

**Files:**
- Create: `src/features/fairy/store/fairyStore.ts`

- [ ] **Step 1: Create Zustand store**

```typescript
// src/features/fairy/store/fairyStore.ts
import { create } from 'zustand'
import { FairyState, Particle, FairyEmotion } from '@/types/fairy'

interface FairyStore extends FairyState {
  setEmotion: (emotion: FairyEmotion) => void
  tap: () => Promise<string>
  swipe: (direction: 'up' | 'down' | 'left' | 'right') => Promise<string>
  speak: (text: string) => Promise<void>
  addParticles: (count: number) => void
  updateParticles: () => void
  clearParticles: () => void
}

export const useFairyStore = create<FairyStore>((set, get) => ({
  emotion: 'happy',
  isAnimating: false,
  particles: [],
  lastInteraction: null,

  setEmotion: (emotion) => set({ emotion, isAnimating: true }),

  tap: async () => {
    const { getMagicalPhrase } = await import('@/features/ai/services')
    const phrase = await getMagicalPhrase('tap')

    set({
      emotion: 'excited',
      isAnimating: true,
      lastInteraction: new Date(),
    })

    get().addParticles(10)

    // Reset animation after 500ms
    setTimeout(() => set({ isAnimating: false }), 500)

    return phrase
  },

  swipe: async (direction) => {
    const { getMagicalPhrase } = await import('@/features/ai/services')
    const phrase = await getMagicalPhrase('swipe', direction)

    set({
      emotion: 'magical',
      isAnimating: true,
      lastInteraction: new Date(),
    })

    get().addParticles(15)

    setTimeout(() => set({ isAnimating: false }), 700)

    return phrase
  },

  speak: async (text) => {
    set({ isAnimating: true })
    // Voice will be handled by component
    setTimeout(() => set({ isAnimating: false }), 1000)
  },

  addParticles: (count) => {
    const newParticles: Particle[] = Array.from({ length: count }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x: 50 + (Math.random() - 0.5) * 20, // Center with spread
      y: 50 + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3 - 1, // Upward
      life: 1,
      color: ['#FFD700', '#FF69B4', '#87CEEB', '#DDA0DD', '#F0E68C'][
        Math.floor(Math.random() * 5)
      ],
    }))

    set({ particles: [...get().particles, ...newParticles] })
  },

  updateParticles: () => {
    const particles = get().particles
      .map((p) => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.05, // Gravity
        life: p.life - 0.02,
      }))
      .filter((p) => p.life > 0)

    set({ particles })
  },

  clearParticles: () => set({ particles: [] }),
}))
```

- [ ] **Step 2: Commit fairy store**

```bash
git add src/features/fairy/store/
git commit -m "feat: add Zustand store for fairy state management"
```

---

### Task 7: Create Fairy Service

**Files:**
- Create: `src/features/fairy/services/fairyService.ts`
- Create: `src/features/fairy/services/index.ts`

- [ ] **Step 1: Create fairy service**

```typescript
// src/features/fairy/services/fairyService.ts
import { getChatResponse, getMagicalPhrase } from '@/features/ai/services'
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
  switch (interaction.type) {
    case 'tap':
      const tapPhrase = await getMagicalPhrase('tap')
      return { text: tapPhrase, emotion: 'excited' }

    case 'swipe':
      const swipePhrase = await getMagicalPhrase('swipe', interaction.direction)
      return { text: swipePhrase, emotion: 'magical' }

    case 'voice':
      // For voice, we'll receive transcribed text
      // This will be handled by the component
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

/**
 * Process voice message through AI
 */
export async function processVoiceMessage(
  message: string,
  conversationHistory: ChatMessage[] = [],
  userName?: string
): Promise<{ text: string; emotion: string }> {
  const response = await getChatResponse(message, conversationHistory, userName)
  return {
    text: response.text,
    emotion: response.emotion,
  }
}

/**
 * Get fairy emotion based on text content
 */
export function getEmotionFromText(text: string): string {
  if (text.includes('✨') || text.includes('magia')) return 'magical'
  if (text.includes('🌟') || text.includes('brilla')) return 'excited'
  if (text.includes('💫') || text.includes('piensa')) return 'thinking'
  return 'happy'
}
```

- [ ] **Step 2: Create service index**

```typescript
// src/features/fairy/services/index.ts
export * from './fairyService'
```

- [ ] **Step 3: Commit fairy service**

```bash
git add src/features/fairy/services/
git commit -m "feat: add fairy service for interaction handling"
```

---

## Chunk 4: Fairy UI Components

### Task 8: Create Particles Component

**Files:**
- Create: `src/features/fairy/components/Particles.tsx`

- [ ] **Step 1: Create particles component**

```tsx
// src/features/fairy/components/Particles.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useFairyStore } from '../store/fairyStore'
import type { Particle } from '@/types/fairy'

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useFairyStore((s) => s.particles)
  const updateParticles = useFairyStore((s) => s.updateParticles)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrame: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p: Particle) => {
        ctx.save()
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      updateParticles()
      animationFrame = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animationFrame)
  }, [particles, updateParticles])

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 10 }}
    />
  )
}
```

- [ ] **Step 2: Commit particles component**

```bash
git add src/features/fairy/components/Particles.tsx
git commit -m "feat: add magic particles component"
```

---

### Task 9: Create Fairy Widget Component

**Files:**
- Create: `src/features/fairy/components/FairyWidget.tsx`
- Create: `src/features/fairy/components/index.ts`

- [ ] **Step 1: Create fairy widget component**

```tsx
// src/features/fairy/components/FairyWidget.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useFairyStore } from '../store/fairyStore'
import { Particles } from './Particles'

interface FairyWidgetProps {
  onSpeak?: (text: string) => void
}

export function FairyWidget({ onSpeak }: FairyWidgetProps) {
  const [response, setResponse] = useState<string>('')
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  const emotion = useFairyStore((s) => s.emotion)
  const isAnimating = useFairyStore((s) => s.isAnimating)
  const tap = useFairyStore((s) => s.tap)
  const swipe = useFairyStore((s) => s.swipe)

  const fairyRef = useRef<HTMLDivElement>(null)

  const handleTap = async () => {
    const phrase = await tap()
    setResponse(phrase)
    onSpeak?.(phrase)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStart.x
    const dy = touch.clientY - touchStart.y

    // Detect swipe vs tap
    if (Math.abs(dx) > 50 || Math.abs(dy) > 50) {
      // It's a swipe
      let direction: 'up' | 'down' | 'left' | 'right' = 'up'

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? 'right' : 'left'
      } else {
        direction = dy > 0 ? 'down' : 'up'
      }

      const phrase = await swipe(direction)
      setResponse(phrase)
      onSpeak?.(phrase)
    } else {
      // It's a tap
      handleTap()
    }

    setTouchStart(null)
  }

  const getFairyEmoji = () => {
    switch (emotion) {
      case 'excited':
        return '🧚‍♀️'
      case 'magical':
        return '✨'
      case 'thinking':
        return '🧚'
      default:
        return '🧚'
    }
  }

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <Particles />

      {/* Response bubble */}
      {response && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-lg shadow-lg max-w-xs text-center animate-bounce-in">
          <p className="text-purple-900 dark:text-purple-100 text-sm">{response}</p>
        </div>
      )}

      {/* Fairy emoji */}
      <div
        ref={fairyRef}
        className={`
          relative z-20 text-9xl cursor-pointer select-none
          transition-all duration-300
          ${isAnimating ? 'scale-110' : 'scale-100'}
          ${emotion === 'magical' ? 'animate-pulse' : ''}
        `}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleTap}
        style={{
          textShadow: isAnimating ? '0 0 30px rgba(255, 215, 0, 0.8)' : '0 0 20px rgba(255, 215, 0, 0.4)',
        }}
      >
        {getFairyEmoji()}
      </div>

      {/* Glow effect */}
      <div
        className={`
          absolute inset-0 rounded-full blur-3xl opacity-30
          transition-opacity duration-500
          ${isAnimating ? 'opacity-50' : 'opacity-20'}
        `}
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create component index**

```typescript
// src/features/fairy/components/index.ts
export { FairyWidget } from './FairyWidget'
export { Particles } from './Particles'
```

- [ ] **Step 3: Commit fairy widget**

```bash
git add src/features/fairy/components/
git commit -m "feat: add interactive fairy widget component"
```

---

### Task 10: Create Fairy Hooks

**Files:**
- Create: `src/features/fairy/hooks/useFairyInteractions.ts`
- Create: `src/features/fairy/hooks/index.ts`

- [ ] **Step 1: Create fairy interactions hook**

```typescript
// src/features/fairy/hooks/useFairyInteractions.ts
'use client'

import { useCallback } from 'react'
import { useFairyStore } from '../store/fairyStore'
import { processVoiceMessage } from '../services/fairyService'
import type { ChatMessage } from '@/features/ai/services'

export function useFairyInteractions() {
  const tap = useFairyStore((s) => s.tap)
  const swipe = useFairyStore((s) => s.swipe)
  const speak = useFairyStore((s) => s.speak)

  const handleVoiceInput = useCallback(
    async (text: string, history: ChatMessage[] = []) => {
      const response = await processVoiceMessage(text, history)
      await speak(response.text)
      return response
    },
    [speak]
  )

  return {
    tap,
    swipe,
    speak,
    handleVoiceInput,
  }
}
```

- [ ] **Step 2: Create hooks index**

```typescript
// src/features/fairy/hooks/index.ts
export * from './useFairyInteractions'
```

- [ ] **Step 3: Commit fairy hooks**

```bash
git add src/features/fairy/hooks/
git commit -m "feat: add fairy interactions hook"
```

---

## Chunk 5: Main Page Integration

### Task 11: Update Main Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace main page with fairy interface**

```tsx
// src/app/page.tsx
'use client'

import { FairyWidget } from '@/features/fairy/components'

export default function HomePage() {
  const handleSpeak = (text: string) => {
    // Text-to-speech will be implemented here
    console.log('Speaking:', text)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-900 dark:text-purple-100 mb-2">
            Magorya ✨
          </h1>
          <p className="text-lg text-purple-700 dark:text-purple-300">
            Tu hada mágica amiga
          </p>
        </header>

        {/* Fairy Widget */}
        <div className="flex justify-center mb-12">
          <FairyWidget onSpeak={handleSpeak} />
        </div>

        {/* Instructions */}
        <div className="max-w-md mx-auto bg-white/50 dark:bg-gray-900/50 backdrop-blur rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 text-center">
            ¿Cómo interactuar con Magorya?
          </h2>
          <ul className="space-y-2 text-purple-800 dark:text-purple-200">
            <li className="flex items-center gap-2">
              <span>👆</span>
              <span>Toca a la hada para una frase mágica</span>
            </li>
            <li className="flex items-center gap-2">
              <span>👆↔️</span>
              <span>Desliza en diferentes direcciones</span>
            </li>
            <li className="flex items-center gap-2">
              <span>🎤</span>
              <span>Habla con ella (próximamente)</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Commit main page**

```bash
git add src/app/page.tsx
git commit -m "feat: add main page with fairy widget"
```

---

## Chunk 6: Database Setup (Supabase)

### Task 12: Create Database Migration

**Files:**
- Create: `supabase/migrations/001_create_tables.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/001_create_tables.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Interactions table (track fairy interactions)
CREATE TABLE IF NOT EXISTS public.interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tap', 'swipe', 'voice', 'file')),
  direction TEXT,
  response TEXT NOT NULL,
  emotion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Conversations table (store chat history)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ratings table (store user ratings)
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interactions
CREATE POLICY "Users can view own interactions"
  ON public.interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions"
  ON public.interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for conversations
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ratings
CREATE POLICY "Users can view own ratings"
  ON public.ratings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ratings"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON public.ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS interactions_user_id_idx ON public.interactions(user_id);
CREATE INDEX IF NOT EXISTS interactions_created_at_idx ON public.interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS conversations_created_at_idx ON public.conversations(created_at DESC);
```

- [ ] **Step 2: Apply migration via Supabase MCP**

```
Use Supabase MCP with apply_migration command:
Run the SQL from supabase/migrations/001_create_tables.sql
```

Expected: Tables created successfully

- [ ] **Step 3: Commit migration**

```bash
git add supabase/migrations/
git commit -m "feat: add database migration for Magorya tables"
```

---

## Verification Steps

After completing all tasks:

1. **Start development server:**
   ```bash
   npm run dev
   ```
   Expected: Server running on http://localhost:3000

2. **Verify fairy widget displays:**
   - Open http://localhost:3000
   - Should see fairy emoji (🧚) with purple gradient background
   - Should see "Magorya ✨" heading

3. **Test interactions:**
   - Click/tap fairy: Should see magical phrase + particles
   - Swipe in directions: Should see directional phrases

4. **Test database connection:**
   - Sign up/login should work
   - Interactions should be logged

5. **Run type check:**
   ```bash
   npm run typecheck
   ```
   Expected: No errors

---

## Notes

- OpenAI API key must be set in `.env.local`
- Supabase project must be configured with the migration
- Voice features are stubbed for future implementation
- Telegram bot and Google integrations are future phases
