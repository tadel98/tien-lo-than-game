const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedProduction() {
  console.log('🌱 Bắt đầu seed dữ liệu production...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL production thành công!')
    
    // Chạy script seed đầy đủ
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execAsync = promisify(exec)
    
    // Chạy script seed
    const { stdout, stderr } = await execAsync('node scripts/seed-all-game-data.js')
    
    if (stderr) {
      console.error('⚠️  Warnings:', stderr)
    }
    
    console.log('📋 Seed output:', stdout)
    
    console.log('🎉 Hoàn thành seed dữ liệu production!')
    
  } catch (error) {
    console.error('❌ Lỗi seed production:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedProduction()
