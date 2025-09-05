import { execSync } from 'child_process'
import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  try {
    console.log('🔄 Regenerating Prisma client...')
    
    // Force regenerate Prisma client
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    console.log('✅ Prisma client regenerated successfully!')
    
    return {
      success: true,
      message: 'Prisma client regenerated successfully',
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('❌ Prisma regeneration failed:', error.message)
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
})
