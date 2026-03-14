# 🌸 Chipurmogin - Tu Amiga Virtual

> **Chipurmogin** es una amiga virtual cercana, divertida y buena onda que está aquí para conversar contigo.

---

## ✨ Características

- 💬 **Chat Conversacional**: Interactúa mediante texto de forma natural
- 🎤 **Voz a Texto**: Usa el micrófono para dictar mensajes
- 🎙️ **Grabar Audio**: Graba y envía mensajes de voz
- 📁 **Subir Archivos**: Comparte imágenes, videos, audios y documentos
- 👆 **Avatar Interactivo**: Toca o desliza para frases rápidas
- 💛 **Personalidad Latina**: Español latino natural y cercano
- 🔊 **Texto a Voz**: Chipurmogin habla en español latino

---

## 🚀 Quick Start

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` con tus credenciales:

```bash
# OpenRouter (Chipurmogin AI)
OPENROUTER_API_KEY=sk-or-v1-tu-api-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Opcional: Supabase para guardar conversaciones
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 3. Iniciar Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🎯 Cómo Usar

### Chat de Texto
- Escribe directamente en el chat
- Chipurmogin responderá y te hablará 🎙️

### Dictado por Voz
- Presiona el botón 🎤 para dictar tu mensaje
- Habla y tu texto aparecerá automáticamente

### Grabar Mensajes de Voz
- Presiona el botón 🎙️ (grabadora) para grabar
- Vuelve a presionar ⏹️ cuando termines
- Envía tu mensaje de voz

### Subir Archivos
- Presiona el botón 📁 para subir archivos
- Soporta:
  - 🖼️ **Imágenes** (JPG, PNG, GIF, WEBP)
  - 🎵 **Audio** (MP3, WAV, OGG)
  - 🎥 **Videos** (MP4, WEBM)
  - 📄 **Documentos** (PDF, DOC, TXT)

### Avatar Interactivo
- Toca el avatar para frases rápidas
- Desliza en diferentes direcciones
- Partículas animadas rosa/amarillo/púrpura

---

## 🛠️ Tech Stack

| Tecnología | Uso |
|------------|-----|
| **Next.js 16** | Framework React con App Router |
| **React 19** | UI Library |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Estilos |
| **Zustand** | State Management |
| **OpenRouter** | AI Engine (Claude 3.5 Sonnet) |
| **Web Speech API** | Voice Input/Output |
| **MediaRecorder API** | Audio Recording |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx                    # Página principal
│   └── globals.css                 # Estilos globales
│
├── features/
│   ├── chatbot/
│   │   └── components/
│   │       └── ChipurmoginChat.tsx # Chat con todas las funciones
│   │
│   ├── fairy/
│   │   ├── components/
│   │   │   ├── FairyWidget.tsx     # Avatar interactivo
│   │   │   └── Particles.tsx       # Efectos de partículas
│   │   └── store/
│   │       └── fairyStore.ts       # Estado
│   │
│   └── ai/
│       ├── services/
│       │   └── openrouterService.ts # Cliente OpenRouter
│       └── prompts/
│           └── systemPrompt.ts      # Personalidad latina
│
└── types/
    └── fairy.ts                    # Tipos compartidos
```

---

## 🌟 Personalidad

Chipurmogin es:

- **Latina**: Español latino con modismos naturales
- **Cercana**: Habla como una amiga real
- **Divertida**: Con humor y buena onda
- **Equilibrada**: No es exageradamente zalamera
- **Natural**: Respuestas claras y directas

### Expresiones Latinas
- ✅ "¿Qué onda?", "¿Qué pedo?", "¡Está chido!"
- ✅ "¡Ta bien!", "¡Dale!", "¡Qué rollo!"
- ✅ "Computadora", "celular", "carro"

---

## 🎨 Colores y Estilo

- **Rosa** (#FFB6C1): Calidez y amistad
- **Amarillo** (#FFD700): Alegría y positividad
- **Púrpura** (#DDA0DD): Creatividad

---

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor producción
npm run lint         # ESLint
npm run typecheck    # Verificación TypeScript
```

---

## 🔒 Seguridad

- ✅ Validación de archivos por tipo
- ✅ Variables de entorno protegidas
- ✅ Sin exposición de secrets

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

Configura las variables de entorno en el dashboard de Vercel.

---

## 📝 Licencia

MIT

---

**Hecho con 💛 y diversión por Chipurmogin**
