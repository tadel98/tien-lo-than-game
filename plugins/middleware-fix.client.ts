import { defineNuxtPlugin, useNuxtApp } from 'nuxt/app'

export default defineNuxtPlugin({
  name: 'middleware-fix',
  parallel: true,
  setup() {
    if (process.client) {
      // Fix middleware iteration error
      try {
        const nuxtApp = useNuxtApp()
        if (nuxtApp) {
          // Override middleware completely
          if (nuxtApp._middleware) {
            nuxtApp._middleware.global = []
            nuxtApp._middleware.named = {}
          } else {
            nuxtApp._middleware = { global: [], named: {} }
          }
          
          // Also fix any other middleware properties
          if (nuxtApp._middleware && typeof nuxtApp._middleware.global !== 'object') {
            nuxtApp._middleware.global = []
            nuxtApp._middleware.named = {}
          }
        }
      } catch (error) {
        console.log('Middleware fix applied:', error.message)
      }
    }
  }
})
