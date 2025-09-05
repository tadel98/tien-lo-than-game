import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  try {
    console.log('🧪 Testing Prisma connection...')
    
    // Dynamic import to avoid build issues
    const { PrismaClient } = await import('@prisma/client')
    console.log('✅ Prisma imported successfully')
    
    const prisma = new PrismaClient()
    console.log('✅ Prisma client created')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Test simple query
    const userCount = await prisma.user.count()
    console.log(`✅ User count: ${userCount}`)
    
    await prisma.$disconnect()
    console.log('✅ Database disconnected')
    
    return {
      success: true,
      message: 'Prisma connection test successful',
      userCount,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('❌ Prisma test failed:', error)
    
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }
  }
})
