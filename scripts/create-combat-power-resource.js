const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createCombatPowerResource() {
  try {
    console.log('🔧 Tạo resource sức mạnh chiến đấu...')

    // Tạo resource sức mạnh chiến đấu
    const combatPowerResource = await prisma.resource.upsert({
      where: { name: 'suc_manh_chien_dau' },
      update: {
        displayName: 'Sức Mạnh Chiến Đấu',
        description: 'Tổng sức mạnh chiến đấu của người chơi',
        icon: '⚔️',
        color: '#ef4444'
      },
      create: {
        name: 'suc_manh_chien_dau',
        displayName: 'Sức Mạnh Chiến Đấu',
        description: 'Tổng sức mạnh chiến đấu của người chơi',
        icon: '⚔️',
        color: '#ef4444'
      }
    })

    console.log('✅ Đã tạo resource sức mạnh chiến đấu:', combatPowerResource)

    // Lấy tất cả người chơi có stats
    const players = await prisma.player.findMany({
      where: {
        stats: {
          isNot: null
        }
      },
      include: {
        stats: true
      }
    })

    console.log(`📊 Tìm thấy ${players.length} người chơi có stats`)

    // Tạo playerResource cho mỗi người chơi
    for (const player of players) {
      if (!player.stats) continue

      // Tính sức mạnh chiến đấu
      const stats = player.stats
      const basePower = (stats.hp || 0) + (stats.mp || 0) + (stats.attack || 0) + (stats.defense || 0) + 
                       (stats.speed || 0) + (stats.luck || 0) + (stats.wisdom || 0) + 
                       (stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)
      
      const mainStatsBonus = ((stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)) * 2
      const combatPower = Math.floor(basePower * 10 + mainStatsBonus)

      // Tạo hoặc cập nhật playerResource
      await prisma.playerResource.upsert({
        where: {
          playerId_resourceId: {
            playerId: player.id,
            resourceId: combatPowerResource.id
          }
        },
        update: {
          amount: combatPower
        },
        create: {
          playerId: player.id,
          resourceId: combatPowerResource.id,
          amount: combatPower
        }
      })

      console.log(`✅ Cập nhật sức mạnh chiến đấu cho ${player.name}: ${combatPower}`)
    }

    console.log('🎉 Hoàn tất tạo resource sức mạnh chiến đấu!')
  } catch (error) {
    console.error('❌ Lỗi tạo resource sức mạnh chiến đấu:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createCombatPowerResource()