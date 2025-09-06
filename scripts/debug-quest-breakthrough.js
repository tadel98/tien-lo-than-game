const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugQuestBreakthrough() {
  console.log('🔍 Debug quest và breakthrough issues...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')

    // 1. Kiểm tra players
    console.log('\n👥 Players:')
    const players = await prisma.player.findMany({
      include: {
        resources: {
          include: {
            resource: true
          }
        },
        stats: true
      }
    })
    
    for (const player of players) {
      console.log(`\n🎮 ${player.name} (Level ${player.level}):`)
      console.log(`  - EXP: ${player.experience}`)
      console.log(`  - Realm: ${player.realm}`)
      
      // Kiểm tra resources
      console.log(`  - Resources:`)
      for (const pr of player.resources) {
        console.log(`    * ${pr.resource.displayName}: ${pr.amount}`)
      }
      
      // Kiểm tra stats
      if (player.stats) {
        console.log(`  - Stats: HP=${player.stats.hp}, Attack=${player.stats.attack}`)
      } else {
        console.log(`  - Stats: Chưa có`)
      }
    }

    // 2. Kiểm tra quests
    console.log('\n📋 Quests:')
    const quests = await prisma.quest.findMany({
      orderBy: { category: 'asc' }
    })
    
    const questByCategory = {}
    for (const quest of quests) {
      if (!questByCategory[quest.category]) {
        questByCategory[quest.category] = []
      }
      questByCategory[quest.category].push(quest)
    }
    
    for (const [category, categoryQuests] of Object.entries(questByCategory)) {
      console.log(`\n📁 ${category.toUpperCase()} (${categoryQuests.length}):`)
      for (const quest of categoryQuests) {
        console.log(`  - ${quest.displayName}`)
        console.log(`    * Level: ${JSON.parse(quest.requirements || '{}').level || 1}`)
        console.log(`    * Cooldown: ${quest.repeatInterval || 'Không'} phút`)
        console.log(`    * Repeatable: ${quest.isRepeatable}`)
      }
    }

    // 3. Kiểm tra player quests
    console.log('\n🎯 Player Quests:')
    const playerQuests = await prisma.playerQuest.findMany({
      include: {
        quest: true,
        player: true
      }
    })
    
    for (const pq of playerQuests) {
      console.log(`\n👤 ${pq.player.name} - ${pq.quest.displayName}:`)
      console.log(`  - Status: ${pq.status}`)
      console.log(`  - Started: ${pq.startedAt}`)
      console.log(`  - Completed: ${pq.completedAt}`)
      console.log(`  - Cooldown: ${pq.cooldownUntil}`)
    }

    // 4. Kiểm tra breakthrough conditions
    console.log('\n⚡ Breakthrough Analysis:')
    for (const player of players) {
      const currentLevel = player.level
      const currentExp = Number(player.experience)
      const nextLevelExp = Math.pow(currentLevel, 2) * 1440
      
      console.log(`\n🎮 ${player.name}:`)
      console.log(`  - Current Level: ${currentLevel}`)
      console.log(`  - Current EXP: ${currentExp}`)
      console.log(`  - Required EXP for Level ${currentLevel + 1}: ${nextLevelExp}`)
      console.log(`  - Can Breakthrough: ${currentExp >= nextLevelExp ? '✅ YES' : '❌ NO'}`)
      
      if (currentExp >= nextLevelExp) {
        const breakthroughCost = {
          tienNgoc: 1000 * (Math.floor(currentLevel / 10) + 1),
          linhThach: 5000 * (Math.floor(currentLevel / 10) + 1)
        }
        
        const tienNgoc = player.resources.find(r => r.resource.name === 'tien_ngoc')
        const linhThach = player.resources.find(r => r.resource.name === 'linh_thach')
        
        console.log(`  - Breakthrough Cost: ${breakthroughCost.tienNgoc} Tiên Ngọc, ${breakthroughCost.linhThach} Linh Thạch`)
        console.log(`  - Has Resources: ${tienNgoc ? tienNgoc.amount : 0} Tiên Ngọc, ${linhThach ? linhThach.amount : 0} Linh Thạch`)
        console.log(`  - Can Afford: ${tienNgoc && Number(tienNgoc.amount) >= breakthroughCost.tienNgoc && linhThach && Number(linhThach.amount) >= breakthroughCost.linhThach ? '✅ YES' : '❌ NO'}`)
      }
    }

    // 5. Kiểm tra quest availability
    console.log('\n🎯 Quest Availability Analysis:')
    for (const player of players) {
      console.log(`\n👤 ${player.name} (Level ${player.level}):`)
      
      const availableQuests = quests.filter(quest => {
        const requirements = JSON.parse(quest.requirements || '{}')
        const requiredLevel = requirements.level || 1
        return player.level >= requiredLevel
      })
      
      console.log(`  - Available Quests: ${availableQuests.length}/${quests.length}`)
      
      const playerQuestsForPlayer = playerQuests.filter(pq => pq.playerId === player.id)
      console.log(`  - Assigned Quests: ${playerQuestsForPlayer.length}`)
      
      const availableStatus = playerQuestsForPlayer.filter(pq => pq.status === 'available').length
      const inProgressStatus = playerQuestsForPlayer.filter(pq => pq.status === 'in_progress').length
      const completedStatus = playerQuestsForPlayer.filter(pq => pq.status === 'completed').length
      const lockedStatus = playerQuestsForPlayer.filter(pq => pq.status === 'locked').length
      
      console.log(`    * Available: ${availableStatus}`)
      console.log(`    * In Progress: ${inProgressStatus}`)
      console.log(`    * Completed: ${completedStatus}`)
      console.log(`    * Locked: ${lockedStatus}`)
    }

  } catch (error) {
    console.error('❌ Lỗi debug:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugQuestBreakthrough()
