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
  setResponse: (text: string) => void
}

export const useFairyStore = create<FairyStore>((set, get) => ({
  emotion: 'happy',
  isAnimating: false,
  particles: [],
  lastInteraction: null,
  response: '',

  setEmotion: (emotion) => set({ emotion, isAnimating: true }),

  setResponse: (text) => set({ response: text }),

  tap: async () => {
    const { getMagicalPhrase } = await import('@/features/ai/services')
    const phrase = await getMagicalPhrase('tap')

    set({
      emotion: 'excited',
      isAnimating: true,
      lastInteraction: new Date(),
      response: phrase,
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
      response: phrase,
    })

    get().addParticles(15)

    setTimeout(() => set({ isAnimating: false }), 700)

    return phrase
  },

  speak: async (text) => {
    set({ isAnimating: true, response: text })
    // Text-to-speech will be handled by component with Web Speech API
    setTimeout(() => set({ isAnimating: false }), 1000)
  },

  addParticles: (count) => {
    const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#DDA0DD', '#F0E68C', '#FF6B9D', '#9B59B6', '#3498DB']

    const newParticles: Particle[] = Array.from({ length: count }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x: 50 + (Math.random() - 0.5) * 30,
      y: 50 + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3 - 1,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    set({ particles: [...get().particles, ...newParticles] })
  },

  updateParticles: () => {
    const particles = get().particles
      .map((p) => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.05,
        life: p.life - 0.015,
      }))
      .filter((p) => p.life > 0)

    set({ particles })
  },

  clearParticles: () => set({ particles: [] }),
}))
