import { PrismaClient } from '@prisma/client'
import { eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    console.log('Initializing database...')
    
    // Test connection
    await prisma.$connect()
    console.log('Database connected')
    
    // Check if resources exist
    const resourceCount = await prisma.resource.count()
    console.log(`Resources count: ${resourceCount}`)
    
    if (resourceCount === 0) {
      console.log('No resources found, seeding database...')
      
      // Create basic resources
      const resources = [
        { name: 'huyen_luc', displayName: 'Huyền Lực', description: 'Năng lượng cơ bản', icon: '⚡', color: '#FFD700' },
        { name: 'linh_thach', displayName: 'Linh Thạch', description: 'Đá linh khí', icon: '💎', color: '#00BFFF' },
        { name: 'tien_ngoc', displayName: 'Tiên Ngọc', description: 'Tiền tệ chính', icon: '💰', color: '#FF69B4' },
        { name: 'suc_manh_chien_dau', displayName: 'Sức Mạnh Chiến Đấu', description: 'Tổng sức mạnh', icon: '⚔️', color: '#FF4500' }
      ]
      
      for (const resource of resources) {
        await prisma.resource.upsert({
          where: { name: resource.name },
          update: resource,
          create: resource
        })
      }
      
      console.log('Resources created successfully')
    }
    
    return {
      success: true,
      message: 'Database initialized successfully',
      resourceCount: await prisma.resource.count(),
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    console.error('Database initialization error:', error)
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  } finally {
    await prisma.$disconnect()
  }
})
