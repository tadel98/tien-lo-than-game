const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function initDatabase() {
  try {
    console.log('🔍 Kiểm tra kết nối database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Kết nối database thành công!')
    
    // Check if tables exist
    console.log('🔍 Kiểm tra tables...')
    const userCount = await prisma.user.count()
    console.log(`✅ Table users tồn tại (${userCount} records)`)
    
    const resourceCount = await prisma.resource.count()
    console.log(`✅ Table resources tồn tại (${resourceCount} records)`)
    
    if (resourceCount === 0) {
      console.log('⚠️  Chưa có resources, cần chạy seed...')
      console.log('Chạy: node scripts/seed.js')
    }
    
    console.log('🎉 Database đã sẵn sàng!')
    
  } catch (error) {
    console.error('❌ Lỗi database:', error.message)
    
    if (error.message.includes('does not exist')) {
      console.log('💡 Cần chạy migration: npx prisma db push')
    }
    
    if (error.message.includes('Connection')) {
      console.log('💡 Kiểm tra DATABASE_URL trong environment variables')
    }
  } finally {
    await prisma.$disconnect()
  }
}

initDatabase()
