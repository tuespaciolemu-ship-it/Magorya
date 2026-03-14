// src/features/chatbot/components/ChipurmoginChat.tsx - Todos los botones funcionales
'use client'

import { useState, useRef, useEffect } from 'react'
import { useFairyStore } from '@/features/fairy/store/fairyStore'
import { getChatResponse, generateImageWithOpenRouter, speak as speakText, type ChatMessage } from '@/features/ai/services'
import { userStorage, type UsuarioData, type Proyecto } from '@/lib/storage/userStorage'

interface Message {
  id: string
  type: 'bot' | 'user' | 'file' | 'audio' | 'image' | 'emoji' | 'system' | 'project'
  content: string
  timestamp: Date
  fileUrl?: string
  fileName?: string
  fileType?: string
  audioDuration?: number
  proyecto?: Proyecto
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  type: 'system',
  content: '¡Qué onda! Soy Chipurmogin, tu amiga virtual 💛✨\n\nAntes de empezar, ¿cuál es tu nombre?',
  timestamp: new Date(),
}

const QUICK_REPLIES = [
  { id: 'que-onda', label: '¿Qué onda?', action: 'hola' },
  { id: 'consejo', label: 'Necesito un consejo', action: 'consejo' },
  { id: 'cuentame', label: 'Cuéntame algo', action: 'random' },
  { id: 'proyectos', label: 'Ver mis proyectos', action: 'proyectos' },
  { id: 'imagen', label: 'Generar imagen', action: 'imagen' },
]

const EMOJI_OPTIONS = ['😄', '😍', '🥰', '😂', '🤗', '💪', '🎉', '🌟', '💛', '🙏']

const CONSEJOS = [
  "¡Hoy es un buen día para intentar algo nuevo! 💛",
  "Recuerda respirar hondo. Todo va a estar bien ✨",
  "Eres más fuerte de lo que crees. ¡Tú puedes! 💪",
  "Un paso a la vez. No te apresures 🌸",
  "¡Sonríe! Cambia tu energía, cambia tu día 😄",
  "Agradece por 3 cosas hoy. Verás la magia ✨",
  "Descansa un rato. Mereces un break 💛",
]

const DATOS_CURSOS = [
  "¿Sabías que los pulpos tienen 3 corazones? 🐙",
  "¿Sabías que las hormigas pueden levantar 50 veces su peso? 🐜",
  "¿Sabías que los pingüinos pueden saltar hasta 3 metros de altura? 🐧",
  "¿Sabías que el chocolate fue usado como moneda? 🍫",
  "¿Sabías que los caracoles pueden dormir por 3 años? 🐌",
  "¿Sabías que los elefantes son los únicos animales que no pueden saltar? 🐘",
]

export function ChipurmoginChat() {
  // Estado para controlar si ya se cargó el usuario (evitar hydration mismatch)
  const [hydrated, setHydrated] = useState(false)

  // Usuario - inicializar vacío para SSR, cargar real en cliente
  const [usuario, setUsuario] = useState<UsuarioData>({
    nombre: '',
    registrado: false,
    password: '',
    genero: 'otro',
    nombreHada: 'Chipurmogin',
    memoria: [],
    proyectos: [],
    imagenesDiarias: 0,
    diasPrueba: 3,
    fechaRegistro: new Date()
  })

  // Cargar usuario guardado solo en cliente después de hidratación
  useEffect(() => {
    const saved = userStorage.getUsuario()
    if (saved) {
      setUsuario(saved)
    }
    setHydrated(true)
  }, [])

  // Estado del chat
  const [messages, setMessages] = useState<Message[]>(() => {
    if (usuario.nombre) {
      return [{
        id: '1',
        type: 'bot',
        content: `¡Hola de nuevo, ${usuario.nombre}! 💛✨\n\n¿Qué cuentas? ¿En qué te puedo ayudar hoy?`,
        timestamp: new Date()
      }]
    }
    return [INITIAL_MESSAGE]
  })

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([])
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  // Paneles y modales
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showProjectsPanel, setShowProjectsPanel] = useState(false)
  const [showImageGenerator, setShowImageGenerator] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showMemory, setShowMemory] = useState(false)

  // Generador de imágenes
  const [imagePrompt, setImagePrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // Configuración
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoSpeak, setAutoSpeak] = useState(true)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Store
  const emotion = useFairyStore((s) => s.emotion)
  const setEmotion = useFairyStore((s) => s.setEmotion)
  const setResponse = useFairyStore((s) => s.setResponse)

  // Fecha y hora
  const fechaStr = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
  const horaStr = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Guardar usuario
  useEffect(() => {
    userStorage.setUsuario(usuario)
  }, [usuario])

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Setup
  useEffect(() => {
    // Speech Recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'es-MX'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }

    // Cargar voces
    if ('speechSynthesis' in window) {
      const loadVoices = () => speechSynthesis.getVoices()
      loadVoices()
      speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
    }
  }, [])

  // Texto a voz con emociones
  const speakWithEmotion = async (text: string, emotion: 'neutral' | 'alegre' | 'triste' | 'emocionado' = 'neutral') => {
    if (!soundEnabled || !autoSpeak) return

    // Detectar emoción del texto si no se especifica
    let detectedEmotion = emotion

    if (emotion === 'neutral') {
      if (text.includes('😄') || text.includes('😍') || text.includes('✨') || text.includes('🎉')) {
        detectedEmotion = 'alegre'
      } else if (text.includes('😢') || text.includes('😭')) {
        detectedEmotion = 'triste'
      } else if (text.includes('😮') || text.includes('🤔') || text.includes('😱')) {
        detectedEmotion = 'emocionado'
      }
    }

    // Usar el servicio de TTS
    await speakText(text, {
      lang: 'es-MX',
      pitch: usuario.genero === 'mujer' ? 1.3 : usuario.genero === 'hombre' ? 1.0 : 1.2,
      rate: 1,
      emotion: detectedEmotion
    })
  }

  // Agregar mensaje bot
  const addBotMessage = async (content: string, type: 'bot' | 'system' = 'bot') => {
    setIsTyping(true)
    setEmotion('thinking')

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type,
        content,
        timestamp: new Date()
      }])
      setIsTyping(false)
      setEmotion('happy')
      setResponse(content)
    }, 600 + Math.random() * 400)
  }

  // Generar imagen
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return

    const puedeInfo = userStorage.puedeGenerarImagen(usuario)
    if (!puedeInfo.puede) {
      addBotMessage(puedeInfo.razon || 'No puedes generar más imágenes hoy', 'system')
      speakWithEmotion('Lo siento, alcanzaste el límite', 'triste')
      return
    }

    setIsGeneratingImage(true)
    setShowImageGenerator(false)
    addBotMessage('¡Genial! Estoy creando tu imagen... 🎨✨', 'system')

    try {
      const image = await generateImageWithOpenRouter(imagePrompt, process.env.OPENROUTER_API_KEY || '')

      const usuarioActualizado = userStorage.incrementarImagenes(usuario)
      setUsuario(usuarioActualizado)

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'image',
        content: `Imagen: "${imagePrompt}"`,
        timestamp: new Date(),
        fileUrl: image.url
      }])

      setImagePrompt('')

      addBotMessage(
        `¡Imagen lista! ✨\n\n📊 ${usuarioActualizado.imagenesDiarias}/${usuarioActualizado.registrado ? 20 : 10} imágenes hoy.\n\n¿Te gusta?`,
        'bot'
      )
      speakWithEmotion('¡Tu imagen está lista!', 'alegre')

    } catch (error) {
      console.error('Error generando imagen:', error)
      addBotMessage('¡Ay! Error al generar la imagen 💛\n\nInténtalo de nuevo.', 'system')
    }

    setIsGeneratingImage(false)
  }

  // Acciones de quick replies
  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'hola':
        addBotMessage(`¡Qué onda, ${usuario.nombre || 'amigo/a'}! 😄💛\n\n¿Qué cuentas? ¿Cómo estás?`)
        speakWithEmotion('¡Qué onda! ¿Qué cuentas?', 'alegre')
        break

      case 'consejo':
        const consejo = CONSEJOS[Math.floor(Math.random() * CONSEJOS.length)]
        addBotMessage(`💡 ${consejo}`)
        speakWithEmotion(consejo, 'emocionado')
        break

      case 'random':
        const dato = DATOS_CURSOS[Math.floor(Math.random() * DATOS_CURSOS.length)]
        addBotMessage(`✨ ${dato}\n\n¿Te gustó? ¿Quieres saber más?`)
        speakWithEmotion('¿Sabías qué? ' + dato, 'emocionado')
        break

      case 'proyectos':
        setShowProjectsPanel(true)
        if (usuario.proyectos.length === 0) {
          addBotMessage('Aún no tienes proyectos 📁\n\nDime: "Crear proyecto [nombre]"', 'system')
        } else {
          const lista = usuario.proyectos.map((p, i) =>
            `${i + 1}. ${p.completado ? '✅' : '📋'} ${p.titulo}`
          ).join('\n')
          addBotMessage(`📁 Tus proyectos:\n\n${lista}`, 'system')
        }
        speakWithEmotion(`Tienes ${usuario.proyectos.length} proyectos`, 'neutral')
        break

      case 'imagen':
        setShowImageGenerator(true)
        addBotMessage('¡Vamos a crear una imagen! 🎨\n\nDescribe lo que quieres ver...', 'system')
        speakWithEmotion('¿Qué imagen quieres crear?', 'neutral')
        break
    }
  }

  // Enviar mensaje
  const handleSend = async () => {
    if (!input.trim() && !attachedFile && !audioBlob) return

    // Registro inicial - nombre
    if (!usuario.nombre && !usuario.registrado) {
      const nombre = input.trim()
      if (nombre.length > 0) {
        const nuevoUsuario: UsuarioData = { ...usuario, nombre, registrado: true, fechaRegistro: new Date() }
        setUsuario(nuevoUsuario)

        setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: nombre, timestamp: new Date() }])
        setInput('')

        addBotMessage(
          `¡Qué gusto, ${nombre}! 💛✨\n\n¿Eres mujer, hombre u otro? (Para mi voz)\n\n📅 ${fechaStr} | 🕐 ${horaStr}`
        )
        return
      }
    }

    // Registro inicial - género
    if (usuario.nombre && usuario.genero === 'otro' && messages.length <= 4) {
      const respuesta = input.toLowerCase()
      let nuevoGenero: 'mujer' | 'hombre' | 'otro' = 'otro'

      if (respuesta.includes('mujer') || respuesta.includes('chica')) nuevoGenero = 'mujer'
      else if (respuesta.includes('hombre') || respuesta.includes('chico')) nuevoGenero = 'hombre'

      setUsuario(prev => ({ ...prev, genero: nuevoGenero }))

      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: input, timestamp: new Date() }])
      setInput('')

      addBotMessage(
        `¡Listo! Voz configurada 💛\n\n¿Qué onda? ¿En qué te puedo ayudar?\n\n` +
        '💬 Platicar | 💡 Consejos\n📁 Proyectos | 🎨 Imágenes\n😊 Emojis | 📁 Archivos\n🎙️ Audios'
      )
      speakWithEmotion('¡Perfecto! ¿Qué onda?', 'alegre')
      return
    }

    // Comandos
    const lowerInput = input.toLowerCase().trim()

    // Crear proyecto
    if (lowerInput.startsWith('crear proyecto') || lowerInput.startsWith('nuevo proyecto')) {
      const titulo = input.replace(/crear proyecto|nuevo proyecto/gi, '').trim()
      if (titulo) {
        const usuarioActualizado = userStorage.crearProyecto(usuario, titulo)
        setUsuario(usuarioActualizado)
        setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: input, timestamp: new Date() }])
        setInput('')
        addBotMessage(`¡Proyecto creado! 📁\n\n✨ "${titulo}"`, 'bot')
        speakWithEmotion('¡Proyecto creado!', 'alegre')
        return
      }
    }

    // Completar proyecto
    if (lowerInput.startsWith('completar') || lowerInput.startsWith('terminar')) {
      const numero = parseInt(input.replace(/completar|terminar/gi, '').trim())
      if (!isNaN(numero) && numero > 0 && numero <= usuario.proyectos.length) {
        const proyecto = usuario.proyectos[numero - 1]
        const usuarioActualizado = userStorage.actualizarProyecto(usuario, proyecto.id, { completado: true })
        setUsuario(usuarioActualizado)
        setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: input, timestamp: new Date() }])
        setInput('')
        addBotMessage(`¡Proyecto completado! 🎉\n\n✅ "${proyecto.titulo}"`, 'bot')
        speakWithEmotion('¡Proyecto completado!', 'alegre')
        return
      }
    }

    // Borrar proyecto
    if (lowerInput.startsWith('borrar proyecto') || lowerInput.startsWith('eliminar proyecto')) {
      const numero = parseInt(input.replace(/borrar proyecto|eliminar proyecto/gi, '').trim())
      if (!isNaN(numero) && numero > 0 && numero <= usuario.proyectos.length) {
        const proyecto = usuario.proyectos[numero - 1]
        const usuarioActualizado = userStorage.eliminarProyecto(usuario, proyecto.id)
        setUsuario(usuarioActualizado)
        setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: input, timestamp: new Date() }])
        setInput('')
        addBotMessage(`Proyecto borrado 🗑️\n\n"${proyecto.titulo}"`, 'bot')
        speakWithEmotion('Proyecto eliminado', 'neutral')
        return
      }
    }

    // Limpiar memoria
    if (lowerInput === 'limpiar memoria' || lowerInput === 'borrar memoria') {
      const usuarioActualizado = { ...usuario, memoria: [] }
      setUsuario(usuarioActualizado)
      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: input, timestamp: new Date() }])
      setInput('')
      addBotMessage('Memoria limpiada 🧹✨\n\nNuestra conversación empieza de nuevo.', 'bot')
      speakWithEmotion('Memoria limpiada', 'neutral')
      return
    }

    // Audio
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'audio',
        content: '🎙️ Mensaje de voz',
        timestamp: new Date(),
        fileUrl: audioUrl,
        audioDuration: recordingTime
      }])
      setAudioBlob(null)
      setRecordingTime(0)
      addBotMessage('¡Escuché tu audio! 🎙️\n\n¿Qué más cuentas?', 'bot')
      speakWithEmotion('¡Escuché tu mensaje!', 'alegre')
      return
    }

    // Archivo
    if (attachedFile) {
      const fileUrl = URL.createObjectURL(attachedFile)
      let response = ''

      if (attachedFile.type.startsWith('image')) response = '¡Qué imagen tan chida! 🌸'
      else if (attachedFile.type.startsWith('audio')) response = '¡Audio recibido! 🎵'
      else if (attachedFile.type.startsWith('video')) response = '¡Video recibido! 🎥'
      else if (attachedFile.type === 'application/pdf') response = '¡PDF recibido! 📄'
      else response = `¡Archivo "${attachedFile.name}" recibido! ✨`

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'file',
        content: `📁 ${attachedFile.name}`,
        timestamp: new Date(),
        fileUrl,
        fileName: attachedFile.name,
        fileType: attachedFile.type
      }])
      setAttachedFile(null)
      addBotMessage(response, 'bot')
      speakWithEmotion('¡Lo tengo!', 'alegre')
      return
    }

    // Mensaje normal
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: input, timestamp: new Date() }])
    const messageText = input
    setInput('')

    // Emoji
    if (/^\p{Emoji}+$/u.test(messageText.trim())) {
      addBotMessage(`¡Recibí tu emoji ${messageText}! 😄💛`)
      speakWithEmotion('¡Me late!', 'alegre')
      return
    }

    // IA
    const newHistory = [...conversationHistory.slice(-10), { role: 'user', content: messageText }]
    setConversationHistory(newHistory)

    try {
      setEmotion('thinking')
      const aiResponse = await getChatResponse(messageText, newHistory, usuario.nombre)

      addBotMessage(aiResponse.text)

      const usuarioActualizado = userStorage.agregarConversacion(usuario, messageText, aiResponse.text)
      setUsuario(usuarioActualizado)

      setConversationHistory(prev => [...prev, { role: 'assistant', content: aiResponse.text }])

      speakWithEmotion(aiResponse.text, 'neutral')
    } catch (error) {
      addBotMessage('¡Ay! Ocurrió un error 💛\n\nInténtalo de nuevo.')
    }
  }

  // Quick reply
  const handleQuickReply = (reply: string) => {
    setInput(reply)
    setTimeout(() => handleSend(), 100)
  }

  // Emoji
  const handleEmojiSend = (emoji: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'emoji', content: emoji, timestamp: new Date() }])
    setShowEmojiPicker(false)
    addBotMessage(`¡Recibí tu emoji ${emoji}! 😄💛`)
    speakWithEmotion('¡Me late!', 'alegre')
  }

  // Dictado
  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  // Grabar
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mediaRecorder.onstop = () => {
        setAudioBlob(new Blob(audioChunksRef.current, { type: 'audio/webm' }))
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingTimerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000)
    } catch (error) {
      addBotMessage('¡Ay! No pude acceder al micrófono 🎙️', 'system')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
    }
  }

  const cancelRecording = () => {
    stopRecording()
    setAudioBlob(null)
    setRecordingTime(0)
  }

  // Archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAttachedFile(file)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const getAvatar = () => {
    switch (emotion) {
      case 'excited': return '😄'
      case 'magical': return '✨'
      case 'thinking': return '🤔'
      default: return '🌸'
    }
  }

  const diasPrueba = userStorage.diasPruebaRestantes(usuario)

  return (
    <>
      {/* Burbuja flotante para minimizar/restaurar chat */}
      <div
        id="burbuja"
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-2xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-50"
        onClick={() => {
          const chat = document.getElementById('chat-container-wrapper')
          if (chat) {
            const isHidden = chat.style.display === 'none'
            chat.style.display = isHidden ? 'flex' : 'none'
          }
        }}
        title="Minimizar/Restaurar chat"
      >
        ✨
      </div>

      {/* Chat wrapper */}
      <div id="chat-container-wrapper" className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="relative z-20 flex flex-col h-[650px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-pink-200 w-full max-w-2xl">
          {/* Onda decorativa */}
          <div className="wave"></div>

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-yellow-300 text-white p-2 flex items-center gap-2">
        <div className="text-3xl">{getAvatar()}</div>
        <div className="flex-1">
          <h3 className="font-bold">Chipurmogin</h3>
          <p className="text-xs text-white/80">{usuario.nombre ? `Hola, ${usuario.nombre}!` : 'Tu amiga virtual'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-white/20 rounded"
            title="Configuración"
          >⚙️</button>
          <button
            onClick={() => setShowMemory(!showMemory)}
            className="p-1 hover:bg-white/20 rounded"
            title="Memoria"
          >🧠</button>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span>En línea</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-pink-50 px-3 py-2 border-b border-pink-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span>🔊 Sonido</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1 rounded-full ${soundEnabled ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            >{soundEnabled ? 'ON' : 'OFF'}</button>
          </div>
          <div className="flex items-center justify-between">
            <span>🗣️ Auto-hablar</span>
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`px-3 py-1 rounded-full ${autoSpeak ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
            >{autoSpeak ? 'ON' : 'OFF'}</button>
          </div>
        </div>
      )}

      {/* Memory Panel */}
      {showMemory && (
        <div className="bg-yellow-50 px-3 py-2 border-b border-yellow-200 text-xs max-h-24 overflow-y-auto">
          <p className="font-semibold mb-1">🧠 Memoria ({usuario.memoria.length} mensajes)</p>
          {usuario.memoria.length === 0 ? (
            <p className="text-gray-500">Sin memoria aún</p>
          ) : (
            <ul className="space-y-1">
              {usuario.memoria.slice(-5).map((msg, i) => (
                <li key={i} className="truncate text-gray-600">• {msg.input.substring(0, 40)}...</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Info bar */}
      <div className="bg-pink-50 px-3 py-1 flex items-center justify-between text-xs text-pink-700 border-b border-pink-100">
        <div className="flex gap-3">
          <button onClick={() => setShowProjectsPanel(true)} className="hover:text-pink-900">
            📁 {usuario.proyectos.length} proyectos
          </button>
          <button onClick={() => setShowImageGenerator(true)} className="hover:text-pink-900">
            🎨 {usuario.imagenesDiarias}/{usuario.registrado ? 20 : 10}
          </button>
          <span>{fechaStr}</span>
        </div>
        {!usuario.registrado && diasPrueba > 0 && <span className="text-orange-600">⏰ {diasPrueba}d</span>}
      </div>

      {/* Messages - chat-container */}
      <div id="chat-container" className="flex-1 overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-pink-50 to-yellow-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${['user', 'file', 'audio', 'emoji'].includes(msg.type) ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'bot' && <div className="text-lg mr-1">{getAvatar()}</div>}
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              msg.type === 'user' || msg.type === 'file' || msg.type === 'audio' || msg.type === 'emoji'
                ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                : msg.type === 'system'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                : msg.type === 'image'
                ? 'bg-purple-100 border-2 border-purple-300'
                : 'bg-white border border-pink-100'
            }`}>
              {msg.type === 'file' && msg.fileUrl && msg.fileType?.startsWith('image') && (
                <img src={msg.fileUrl} alt={msg.fileName} className="max-w-full rounded mb-2" />
              )}
              {msg.type === 'file' && msg.fileUrl && msg.fileType?.startsWith('audio') && (
                <audio src={msg.fileUrl} controls className="max-w-full mb-2" />
              )}
              {msg.type === 'audio' && msg.fileUrl && (
                <audio src={msg.fileUrl} controls className="max-w-full mb-2" />
              )}
              {msg.type === 'image' && msg.fileUrl && (
                <div className="space-y-2">
                  <img src={msg.fileUrl} alt="Generada" className="max-w-full rounded" />
                  <button
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = msg.fileUrl!
                      a.download = `chipurmogin-${Date.now()}.png`
                      a.click()
                    }}
                    className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full"
                  >💾 Descargar</button>
                </div>
              )}
              {msg.type === 'emoji' && <div className="text-2xl text-center">{msg.content}</div>}
              <p className="whitespace-pre-line">{msg.content}</p>
              <p
                className={`text-[9px] mt-1 ${['user', 'file', 'audio', 'emoji', 'image'].includes(msg.type) ? 'text-white/60' : 'text-gray-400'}`}
                suppressHydrationWarning={true}
              >
                {msg.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Quick Replies */}
        {messages.length > 0 && messages[messages.length - 1].type === 'bot' && !isTyping && (
          <div className="flex flex-wrap gap-1">
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr.id}
                onClick={() => handleQuickAction(qr.action)}
                className="px-2 py-1 bg-white border border-pink-300 text-pink-600 rounded-full text-xs hover:bg-pink-50"
              >{qr.label}</button>
            ))}
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="bg-white p-2 rounded-lg shadow border border-pink-200">
            <div className="flex flex-wrap gap-1 justify-center">
              {EMOJI_OPTIONS.map((e, i) => (
                <button key={i} onClick={() => handleEmojiSend(e)} className="text-xl hover:scale-125">{e}</button>
              ))}
            </div>
          </div>
        )}

        {/* Image Generator */}
        {showImageGenerator && (
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">🎨 Generar Imagen</h4>
            <input
              type="text"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Describe la imagen..."
              className="w-full px-2 py-1 border border-purple-300 rounded text-sm mb-2"
              disabled={isGeneratingImage}
            />
            <div className="flex gap-2">
              <button onClick={handleGenerateImage} disabled={!imagePrompt.trim() || isGeneratingImage}
                className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 disabled:opacity-50">
                {isGeneratingImage ? '...' : 'Generar ✨'}
              </button>
              <button onClick={() => setShowImageGenerator(false)} className="px-3 py-1 bg-gray-300 rounded text-sm">
                ✕
              </button>
            </div>
            <p className="text-[10px] text-purple-700 mt-1">{usuario.imagenesDiarias}/{usuario.registrado ? 20 : 10} hoy</p>
          </div>
        )}

        {/* Projects Panel */}
        {showProjectsPanel && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-900">📁 Mis Proyectos</h4>
              <button onClick={() => setShowProjectsPanel(false)} className="text-blue-500">✕</button>
            </div>
            {usuario.proyectos.length === 0 ? (
              <p className="text-sm text-gray-500 mb-2">Sin proyectos</p>
            ) : (
              <div className="space-y-1 mb-2">
                {usuario.proyectos.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2 text-sm bg-white p-2 rounded">
                    <span>{p.completado ? '✅' : '📋'}</span>
                    <span className="flex-1 truncate">{p.titulo}</span>
                    <button
                      onClick={() => {
                        const actualizado = userStorage.actualizarProyecto(usuario, p.id, { completado: !p.completado })
                        setUsuario(actualizado)
                      }}
                      className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded"
                    >{p.completado ? '↩️' : '✓'}</button>
                    <button
                      onClick={() => {
                        const actualizado = userStorage.eliminarProyecto(usuario, p.id)
                        setUsuario(actualizado)
                      }}
                      className="text-xs bg-red-500 text-white px-2 py-0.5 rounded"
                    >🗑️</button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-gray-500">Escribe "Crear proyecto [nombre]" para agregar</p>
          </div>
        )}

        {/* Typing */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="text-xl">🤔</div>
            <div className="bg-white rounded-full px-3 py-1 border border-pink-100 flex gap-1">
              <span className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
              <span className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments */}
      {(attachedFile || audioBlob) && (
        <div className="px-3 py-1 bg-pink-50 flex gap-2">
          {attachedFile && (
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-pink-200 text-xs">
              <span>📁</span>
              <span className="truncate max-w-[80px]">{attachedFile.name}</span>
              <button onClick={() => setAttachedFile(null)} className="text-pink-500">✕</button>
            </div>
          )}
          {audioBlob && (
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-pink-200 text-xs">
              <span>🎙️</span>
              <span>{formatTime(recordingTime)}</span>
              <button onClick={() => setAudioBlob(null)} className="text-pink-500">✕</button>
            </div>
          )}
        </div>
      )}

      {/* Recording */}
      {isRecording && (
        <div className="px-3 py-1 bg-red-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-600">Grabando... {formatTime(recordingTime)}</span>
          </div>
          <button onClick={cancelRecording} className="text-red-600">Cancelar</button>
        </div>
      )}

      {/* Input */}
      <div className="p-2 border-t border-pink-100 bg-white">
        <div className="flex gap-1 flex-wrap items-center">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 rounded-lg ${showEmojiPicker ? 'bg-yellow-200' : 'bg-yellow-100'}`}>😊</button>

          <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-pink-100 rounded-lg hover:bg-pink-200">📁</button>

          <button onClick={startListening} disabled={isListening} className={`p-2 rounded-lg ${isListening ? 'bg-red-100 animate-pulse' : 'bg-pink-100'}`}>🎤</button>

          {isRecording ? (
            <button onClick={stopRecording} className="p-2 bg-red-500 text-white rounded-lg animate-pulse">⏹️</button>
          ) : (
            <button onClick={startRecording} className="p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200">🎙️</button>
          )}

          <button onClick={() => setShowImageGenerator(!showImageGenerator)} className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200">🎨</button>

          <input
            id="userInput"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={!usuario.nombre ? "Tu nombre..." : "¿Qué onda? 💛"}
            disabled={isTyping}
            className="flex-1 min-w-[100px] px-3 py-2 bg-pink-50 border border-pink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />

          <button
            id="sendBtn"
            onClick={handleSend}
            disabled={(!input.trim() && !attachedFile && !audioBlob) || isTyping}
            className="px-4 py-2 bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-semibold rounded-lg hover:from-pink-500 hover:to-yellow-400 disabled:opacity-50"
          >
            {audioBlob ? '📤' : 'Enviar'}
          </button>

          <button
            id="imageBtn"
            onClick={() => setShowImageGenerator(!showImageGenerator)}
            className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 ml-1"
          >
            🎨 Imagen
          </button>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}
