// src/app/page.tsx
'use client'

import { FairyWidget } from '@/features/fairy/components'

export default function HomePage() {
  const handleSpeak = (text: string) => {
    console.log('Speaking:', text)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-purple-900 dark:text-purple-100 mb-2 animate-fade-in">
            Magorya ✨
          </h1>
          <p className="text-lg md:text-xl text-purple-700 dark:text-purple-300">
            Tu hada mágica amiga
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
            Asistente con personalidad de maestra en psicopedagogía
          </p>
        </header>

        {/* Fairy Widget */}
        <div className="flex justify-center mb-16">
          <FairyWidget onSpeak={handleSpeak} />
        </div>

        {/* Instructions */}
        <div className="max-w-md mx-auto bg-white/50 dark:bg-gray-900/50 backdrop-blur rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4 text-center">
            ¿Cómo interactuar con Magorya?
          </h2>
          <ul className="space-y-3 text-purple-800 dark:text-purple-200">
            <li className="flex items-center gap-3">
              <span className="text-2xl">👆</span>
              <span>Toca a la hada para una frase mágica motivadora</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">👆↔️</span>
              <span>Desliza en diferentes direcciones para hechizos específicos</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">🎤</span>
              <span>Habla con ella (próximamente con voz)</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">💫</span>
              <span>Recibe consejos psicopedagógicos</span>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-700 text-center">
            <p className="text-sm text-purple-600 dark:text-purple-400 italic">
              "Cada interacción te deja sentir más mágica/o"
            </p>
          </div>
        </div>

        {/* Magical Features Preview */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur rounded-xl p-6 border border-purple-200 dark:border-purple-800 text-center">
            <div className="text-4xl mb-3">🧠</div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Psicopedagogía</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Respuestas basadas en principios de aprendizaje y desarrollo
            </p>
          </div>

          <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur rounded-xl p-6 border border-purple-200 dark:border-purple-800 text-center">
            <div className="text-4xl mb-3">💜</div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Empatía</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Compañía emocional con calidez y comprensión
            </p>
          </div>

          <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur rounded-xl p-6 border border-purple-200 dark:border-purple-800 text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Magia</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Frases motivadoras que iluminan tu día
            </p>
          </div>
        </div>
      </div>

      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">✨</div>
        <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🧚</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>💫</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>⭐</div>
      </div>
    </main>
  )
}
