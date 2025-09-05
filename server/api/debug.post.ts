import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  try {
    console.log('🔍 Debug API called')
    console.log('Method:', event.method)
    console.log('URL:', event.node.req.url)
    console.log('Headers:', event.node.req.headers)
    
    // Test Prisma import
    let prismaStatus = 'Not tested'
    try {
      const { PrismaClient } = await import('@prisma/client')
      prismaStatus = 'Import successful'
      console.log('✅ Prisma import successful')
    } catch (error: any) {
      prismaStatus = `Import failed: ${error.message}`
      console.error('❌ Prisma import failed:', error.message)
    }
    
    // Test environment variables
    const envStatus = {
      NODE_ENV: process.env.NODE_ENV,
      hasJWT_SECRET: !!process.env.JWT_SECRET,
      hasDATABASE_URL: !!process.env.DATABASE_URL,
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 20) + '...'
    }
    
    return {
      success: true,
      message: 'Debug API working',
      timestamp: new Date().toISOString(),
      prismaStatus,
      environment: envStatus,
      method: event.method,
      url: event.node.req.url
    }
  } catch (error: any) {
    console.error('Debug API error:', error)
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
})
