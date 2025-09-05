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
  ssr: true,
  runtimeConfig: {
    // Private keys (only available on server-side)
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    databaseUrl: process.env.DATABASE_URL,
    
    // Public keys (exposed to client-side)
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
    }
  }
})
