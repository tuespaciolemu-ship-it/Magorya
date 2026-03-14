// src/app/page.tsx - Página principal estilo Antigravity
'use client'

import { ChipurmoginChat } from '@/features/chatbot/components'

export default function HomePage() {
  return (
    <main className="min-h-screen magical-bg relative">
      {/* Fondo con gradiente mágico */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 -z-10"></div>

      {/* Contenedor de sparkles */}
      <div id="sparkle" className="fixed inset-0 pointer-events-none z-0"></div>

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {/* Título decorativo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent mb-2 animate-fade-in">
            🌸 Antigravity Asistente Mágico
          </h1>
          <p className="text-lg md:text-xl text-purple-700 dark:text-purple-300">
            Tu amiga virtual con inteligencia artificial ✨
          </p>
        </div>

        {/* Chat */}
        <ChipurmoginChat />

        {/* Instrucciones */}
        <div className="max-w-md mx-auto mt-8 bg-white/50 backdrop-blur rounded-2xl p-6 shadow-xl border border-pink-200">
          <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 text-center">
            🌟 Cómo usar tu asistente
          </h2>
          <ul className="space-y-3 text-purple-800 dark:text-purple-200">
            <li className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <span>Escribe o usa el micrófono para conversar</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <span>Genera imágenes con IA</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">📁</span>
              <span>Gestiona tus proyectos</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span>Destellos mágicos en cada interacción</span>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-pink-200 text-center">
            <p className="text-sm text-purple-600 dark:text-purple-400 italic">
              "Tu magia interior brilla hoy"
            </p>
          </div>
        </div>
      </div>

      {/* Elementos flotantes decorativos */}
      <div className="fixed top-20 left-10 text-6xl opacity-20 animate-float z-0">🌸</div>
      <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float z-0" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-float z-0" style={{ animationDelay: '2s' }}>💫</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-float z-0" style={{ animationDelay: '0.5s' }}>⭐</div>
    </main>
  )
}
