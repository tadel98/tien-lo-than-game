import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  try {
    // Test environment variables
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const hasJwtSecret = !!process.env.JWT_SECRET
    const nodeEnv = process.env.NODE_ENV
    
    // Test Prisma client creation
    let prismaError = null
    let prismaSuccess = false
    
    try {
      const { getPrismaClient } = await import('../../lib/prisma.js')
      const prisma = await getPrismaClient()
      prismaSuccess = true
    } catch (error) {
      prismaError = error.message
    }
    
    return {
      success: true,
      environment: {
        hasDatabaseUrl,
        hasJwtSecret,
        nodeEnv,
        databaseUrlLength: process.env.DATABASE_URL?.length || 0
      },
      prisma: {
        success: prismaSuccess,
        error: prismaError
      },
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }
  }
})
