# 📋 BUSINESS_LOGIC.md - Magorya

> Generado por SaaS Factory | Fecha: 2026-03-14

---

## 1. Problema de Negocio

**Dolor:**
Las personas hoy viven abrumadas diariamente por múltiples problemas:
- Olvidan tareas y citas importantes
- Pierden tiempo tratando de organizar información dispersa
- Se sienten solas y necesitan acompañamiento
- Les cuesta tomar decisiones (parálisis por análisis)
- Todo esto ocurre **todos los días**

**Costo actual:**
Impacto integral en todas las áreas:
- Pérdida de productividad (15-25% del día)
- Estrés y ansiedad por desorganización
- Oportunidades perdidas (clientes, crecimiento)
- Soledad y falta de apoyo emocional

---

## 2. Solución

**Propuesta de valor:**
"Un asistente mágico amiga con personalidad de maestra en psicopedagogía, potenciado por OpenAI, que te acompaña, organiza y motiva con magia"

**Flujo principal (Happy Path):**
1. Usuario abre la app y ve a la hada 🧚
2. Usuario toca/habla/sube archivos a la hada
3. La hada responde con frase mágica + partículas + voz (basada en psicopedagogía + OpenAI)
4. Usuario se siente acompañado/a, motivado/a y organizado/a

---

## 3. Usuario Objetivo

**Rol:** Cualquier persona que necesite acompañamiento y organización
- Estudiantes abrumados
- Profesionales ocupados
- Personas que se sienten solas
- Cualquiera buscando un asistente divertido y útil

**Contexto:** Usuarios que interactúan diariamente con su dispositivo móvil y buscan una experiencia mágica y amigable

---

## 4. Arquitectura de Datos

**Input:**
- Toques y swipes en la hada
- Voz del usuario (grabación)
- Archivos (imágenes, audios, documentos)
- Eventos de Google Calendar
- Emails de Gmail
- Mensajes de Telegram

**Output:**
- Respuestas mágicas con voz (OpenAI + psicopedagogía)
- Efectos visuales (partículas ✨, brillos, animaciones)
- Recordatorios agendados
- Consejos basados en psicopedagogía
- Integración con Google Calendar/Gmail

**Storage (Supabase tables sugeridas):**
- `users`: Perfiles de usuarios
- `interactions`: Historial de interacciones con la hada
- `conversations`: Conversaciones con OpenAI
- `reminders`: Recordatorios agendados
- `ratings`: Calificaciones de usuarios

---

## 5. KPI de Éxito

**Métrica principal:** Calificaciones positivas de usuarios (4.5+ estrellas promedio)

---

## 6. Especificación Técnica (Para el Agente)

### Features a Implementar (Feature-First)

```
src/features/
├── auth/                    # Autenticación (Supabase)
├── fairy/                   # Hada interactiva principal
│   ├── components/          # HadaWidget, partículas, animaciones
│   ├── hooks/               # useFairyInteractions
│   └── services/            # fairyService (tap, swipe, voice)
├── ai/                      # OpenAI Integration
│   ├── services/            # openaiService (chat, voice)
│   └── prompts/             # System prompts (psicopedagogía)
├── integrations/            # Google + Telegram
│   ├── google/              # Calendar, Gmail
│   └── telegram/            # Bot de Telegram
├── reminders/               # Gestión de recordatorios
├── conversations/           # Historial de conversaciones
└── ratings/                 # Sistema de calificaciones
```

### Stack Confirmado
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind 3.4 + shadcn/ui
- **Mobile:** React Native o PWA (para Android)
- **Backend:** Supabase (Auth + Database + Storage)
- **AI:** OpenAI API (GPT-4 + Voice)
- **Integraciones:** Google API + Telegram Bot API
- **Validación:** Zod
- **State:** Zustand
- **MCPs:** Next.js DevTools + Playwright + Supabase

### Personalidad del Asistente
**Rol:** Maestra en psicopedagogía
- Todas las respuestas se basan en principios psicopedagógicos
- Tono: Amigable, mágico, motivador, empático
- Respuestas con emojis y frases inspiradoras
- Enfoque en desarrollo personal, aprendizaje y bienestar

### Integraciones

**Google Ecosystem:**
- Calendar: Leer/agregar eventos
- Gmail: Leer/responder emails
- Drive: Acceder a archivos

**Telegram:**
- Bot con la misma personalidad de la hada
- Comandos: /hada, /consejo, /recordar, /calificar

**OpenAI:**
- System prompt con personalidad psicopedagógica
- Voice API para respuestas habladas
- Contexto de conversaciones previas

---

## 7. Próximos Pasos

1. [ ] Setup proyecto base ✅ (completado)
2. [ ] Configurar Supabase (tables, auth)
3. [ ] Implementar Auth básico
4. [ ] Feature: Fairy Widget (hada interactiva)
5. [ ] Feature: OpenAI Integration (psicopedagogía)
6. [ ] Feature: Integraciones Google
7. [ ] Feature: Telegram Bot
8. [ ] Feature: Sistema de ratings
9. [ ] Testing E2E con Playwright
10. [ ] Deploy (Vercel + aplicaciones móviles)

---

## 8. Notas Especiales

- **Nombre:** Magorya (Mago + Hada + Raya = Magia)
- **Mascota:** Hada 🧚
- **Estética:** Mágica, brillante, partículas ✨
- **Plataformas:** Web (Next.js), Mobile (Android), Telegram
- **Voz:** Femenina, amigable, motivadora

---

*"Primero entiende el negocio. Después escribe código."*
