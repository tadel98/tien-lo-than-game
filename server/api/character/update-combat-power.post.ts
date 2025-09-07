
import { readBody, eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = getPrismaClient()
const body = await readBody(event)
    const { playerId, levelGain } = body

    if (!playerId || !levelGain) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin người chơi
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        stats: true,
        resources: {
          include: {
            resource: true
          }
        }
      }
    })

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    // Tính toán điểm cộng cho mỗi level
    const pointsPerLevel = calculatePointsPerLevel(player.level)
    const totalPoints = pointsPerLevel * levelGain

    // Cập nhật stats
    const currentStats = player.stats || {
      hp: 100,
      mp: 50,
      attack: 10,
      defense: 5,
      speed: 8,
      luck: 5,
      wisdom: 5,
      strength: 5,
      agility: 5,
      vitality: 5,
      spirit: 5
    }

    // Phân bổ điểm ngẫu nhiên vào các chỉ số
    const updatedStats = distributePoints(currentStats, totalPoints)

    // Cập nhật database
    await prisma.playerStats.upsert({
      where: { playerId },
      update: updatedStats,
      create: {
        playerId,
        ...updatedStats
      }
    })

    // Tính toán sức mạnh chiến đấu mới
    const newCombatPower = calculateCombatPower(updatedStats)

    // Cập nhật sức mạnh chiến đấu vào resource
    const combatPowerResource = await prisma.resource.findFirst({
      where: { name: 'suc_manh_chien_dau' }
    })

    if (combatPowerResource) {
      await prisma.playerResource.upsert({
        where: {
          playerId_resourceId: {
            playerId,
            resourceId: combatPowerResource.id
          }
        },
        update: {
          amount: newCombatPower
        },
        create: {
          playerId,
          resourceId: combatPowerResource.id,
          amount: newCombatPower
        }
      })
    }

    // Tìm sức mạnh chiến đấu cũ
    const oldCombatPower = player.resources.find(r => r.resource.name === 'suc_manh_chien_dau')?.amount || 0

    return {
      success: true,
      data: {
        levelGain,
        pointsGained: totalPoints,
        oldStats: currentStats,
        newStats: updatedStats,
        combatPower: newCombatPower,
        combatPowerIncrease: newCombatPower - Number(oldCombatPower)
      }
    }
  } catch (error: any) {
    console.error('Update combat power error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi cập nhật sức mạnh chiến đấu'
    })
  }
})

// Helper functions
function calculatePointsPerLevel(level) {
  return 5 + Math.floor(level / 10)
}

function distributePoints(currentStats, totalPoints) {
  const stats = { ...currentStats }
  const statKeys = ['hp', 'mp', 'attack', 'defense', 'speed', 'luck', 'wisdom', 'strength', 'agility', 'vitality', 'spirit']
  
  for (let i = 0; i < totalPoints; i++) {
    const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)]
    stats[randomStat] = (stats[randomStat] || 0) + 1
  }
  
  return stats
}

function calculateCombatPower(stats) {
  if (!stats) return 0
  
  const basePower = (stats.hp || 0) + (stats.mp || 0) + (stats.attack || 0) + (stats.defense || 0) + 
                   (stats.speed || 0) + (stats.luck || 0) + (stats.wisdom || 0) + 
                   (stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)
  
  const mainStatsBonus = ((stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)) * 2
  
  return Math.floor(basePower * 10 + mainStatsBonus)
}
