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
