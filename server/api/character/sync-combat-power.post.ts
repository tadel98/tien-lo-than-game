
import { eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = getPrismaClient()
// Lấy tất cả người chơi có stats
    const players = await prisma.player.findMany({
      where: {
        stats: {
          isNot: null
        }
      },
      include: {
        stats: true,
        resources: {
          include: {
            resource: true
          }
        }
      }
    })

    // Lấy resource sức mạnh chiến đấu
    const combatPowerResource = await prisma.resource.findFirst({
      where: { name: 'suc_manh_chien_dau' }
    })

    if (!combatPowerResource) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy resource sức mạnh chiến đấu'
      })
    }

    let updatedCount = 0
    const results: any[] = []

    for (const player of players) {
      if (!player.stats) continue

      // Tính sức mạnh chiến đấu mới
      const stats = player.stats
      const basePower = (stats.hp || 0) + (stats.mp || 0) + (stats.attack || 0) + (stats.defense || 0) + 
                       (stats.speed || 0) + (stats.luck || 0) + (stats.wisdom || 0) + 
                       (stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)
      
      const mainStatsBonus = ((stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)) * 2
      const newCombatPower = Math.floor(basePower * 10 + mainStatsBonus)

      // Lấy sức mạnh chiến đấu cũ
      const oldCombatPower = player.resources.find(r => r.resource.name === 'suc_manh_chien_dau')?.amount || 0

      // Cập nhật sức mạnh chiến đấu
      await prisma.playerResource.upsert({
        where: {
          playerId_resourceId: {
            playerId: player.id,
            resourceId: combatPowerResource.id
          }
        },
        update: {
          amount: newCombatPower
        },
        create: {
          playerId: player.id,
          resourceId: combatPowerResource.id,
          amount: newCombatPower
        }
      })

      updatedCount++
      results.push({
        playerId: player.id,
        playerName: player.name,
        oldCombatPower: Number(oldCombatPower),
        newCombatPower,
        difference: newCombatPower - Number(oldCombatPower)
      })
    }

    return {
      success: true,
      data: {
        updatedCount,
        totalPlayers: players.length,
        results: results.slice(0, 10), // Chỉ trả về 10 kết quả đầu tiên
        message: `Đã cập nhật sức mạnh chiến đấu cho ${updatedCount} người chơi`
      }
    }
  } catch (error: any) {
    console.error('Sync combat power error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi đồng bộ sức mạnh chiến đấu'
    })
  }
})

