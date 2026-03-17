// src/features/magorya/hooks/useMagoryaAuth.ts
// Hook para manejar autenticación en Magorya

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { userStorage, type UsuarioData } from '@/lib/storage/userStorage'
import { migrateToSupabase, isMigrated } from '../services/migrationService'

export function useMagoryaAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Verificar sesión inicial
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user)
      setUserId(user?.id || null)
      setIsLoading(false)

      // Si está autenticado, migrar datos si no se han migrado
      if (user) {
        isMigrated().then(migrated => {
          if (!migrated) {
            const usuario = userStorage.getUsuario()
            if (usuario) {
              migrateToSupabase(usuario)
            }
          }
        })
      }
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null
        setIsAuthenticated(!!user)
        setUserId(user?.id || null)
        setIsLoading(false)

        // Migrar datos cuando el usuario se registre o inicie sesión
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          const usuario = userStorage.getUsuario()
          if (usuario && user) {
            await migrateToSupabase(usuario)
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    isAuthenticated,
    isLoading,
    userId
  }
}
