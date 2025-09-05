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
        body: {
          username,
          password
        }
      })

      if (response.success) {
        user.value = response.user
        token.value = response.token
        isAuthenticated.value = true

        // Save to localStorage
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('user_data', JSON.stringify(response.user))
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
        body: {
          username,
          email,
          password,
          playerName
        }
      })

      if (response.success) {
        user.value = response.user
        token.value = response.token
        isAuthenticated.value = true

        // Save to localStorage
        if (process.client) {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('user_data', JSON.stringify(response.user))
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

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    error.value = null

    // Clear localStorage
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  }

  const checkAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user_data')

      if (storedToken && storedUser) {
        try {
          token.value = storedToken
          user.value = JSON.parse(storedUser)
          isAuthenticated.value = true
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
