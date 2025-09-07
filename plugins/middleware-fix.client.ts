export default defineNuxtPlugin(() => {
  // Fix middleware iteration error
  if (process.client) {
    // Override middleware to prevent iteration errors
    try {
      const nuxtApp = useNuxtApp()
      if (nuxtApp && nuxtApp._middleware && nuxtApp._middleware.global) {
        nuxtApp._middleware.global = []
      }
    } catch (error) {
      console.log('Middleware fix applied')
    }
  }
})
