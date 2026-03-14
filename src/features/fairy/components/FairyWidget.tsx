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

  // Cargar voces disponibles
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        speechSynthesis.getVoices()
      }
      loadVoices()
      speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  // Text-to-speech with Web Speech API - Voz Femenina
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-MX'
      utterance.rate = 1
      utterance.pitch = 1.2

      // Buscar voz femenina en español
      const voices = speechSynthesis.getVoices()
      const femaleVoice = voices.find(voice =>
        voice.lang.includes('es') &&
        (voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('mujer') ||
         voice.name.toLowerCase().includes('google') ||
         voice.name.toLowerCase().includes('mex') ||
         voice.name.toLowerCase().includes('latina') ||
         voice.name.toLowerCase().includes('sofia') ||
         voice.name.toLowerCase().includes('monica') ||
         voice.name.toLowerCase().includes('victoria'))
      ) || voices.find(voice => voice.lang.includes('es-MX') || voice.lang.includes('es-419'))

      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }

  const handleTap = async () => {
    const phrase = await tap()
    onSpeak?.(phrase)
    speakText(phrase)
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
      speakText(phrase)
    } else {
      // It's a tap
      handleTap()
    }

    setTouchStart(null)
  }

  const getAvatarEmoji = () => {
    switch (emotion) {
      case 'excited':
        return '😄'
      case 'magical':
        return '✨'
      case 'thinking':
        return '🤔'
      default:
        return '🌸'
    }
  }

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <Particles />

      {/* Response bubble */}
      {response && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-100 to-yellow-100 dark:from-pink-900 dark:to-yellow-900 px-6 py-3 rounded-2xl shadow-xl max-w-xs text-center animate-bounce-in border-2 border-pink-300 dark:border-pink-700">
          <p className="text-pink-900 dark:text-pink-100 text-sm font-medium">{response}</p>
        </div>
      )}

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute -top-4 right-0 flex gap-1">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}

      {/* Avatar emoji */}
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
          textShadow: isAnimating ? '0 0 30px rgba(255, 182, 193, 0.8)' : '0 0 20px rgba(255, 182, 193, 0.4)',
        }}
      >
        {getAvatarEmoji()}
      </div>

      {/* Glow effect */}
      <div
        className={`
          absolute inset-0 rounded-full blur-3xl transition-opacity duration-500
          ${isAnimating ? 'opacity-50' : 'opacity-20'}
        `}
        style={{
          background: 'radial-gradient(circle, #FFB6C1 0%, transparent 70%)',
        }}
      />

      {/* Touch hint */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-pink-700 dark:text-pink-300 text-xs text-center">
        Toca o desliza 💛
      </div>
    </div>
  )
}
