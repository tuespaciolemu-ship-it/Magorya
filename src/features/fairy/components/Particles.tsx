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
    let lastTime = 0

    const render = (currentTime: number) => {
      const deltaTime = currentTime - lastTime

      // Limit updates to ~60fps
      if (deltaTime < 16) {
        animationFrame = requestAnimationFrame(render)
        return
      }

      lastTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p: Particle) => {
        ctx.save()
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x * 2, p.y * 2, 3 * p.life + 1, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      updateParticles()
      animationFrame = requestAnimationFrame(render)
    }

    render(0)

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
