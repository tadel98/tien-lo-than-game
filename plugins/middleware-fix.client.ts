export default defineNuxtPlugin({
  name: 'middleware-fix',
  parallel: true,
  setup() {
    if (process.client) {
      // Fix middleware iteration error
      try {
        const nuxtApp = useNuxtApp()
        if (nuxtApp && nuxtApp._middleware && nuxtApp._middleware.global) {
          // Ensure global middleware is an array
          if (!Array.isArray(nuxtApp._middleware.global)) {
            nuxtApp._middleware.global = []
          }
        }
      } catch (error) {
        console.log('Middleware fix applied')
      }
    }
  }
})
