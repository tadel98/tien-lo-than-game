const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixQuestStatus() {
  console.log('🔧 Sửa quest status logic...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')

    // Lấy tất cả players và quests
    const players = await prisma.player.findMany()
    const quests = await prisma.quest.findMany()
    
    console.log(`👥 Found ${players.length} players`)
    console.log(`📋 Found ${quests.length} quests`)

    // Cập nhật quest status cho từng player
    for (const player of players) {
      console.log(`\n🎮 Processing player: ${player.name} (Level ${player.level})`)
      
      for (const quest of quests) {
        // Parse requirements để kiểm tra level
        let requiredLevel = 1
        try {
          const requirements = JSON.parse(quest.requirements || '{}')
          requiredLevel = requirements.level || 1
        } catch (e) {
          console.error(`Error parsing requirements for quest ${quest.name}:`, e)
        }

        // Tìm playerQuest hiện tại
        const existingPlayerQuest = await prisma.playerQuest.findFirst({
          where: {
            playerId: player.id,
            questId: quest.id
          }
        })

        if (!existingPlayerQuest) {
          console.log(`❌ No PlayerQuest found for ${quest.displayName}`)
          continue
        }

        // Xác định status mới dựa trên level và quest type
        let newStatus = existingPlayerQuest.status
        
        if (player.level >= requiredLevel) {
          // Player đủ level
          if (quest.category === 'tutorial') {
            // Tutorial quests luôn available nếu chưa completed
            if (existingPlayerQuest.status !== 'completed') {
              newStatus = 'available'
            }
          } else if (quest.isRepeatable) {
            // Repeatable quests
            if (existingPlayerQuest.status === 'locked') {
              // Kiểm tra cooldown
              if (existingPlayerQuest.cooldownUntil) {
                const now = new Date()
                const cooldownUntil = new Date(existingPlayerQuest.cooldownUntil)
                
                if (now >= cooldownUntil) {
                  newStatus = 'available'
                } else {
                  newStatus = 'cooldown'
                }
              } else {
                newStatus = 'available'
              }
            }
          } else {
            // Non-repeatable quests
            if (existingPlayerQuest.status === 'locked') {
              newStatus = 'available'
            }
          }
        } else {
          // Player chưa đủ level
          newStatus = 'locked'
        }

        // Cập nhật nếu status thay đổi
        if (newStatus !== existingPlayerQuest.status) {
          console.log(`  📝 ${quest.displayName}: ${existingPlayerQuest.status} → ${newStatus}`)
          
          await prisma.playerQuest.update({
            where: { id: existingPlayerQuest.id },
            data: { status: newStatus }
          })
        } else {
          console.log(`  ✅ ${quest.displayName}: ${existingPlayerQuest.status} (no change)`)
        }
      }
    }

    // Báo cáo kết quả
    console.log('\n📊 Quest Status Summary:')
    const playerQuests = await prisma.playerQuest.findMany({
      include: {
        quest: true,
        player: true
      }
    })
    
    const statusCounts = {}
    for (const pq of playerQuests) {
      if (!statusCounts[pq.status]) {
        statusCounts[pq.status] = 0
      }
      statusCounts[pq.status]++
    }
    
    for (const [status, count] of Object.entries(statusCounts)) {
      console.log(`  - ${status}: ${count}`)
    }

    console.log('🎉 Hoàn thành sửa quest status!')
    
  } catch (error) {
    console.error('❌ Lỗi sửa quest status:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixQuestStatus()
