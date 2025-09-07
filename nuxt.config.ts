// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

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
  nitro: {
    preset: 'vercel',
    compatibilityDate: '2024-04-03',
    experimental: {
      wasm: true
    },
    esbuild: {
      options: {
        target: 'es2020'
      }
    },
    rollupConfig: {
      external: ['@prisma/client', '.prisma']
    },
    alias: {
      '.prisma': '@prisma/client'
    }
  },
  vite: {
    optimizeDeps: {
      include: ['@prisma/client']
    },
    define: {
      global: 'globalThis'
    }
  },
  experimental: {
    payloadExtraction: false
  },
  typescript: {
    typeCheck: false
  },
  build: {
    transpile: ['@prisma/client']
  },
  ssr: true,
  runtimeConfig: {
    // Private keys (only available on server-side)
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    databaseUrl: process.env.DATABASE_URL || '',
    
    // Public keys (exposed to client-side)
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
    }
  },
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  },
  devServer: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  }
})
