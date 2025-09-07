// Prisma client for Vercel serverless
let prisma = null

// Function to get or create Prisma client
function getPrismaClient() {
  if (!prisma) {
    try {
      console.log('Creating new Prisma client...')
      console.log('DATABASE_URL available:', !!process.env.DATABASE_URL)
      console.log('NODE_ENV:', process.env.NODE_ENV)
      
      // Import PrismaClient dynamically to avoid issues
      const { PrismaClient } = require('@prisma/client')
      
      prisma = new PrismaClient({
        log: ['error', 'warn'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_u5SXZm3yzvOl@ep-long-dust-a1cl7wyx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
          }
        }
      })
      console.log('Prisma client created successfully')
    } catch (error) {
      console.error('Failed to create Prisma client:', error)
      // Create a mock prisma for fallback
      prisma = {
        user: { 
          findFirst: () => Promise.reject(new Error('Database not available')), 
          create: () => Promise.reject(new Error('Database not available')),
          count: () => Promise.reject(new Error('Database not available'))
        },
        session: { 
          create: () => Promise.reject(new Error('Database not available')) 
        },
        resource: {
          findMany: () => Promise.reject(new Error('Database not available')),
          count: () => Promise.reject(new Error('Database not available'))
        },
        playerResource: {
          createMany: () => Promise.reject(new Error('Database not available'))
        }
      }
    }
  }
  return prisma
}

// Export the function to get the client
module.exports = { getPrismaClient }
