import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  preset: 'vercel',
  experimental: {
    wasm: true
  },
  rollupConfig: {
    external: ['@prisma/client']
  },
  esbuild: {
    options: {
      target: 'node18'
    }
  },
  // Prisma configuration
  alias: {
    '@prisma/client': '@prisma/client'
  }
})
