// src/features/fairy/components/FairyWidget.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useFairyStore } from '../store/fairyStore'
import { Particles } from './Particles'

interface FairyWidgetProps {
  onSpeak?: (text: string) => void
}

export function FairyWidget({ onSpeak }: FairyWidgetProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const emotion = useFairyStore((s) => s.emotion)
  const isAnimating = useFairyStore((s) => s.isAnimating)
  const response = useFairyStore((s) => s.response)
  const tap = useFairyStore((s) => s.tap)
  const swipe = useFairyStore((s) => s.swipe)

  const fairyRef = useRef<HTMLDivElement>(null)

  // Text-to-speech with Web Speech API
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 1
      utterance.pitch = 1.2

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }

  const handleTap = async () => {
    const phrase = await tap()
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
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 px-6 py-3 rounded-2xl shadow-xl max-w-xs text-center animate-bounce-in border-2 border-purple-300 dark:border-purple-700">
          <p className="text-purple-900 dark:text-purple-100 text-sm font-medium">{response}</p>
        </div>
      )}

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute -top-4 right-0 flex gap-1">
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
          absolute inset-0 rounded-full blur-3xl transition-opacity duration-500
          ${isAnimating ? 'opacity-50' : 'opacity-20'}
        `}
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
        }}
      />

      {/* Touch hint */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-purple-700 dark:text-purple-300 text-xs text-center">
        Toca o desliza ✨
      </div>
    </div>
  )
}
