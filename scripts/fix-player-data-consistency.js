const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixPlayerDataConsistency() {
  console.log('🔧 Bắt đầu sửa tính nhất quán dữ liệu player...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')
    
    // 1. Kiểm tra và tạo player resources cho tất cả players
    await ensurePlayerResources()
    
    // 2. Kiểm tra và tạo player stats cho tất cả players
    await ensurePlayerStats()
    
    // 3. Kiểm tra và tạo player quests cho tutorial quests
    await ensureTutorialQuests()
    
    // 4. Kiểm tra và tạo combat power resource
    await ensureCombatPowerResource()
    
    console.log('🎉 Hoàn thành sửa tính nhất quán dữ liệu!')
    
  } catch (error) {
    console.error('❌ Lỗi sửa dữ liệu:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function ensurePlayerResources() {
  console.log('📦 Đảm bảo player resources...')
  
  const players = await prisma.player.findMany()
  const resources = await prisma.resource.findMany()
  
  for (const player of players) {
    for (const resource of resources) {
      const existingResource = await prisma.playerResource.findFirst({
        where: {
          playerId: player.id,
          resourceId: resource.id
        }
      })
      
      if (!existingResource) {
        // Tạo resource với giá trị mặc định
        let defaultAmount = 0
        
        // Set giá trị mặc định cho một số resources
        if (resource.name === 'linh_thach') {
          defaultAmount = 1000
        } else if (resource.name === 'huyen_luc') {
          defaultAmount = 100
        } else if (resource.name === 'tien_ngoc') {
          defaultAmount = 100
        }
        
        await prisma.playerResource.create({
          data: {
            playerId: player.id,
            resourceId: resource.id,
            amount: defaultAmount,
            locked: 0
          }
        })
        
        console.log(`✅ Tạo ${resource.displayName} cho ${player.name}: ${defaultAmount}`)
      }
    }
  }
  
  console.log('✅ Đã đảm bảo player resources')
}

async function ensurePlayerStats() {
  console.log('📦 Đảm bảo player stats...')
  
  const players = await prisma.player.findMany()
  
  for (const player of players) {
    const existingStats = await prisma.playerStats.findUnique({
      where: { playerId: player.id }
    })
    
    if (!existingStats) {
      // Tính stats dựa trên level
      const baseStats = {
        hp: 100 + (player.level * 10),
        mp: 50 + (player.level * 5),
        attack: 10 + (player.level * 2),
        defense: 5 + (player.level * 1),
        speed: 8 + (player.level * 1),
        luck: 5,
        wisdom: 5,
        strength: 5 + Math.floor(player.level / 5),
        agility: 5 + Math.floor(player.level / 5),
        vitality: 5 + Math.floor(player.level / 5),
        spirit: 5 + Math.floor(player.level / 5)
      }
      
      await prisma.playerStats.create({
        data: {
          playerId: player.id,
          ...baseStats
        }
      })
      
      console.log(`✅ Tạo stats cho ${player.name} (Level ${player.level})`)
    }
  }
  
  console.log('✅ Đã đảm bảo player stats')
}

async function ensureTutorialQuests() {
  console.log('📦 Đảm bảo tutorial quests...')
  
  const players = await prisma.player.findMany()
  const tutorialQuests = await prisma.quest.findMany({
    where: {
      category: 'tutorial'
    }
  })
  
  for (const player of players) {
    for (const quest of tutorialQuests) {
      const existingQuest = await prisma.playerQuest.findFirst({
        where: {
          playerId: player.id,
          questId: quest.id
        }
      })
      
      if (!existingQuest) {
        await prisma.playerQuest.create({
          data: {
            playerId: player.id,
            questId: quest.id,
            status: 'available',
            progress: JSON.stringify({})
          }
        })
        
        console.log(`✅ Tạo tutorial quest "${quest.displayName}" cho ${player.name}`)
      }
    }
  }
  
  console.log('✅ Đã đảm bảo tutorial quests')
}

async function ensureCombatPowerResource() {
  console.log('📦 Đảm bảo combat power resource...')
  
  const combatPowerResource = await prisma.resource.findFirst({
    where: { name: 'suc_manh_chien_dau' }
  })
  
  if (!combatPowerResource) {
    console.log('⚠️  Không tìm thấy combat power resource, tạo mới...')
    
    await prisma.resource.create({
      data: {
        name: 'suc_manh_chien_dau',
        displayName: 'Sức Mạnh Chiến Đấu',
        description: 'Tổng sức mạnh chiến đấu của người chơi',
        icon: '⚔️',
        color: '#ef4444'
      }
    })
    
    console.log('✅ Đã tạo combat power resource')
  }
  
  // Cập nhật combat power cho tất cả players
  const players = await prisma.player.findMany({
    include: {
      stats: true
    }
  })
  
  for (const player of players) {
    if (player.stats) {
      const combatPower = calculateCombatPower(player.stats, player.level)
      
      const resource = await prisma.resource.findFirst({
        where: { name: 'suc_manh_chien_dau' }
      })
      
      if (resource) {
        await prisma.playerResource.upsert({
          where: {
            playerId_resourceId: {
              playerId: player.id,
              resourceId: resource.id
            }
          },
          update: {
            amount: combatPower
          },
          create: {
            playerId: player.id,
            resourceId: resource.id,
            amount: combatPower,
            locked: 0
          }
        })
        
        console.log(`✅ Cập nhật combat power cho ${player.name}: ${combatPower}`)
      }
    }
  }
  
  console.log('✅ Đã đảm bảo combat power resource')
}

function calculateCombatPower(stats, level) {
  if (!stats) return 0
  
  const basePower = (stats.hp || 0) + (stats.mp || 0) + (stats.attack || 0) + (stats.defense || 0) + 
                   (stats.speed || 0) + (stats.luck || 0) + (stats.wisdom || 0) + 
                   (stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)
  
  const mainStatsBonus = ((stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)) * 2
  
  const levelBonus = level * 10
  
  return Math.floor(basePower * 10 + mainStatsBonus + levelBonus)
}

// Chạy script
fixPlayerDataConsistency()
