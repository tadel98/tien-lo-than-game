// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Tiên Lộ Thần - Game Tu Luyện',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Game tu luyện với giao diện đẹp mắt' }
      ]
    }
  },
  compatibilityDate: '2025-09-05',
  nitro: {
    preset: 'vercel'
  },
  ssr: false,
  runtimeConfig: {
    // Private keys (only available on server-side)
    jwtSecret: 'default-secret',
    databaseUrl: '',
    
    // Public keys (exposed to client-side)
    public: {
      baseUrl: 'http://localhost:3000',
      apiBaseUrl: 'http://localhost:3000/api'
    }
  }
})
