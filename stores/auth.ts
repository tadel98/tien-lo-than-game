import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isLoggedIn = computed(() => isAuthenticated.value && !!token.value)

  // Actions
  const login = async (username: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.success) {
        user.value = response.user
        token.value = response.token
        isAuthenticated.value = true

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('user_data', JSON.stringify(response.user))
        }

        // Start auto-save
        const { useAutoSaveStore } = await import('./autoSave')
        const autoSaveStore = useAutoSaveStore()
        if (response.user?.player?.id) {
          autoSaveStore.startAutoSave(response.user.player.id)
          await autoSaveStore.setupAutoSave(response.user.player.id)
        }

        return response
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Login error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (username: string, email: string, password: string, playerName: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
          playerName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.success) {
        user.value = response.user
        token.value = response.token
        isAuthenticated.value = true

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('user_data', JSON.stringify(response.user))
        }

        // Start auto-save
        const { useAutoSaveStore } = await import('./autoSave')
        const autoSaveStore = useAutoSaveStore()
        if (response.user?.player?.id) {
          autoSaveStore.startAutoSave(response.user.player.id)
          await autoSaveStore.setupAutoSave(response.user.player.id)
        }

        return response
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Register error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      // Save data before logout
      const { useAutoSaveStore } = await import('./autoSave')
      const autoSaveStore = useAutoSaveStore()
      if ((user.value as any)?.player?.id) {
        await autoSaveStore.saveBeforeLogout((user.value as any).player.id)
      }

      // Stop auto-save
      autoSaveStore.stopAutoSave()

      // Reset all stores using dynamic import
      const { usePlayerStore } = await import('./player')
      const { useCharacterStore } = await import('./character')
      const { useQuestStore } = await import('./quest')
      const { useSpiritBeastStore } = await import('./spiritBeast')
      const { useTalentStore } = await import('./talent')

      const playerStore = usePlayerStore()
      const characterStore = useCharacterStore()
      const questStore = useQuestStore()
      const spiritBeastStore = useSpiritBeastStore()
      const talentStore = useTalentStore()

      playerStore.reset()
      characterStore.reset()
      questStore.reset()
      spiritBeastStore.reset()
      talentStore.reset()
      autoSaveStore.reset()

      // Clear auth data
      user.value = null
      token.value = null
      isAuthenticated.value = false
      error.value = null

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }

      console.log('Logout completed successfully')
    } catch (err) {
      console.error('Error during logout:', err)
      // Still clear data even if save fails
      user.value = null
      token.value = null
      isAuthenticated.value = false
      error.value = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
  }

  const checkAuth = async () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user_data')

      if (storedToken && storedUser) {
        try {
          token.value = storedToken
          user.value = JSON.parse(storedUser)
          isAuthenticated.value = true

          // Start auto-save if user has player data
          const { useAutoSaveStore } = await import('./autoSave')
          const autoSaveStore = useAutoSaveStore()
          if ((user.value as any)?.player?.id) {
            autoSaveStore.startAutoSave((user.value as any).player.id)
            await autoSaveStore.setupAutoSave((user.value as any).player.id)
          }
        } catch (err) {
          console.error('Error parsing stored user data:', err)
          logout()
        }
      }
    }
  }

  const initializeAuth = () => {
    checkAuth()
  }

  // Reset store
  const reset = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    loading.value = false
    error.value = null
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,

    // Getters
    isLoggedIn,

    // Actions
    login,
    register,
    logout,
    checkAuth,
    initializeAuth,
    reset
  }
})
