// src/app/page.tsx
'use client'

import { ChipurmoginChat } from '@/features/chatbot/components/ChipurmoginChat'
import { FairyWidget } from '@/features/fairy/components'

export default function HomePage() {
  const handleSpeak = (text: string) => {
    console.log('Speaking:', text)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100 dark:from-pink-950 dark:via-yellow-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent mb-2 animate-fade-in">
            Chipurmogin 💛
          </h1>
          <p className="text-lg md:text-xl text-pink-700 dark:text-pink-300">
            Tu amiga virtual cercana y divertida
          </p>
          <p className="text-sm text-pink-600 dark:text-pink-400 mt-2">
            ¡Conversa, comparte y disfruta! ✨
          </p>
        </header>

        {/* Main Chat Section */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <ChipurmoginChat />
          </div>
        </div>

        {/* Fairy Widget - Alternative Interaction */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur rounded-2xl p-6 shadow-xl border border-pink-200 dark:border-pink-800">
            <h2 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 text-center">
              O también puedes interactuar con el avatar 🌸
            </h2>
            <FairyWidget onSpeak={handleSpeak} />
            <p className="text-center text-sm text-pink-600 dark:text-pink-400 mt-4">
              Toca o desliza el avatar para frases rápidas
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-2xl mx-auto bg-white/50 dark:bg-gray-900/50 backdrop-blur rounded-2xl p-6 shadow-xl border border-pink-200 dark:border-pink-800">
          <h2 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4 text-center">
            ¿Cómo interactuar con Chipurmogin?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⌨️</span>
              <div>
                <h3 className="font-semibold text-pink-800 dark:text-pink-200">Escribe en el chat</h3>
                <p className="text-sm text-pink-700 dark:text-pink-300">Usa el teclado para conversar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎤</span>
              <div>
                <h3 className="font-semibold text-pink-800 dark:text-pink-200">Usa el micrófono</h3>
                <p className="text-sm text-pink-700 dark:text-pink-300">Habla y tu mensaje aparecerá</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">👆</span>
              <div>
                <h3 className="font-semibold text-pink-800 dark:text-pink-200">Toca el avatar</h3>
                <p className="text-sm text-pink-700 dark:text-pink-300">Frases rápidas y divertidas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-semibold text-pink-800 dark:text-pink-200">Respuestas rápidas</h3>
                <p className="text-sm text-pink-700 dark:text-pink-300">Botones de sugerencias</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-pink-200 dark:border-pink-700 text-center">
            <p className="text-sm text-pink-600 dark:text-pink-400 italic">
              "Soy tu amiga virtual, aquí para escucharte y conversar 💛"
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur rounded-xl p-6 border border-pink-200 dark:border-pink-800 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">Chat Natural</h3>
            <p className="text-sm text-pink-700 dark:text-pink-300">
              Conversa como con una amiga real, sin complicaciones
            </p>
          </div>

          <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur rounded-xl p-6 border border-pink-200 dark:border-pink-800 text-center">
            <div className="text-4xl mb-3">🎤</div>
            <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">Voz a Texto</h3>
            <p className="text-sm text-pink-700 dark:text-pink-300">
              Habla en lugar de escribir, más rápido y natural
            </p>
          </div>

          <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur rounded-xl p-6 border border-pink-200 dark:border-pink-800 text-center">
            <div className="text-4xl mb-3">💛</div>
            <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">Siempre Ahí</h3>
            <p className="text-sm text-pink-700 dark:text-pink-300">
              Disponible cuando necesites conversar o despejarte
            </p>
          </div>
        </div>
      </div>

      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🌸</div>
        <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>💛</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>😄</div>
      </div>
    </main>
  )
}
