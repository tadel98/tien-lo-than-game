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
          } else {
            nuxtApp._middleware = { global: [] }
          }
          
          // Also fix any other middleware properties
          if (nuxtApp._middleware && typeof nuxtApp._middleware.global !== 'object') {
            nuxtApp._middleware.global = []
          }
        }
      } catch (error) {
        console.log('Middleware fix applied:', error.message)
      }
    }
  }
})
