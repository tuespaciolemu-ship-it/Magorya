// src/features/magorya/services/migrationService.ts
// Servicio para migrar datos de localStorage a Supabase

import { createClient } from '@/lib/supabase/client'
import { userStorage, type UsuarioData } from '@/lib/storage/userStorage'
import { conversationService, messageService, projectService } from './magoryaService'

/**
 * Migrar datos de localStorage a Supabase
 * Se llama cuando el usuario se registra o inicia sesión
 */
export async function migrateToSupabase(usuario: UsuarioData): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('Usuario no autenticado')
      return false
    }

    // 1. Actualizar perfil con datos de localStorage
    await supabase
      .from('profiles')
      .update({
        full_name: usuario.nombre,
        genero: usuario.genero,
        nombre_hada: usuario.nombreHada,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    // 2. Crear conversación por defecto si no existe
    const { data: existingConvs } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    let conversationId: string

    if (!existingConvs || existingConvs.length === 0) {
      const newConv = await conversationService.create('Mi conversación con Magorya')
      conversationId = newConv.id
    } else {
      conversationId = existingConvs[0].id
    }

    // 3. Migrar memoria (conversaciones)
    if (usuario.memoria && usuario.memoria.length > 0) {
      for (const msg of usuario.memoria) {
        // Mensaje del usuario
        await messageService.create(conversationId, 'user', msg.input)
        // Respuesta del asistente
        await messageService.create(conversationId, 'assistant', msg.respuesta)
      }
    }

    // 4. Migrar proyectos
    if (usuario.proyectos && usuario.proyectos.length > 0) {
      for (const proj of usuario.proyectos) {
        // Verificar si ya existe (por título)
        const { data: existing } = await supabase
          .from('projects')
          .select('id')
          .eq('user_id', user.id)
          .eq('titulo', proj.titulo)
          .maybeSingle()

        if (!existing) {
          await projectService.create(proj.titulo, proj.descripcion)
          // Actualizar estado de completado si es necesario
          if (proj.completado) {
            const { data: newProj } = await supabase
              .from('projects')
              .select('id')
              .eq('user_id', user.id)
              .eq('titulo', proj.titulo)
              .single()

            if (newProj) {
              await projectService.update(newProj.id, { completado: true })
            }
          }
        }
      }
    }

    console.log('✅ Migración completada')
    return true

  } catch (error) {
    console.error('❌ Error en migración:', error)
    return false
  }
}

/**
 * Verificar si ya se migraron los datos
 */
export async function isMigrated(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    // Verificar si tiene datos en Supabase
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    return !!(conversations && conversations.length > 0)

  } catch {
    return false
  }
}

/**
 * Sincronizar datos de localStorage con Supabase
 * Se llama periódicamente o al hacer logout
 */
export async function syncToSupabase(usuario: UsuarioData): Promise<void> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Solo sincronizar si ya está migrado
    const migrated = await isMigrated()
    if (!migrated) {
      await migrateToSupabase(usuario)
      return
    }

    // Sincronizar proyectos nuevos o modificados
    const { data: remoteProjects } = await supabase
      .from('projects')
      .select('id, titulo, completado')
      .eq('user_id', user.id)

    if (remoteProjects) {
      for (const localProj of usuario.proyectos) {
        const remoteProj = remoteProjects.find(rp => rp.titulo === localProj.titulo)

        if (!remoteProj) {
          // Proyecto nuevo en localStorage, crear en Supabase
          await projectService.create(localProj.titulo, localProj.descripcion)
          if (localProj.completado) {
            const { data: newProj } = await supabase
              .from('projects')
              .select('id')
              .eq('user_id', user.id)
              .eq('titulo', localProj.titulo)
              .single()

            if (newProj) {
              await projectService.update(newProj.id, { completado: true })
            }
          }
        } else if (remoteProj.completado !== localProj.completado) {
          // Estado diferente, actualizar
          await projectService.update(remoteProj.id, { completado: localProj.completado })
        }
      }
    }

  } catch (error) {
    console.error('Error en sincronización:', error)
  }
}
