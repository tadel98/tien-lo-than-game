// Prisma client for Vercel serverless
const { PrismaClient } = require('@prisma/client')

// Use globalThis for better serverless compatibility
const globalForPrisma = globalThis || global || {}

// Function to get or create Prisma client
function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    try {
      console.log('Creating new Prisma client...')
      globalForPrisma.prisma = new PrismaClient({
        log: ['error', 'warn'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      })
      console.log('Prisma client created successfully')
    } catch (error) {
      console.error('Failed to create Prisma client:', error)
      throw error
    }
  }
  return globalForPrisma.prisma
}

// Export the function to get the client
module.exports = { getPrismaClient }
