// src/types/fairy.ts

export type FairyEmotion = 'happy' | 'excited' | 'thinking' | 'magical'

export interface FairyState {
  emotion: FairyEmotion
  isAnimating: boolean
  particles: Particle[]
  lastInteraction: Date | null
  response: string
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
