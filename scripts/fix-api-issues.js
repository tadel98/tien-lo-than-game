const fs = require('fs')
const path = require('path')

// Danh sách các file API cần sửa
const apiFiles = [
  'server/api/character/stats.get.ts',
  'server/api/character/stats/update.post.ts',
  'server/api/character/update-combat-power.post.ts',
  'server/api/cultivation/start.post.ts',
  'server/api/cultivation/breakthrough.post.ts',
  'server/api/character/equipment/equip.post.ts',
  'server/api/character/equipment/unequip.post.ts',
  'server/api/character/skills/learn.post.ts',
  'server/api/quest/start.post.ts',
  'server/api/quest/complete.post.ts',
  'server/api/shop/purchase.post.ts',
  'server/api/furnace/craft.post.ts',
  'server/api/spirit-beast/hunt.post.ts',
  'server/api/spirit-beast/feed.post.ts',
  'server/api/talent/unlock.post.ts',
  'server/api/talent/upgrade.post.ts',
  'server/api/talent/toggle.post.ts'
]

function fixApiFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File không tồn tại: ${filePath}`)
      return
    }

    let content = fs.readFileSync(filePath, 'utf8')
    let hasChanges = false

    // Sửa các lỗi TypeScript casting phổ biến
    const fixes = [
      // Sửa (prisma as any) thành prisma
      { from: /\(prisma as any\)/g, to: 'prisma' },
      
      // Sửa }) as any thành })
      { from: /}\) as any/g, to: '})' },
      
      // Sửa } as any thành }
      { from: /} as any/g, to: '}' },
      
      // Sửa any) thành )
      { from: /any\)/g, to: ')' },
      
      // Sửa BigInt casting
      { from: /BigInt\((\w+)\)/g, to: 'BigInt($1)' },
      
      // Sửa JSON.parse với error handling
      { from: /JSON\.parse\(([^)]+)\)/g, to: 'JSON.parse($1 || "{}")' }
    ]

    for (const fix of fixes) {
      if (fix.from.test(content)) {
        content = content.replace(fix.from, fix.to)
        hasChanges = true
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content)
      console.log(`✅ Đã sửa: ${filePath}`)
    } else {
      console.log(`ℹ️  Không cần sửa: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ Lỗi sửa file ${filePath}:`, error.message)
  }
}

console.log('🔧 Bắt đầu sửa các lỗi API...')

for (const file of apiFiles) {
  fixApiFile(file)
}

console.log('🎉 Hoàn thành sửa các lỗi API!')
