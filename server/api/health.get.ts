import { PrismaClient } from '@prisma/client'
import { eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Check if tables exist
    const userCount = await prisma.user.count()
    const resourceCount = await prisma.resource.count()
    
    return {
      success: true,
      status: 'healthy',
      database: {
        connected: true,
        users: userCount,
        resources: resourceCount
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      success: false,
      status: 'unhealthy',
      error: error.message,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      timestamp: new Date().toISOString()
    }
  } finally {
    await prisma.$disconnect()
  }
})
