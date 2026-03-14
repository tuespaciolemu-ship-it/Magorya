# 🧚 Magorya - Asistente Mágico con Hada Compañera

> **Magorya** es un asistente personal amigable con personalidad de maestra en psicopedagogía.
> Acompaña, organiza y motiva con magia ✨

---

## ✨ Características

- 🧚 **Hada Compañera Interactiva**: Toca, desliza y habla con tu hada mágica
- 🎙️ **Interacción por Voz**: Usa voz para comunicarte con Magorya
- 🧠 **Psicopedagogía**: Todas las respuestas basadas en principios de enseñanza experta
- ✨ **Efectos Mágicos**: Partículas brillantes y animaciones
- 🎨 **Interfaz Mágica**: Diseño colorido y encantador

---

## 🚀 Quick Start

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` con tus credenciales:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# OpenRouter (Magorya AI)
OPENROUTER_API_KEY=sk-or-v1-tu-api-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

### 3. Iniciar Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🎯 Cómo Usar

### Interacciones con el Hada

- **Tocar el hada**: Recibe frases motivadoras mágicas
- **Deslizar**: Direcciones diferentes dan respuestas únicas
- **Voz**: Presiona el micrófono y habla con Magorya
- **Archivos**: Arrastra archivos para compartir con tu hada

---

## 🛠️ Tech Stack

| Tecnología | Uso |
|------------|-----|
| **Next.js 16** | Framework React con App Router |
| **React 19** | UI Library |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Estilos |
| **Zustand** | State Management |
| **Supabase** | Database + Auth |
| **OpenRouter** | AI Engine (Claude 3.5 Sonnet) |
| **Web Speech API** | Text-to-Speech |
| **Canvas API** | Partículas y efectos |

---

## 📁 Estructura del Proyecto

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Página principal del hada
│   └── globals.css            # Estilos globales y animaciones
│
├── features/
│   ├── fairy/                 # Feature del Hada Mágica
│   │   ├── components/
│   │   │   ├── FairyWidget.tsx    # Componente principal del hada
│   │   │   └── Particles.tsx      # Sistema de partículas
│   │   ├── store/
│   │   │   └── fairyStore.ts      # Estado del hada (Zustand)
│   │   └── types/
│   │       └── fairy.ts           # Tipos del hada
│   │
│   └── ai/                    # Feature de IA
│       ├── services/
│       │   └── openrouterService.ts  # Cliente OpenRouter
│       └── prompts/
│           └── systemPrompt.ts      # Prompt psicopedagógico
│
├── lib/
│   └── openrouter/
│       └── client.ts          # Cliente API de OpenRouter
│
└── types/
    └── fairy.ts               # Tipos compartidos
```

---

## 🧠 Personalidad Psicopedagógica

Magorya está diseñada con principios de psicopedagogía:

1. **Aprendizaje Significativo**: Conecta respuestas con tu experiencia
2. **Zona de Desarrollo Próximo**: Ofrece retos alcanzables
3. **Refuerzo Positivo**: Celebra logros, por pequeños que sean
4. **Metacognición**: Ayuda a reflexionar sobre tu aprendizaje
5. **Autoeficacia**: Fortalece tu confianza en tus capacidades

---

## 🎨 Animaciones y Efectos

- **Float**: Animación flotante mágica
- **Bounce-in**: Aparición con rebote
- **Fade-in**: Desvanecimiento suave
- **Glow**: Efectos de brillo pulsante

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

- ✅ Validación de entrada con Zod
- ✅ RLS (Row Level Security) en Supabase
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

**Hecho con ✨ y magia por Magorya**
