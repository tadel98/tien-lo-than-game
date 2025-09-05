import { PrismaClient } from '@prisma/client'
import { eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    console.log('Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Test simple query
    const userCount = await prisma.user.count()
    console.log(`User count: ${userCount}`)
    
    return {
      success: true,
      message: 'Database connection successful',
      userCount,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('Database error:', error)
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  } finally {
    await prisma.$disconnect()
  }
})
