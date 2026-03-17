// src/lib/storage/userStorage.ts - Sistema de almacenamiento de usuario

export interface Conversacion {
  fecha: Date
  input: string
  respuesta: string
}

export interface Proyecto {
  id: string
  titulo: string
  descripcion?: string
  fechaCreacion: Date
  fechaActualizacion: Date
  completado: boolean
  etiquetas?: string[]
}

export interface UsuarioData {
  nombre: string
  registrado: boolean
  password: string
  genero: 'mujer' | 'hombre' | 'otro'
  nombreHada: string
  memoria: Conversacion[]
  proyectos: Proyecto[]
  fechaRegistro?: Date
}

const STORAGE_KEY = 'chipurmogin_usuario'

export const userStorage = {
  // Obtener usuario del localStorage
  getUsuario(): UsuarioData | null {
    if (typeof window === 'undefined') return null

    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return null

      const parsed = JSON.parse(data)

      // Convertir fechas de string a Date
      parsed.memoria = parsed.memoria?.map((m: any) => ({
        ...m,
        fecha: new Date(m.fecha)
      })) || []

      parsed.proyectos = parsed.proyectos?.map((p: any) => ({
        ...p,
        fechaCreacion: new Date(p.fechaCreacion),
        fechaActualizacion: new Date(p.fechaActualizacion)
      })) || []

      if (parsed.fechaRegistro) {
        parsed.fechaRegistro = new Date(parsed.fechaRegistro)
      }

      return parsed
    } catch (error) {
      console.error('Error al leer usuario:', error)
      return null
    }
  },

  // Guardar usuario en localStorage
  setUsuario(usuario: UsuarioData): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario))
    } catch (error) {
      console.error('Error al guardar usuario:', error)
    }
  },

  // Limpiar memoria antigua (más de 90 días)
  limpiarMemoriaAntigua(usuario: UsuarioData): UsuarioData {
    const noventaDias = 90 * 24 * 60 * 60 * 1000
    const ahora = Date.now()

    usuario.memoria = usuario.memoria.filter(msg => {
      const fechaMsg = new Date(msg.fecha).getTime()
      return ahora - fechaMsg < noventaDias
    })

    return usuario
  },

  // Limpiar proyectos antiguos (más de 180 días)
  limpiarProyectosAntiguos(usuario: UsuarioData): UsuarioData {
    const cientoOchentaDias = 180 * 24 * 60 * 60 * 1000
    const ahora = Date.now()

    usuario.proyectos = usuario.proyectos.filter(proyecto => {
      const fechaProy = new Date(proyecto.fechaActualizacion).getTime()
      return ahora - fechaProy < cientoOchentaDias
    })

    return usuario
  },

  // Agregar conversación a memoria
  agregarConversacion(usuario: UsuarioData, input: string, respuesta: string): UsuarioData {
    usuario.memoria.push({
      fecha: new Date(),
      input,
      respuesta
    })

    // Limpiar memoria antigua
    usuario = this.limpiarMemoriaAntigua(usuario)

    return usuario
  },

  // Crear proyecto
  crearProyecto(usuario: UsuarioData, titulo: string, descripcion?: string): UsuarioData {
    const nuevoProyecto: Proyecto = {
      id: Date.now().toString(),
      titulo,
      descripcion,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      completado: false
    }

    usuario.proyectos.unshift(nuevoProyecto)

    // Limpiar proyectos antiguos
    usuario = this.limpiarProyectosAntiguos(usuario)

    return usuario
  },

  // Actualizar proyecto
  actualizarProyecto(usuario: UsuarioData, id: string, cambios: Partial<Proyecto>): UsuarioData {
    const index = usuario.proyectos.findIndex(p => p.id === id)
    if (index !== -1) {
      usuario.proyectos[index] = {
        ...usuario.proyectos[index],
        ...cambios,
        fechaActualizacion: new Date()
      }
    }

    return usuario
  },

  // Eliminar proyecto
  eliminarProyecto(usuario: UsuarioData, id: string): UsuarioData {
    usuario.proyectos = usuario.proyectos.filter(p => p.id !== id)
    return usuario
  },

}
