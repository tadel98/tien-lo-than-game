// Prisma client for Vercel serverless
const { PrismaClient } = require('@prisma/client')

// Global variable to store the Prisma client instance
let prisma

// Function to get or create Prisma client
function getPrismaClient() {
  if (!prisma) {
    try {
      console.log('Creating new Prisma client...')
      prisma = new PrismaClient({
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
  return prisma
}

// Export the function to get the client
module.exports = { getPrismaClient }
