const fs = require('fs')
const path = require('path')

function cleanupSQLite() {
  console.log('🧹 Bắt đầu cleanup SQLite database cũ...')
  
  const sqliteDbPath = path.join(__dirname, '../prisma/dev.db')
  
  try {
    if (fs.existsSync(sqliteDbPath)) {
      // Backup trước khi xóa
      const backupPath = path.join(__dirname, '../prisma/dev.db.backup')
      fs.copyFileSync(sqliteDbPath, backupPath)
      console.log(`✅ Đã backup SQLite database to: ${backupPath}`)
      
      // Xóa SQLite database cũ
      fs.unlinkSync(sqliteDbPath)
      console.log('✅ Đã xóa SQLite database cũ (dev.db)')
      
      console.log('🎉 Cleanup hoàn tất!')
      console.log('💡 Lưu ý: SQLite database đã được backup thành dev.db.backup')
      console.log('💡 Bạn có thể xóa file backup này nếu chắc chắn không cần nữa')
    } else {
      console.log('ℹ️  Không tìm thấy SQLite database (dev.db)')
    }
  } catch (error) {
    console.error('❌ Lỗi cleanup:', error.message)
  }
}

cleanupSQLite()
