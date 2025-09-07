import { getPrismaClient } from '../../../lib/prisma.js'
import { getQuery, eventHandler, createError } from 'h3'

export default eventHandler(async (event) => {
  try {
    const prisma = await getPrismaClient()
    const query = getQuery(event)
    const playerId = query.playerId as string

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    // Lấy thông tin nhân vật với stats để tính Sức Mạnh Chiến Đấu
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        stats: true,
        equipments: {
          include: {
            equipment: {
              include: {
                type: true
              }
            }
          },
          where: {
            isEquipped: true
          }
        },
        skills: {
          include: {
            skill: true
          },
          where: {
            isLearned: true
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

    // Tính toán stats tổng hợp (base + equipment) để tính Sức Mạnh Chiến Đấu
    const baseStats = player.stats || {
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

    // Cộng stats từ trang bị để tính Sức Mạnh Chiến Đấu
    let totalStats = { ...baseStats }
    for (const playerEquipment of player.equipments) {
      if (playerEquipment.equipment.stats) {
        try {
          const equipmentStats = JSON.parse(playerEquipment.equipment.stats)
          for (const [stat, value] of Object.entries(equipmentStats)) {
            if (totalStats[stat] !== undefined) {
              totalStats[stat] += Number(value) * (1 + playerEquipment.enhancement * 0.1)
            }
          }
        } catch (e) {
          console.error('Error parsing equipment stats:', e)
        }
      }
    }

    // Tính toán Sức Mạnh Chiến Đấu (Combat Power)
    const basePower = (totalStats.hp || 0) + (totalStats.mp || 0) + (totalStats.attack || 0) + (totalStats.defense || 0) + 
                     (totalStats.speed || 0) + (totalStats.luck || 0) + (totalStats.wisdom || 0) + 
                     (totalStats.strength || 0) + (totalStats.agility || 0) + (totalStats.vitality || 0) + (totalStats.spirit || 0)
    
    const mainStatsBonus = ((totalStats.strength || 0) + (totalStats.agility || 0) + (totalStats.vitality || 0) + (totalStats.spirit || 0)) * 2
    const combatPower = Math.floor(basePower * 10 + mainStatsBonus)

    return {
      success: true,
      data: {
        player: {
          ...player,
          experience: player.experience.toString()
        },
        stats: {
          base: baseStats,
          total: totalStats,
          combatPower // Sức Mạnh Chiến Đấu
        },
        equipment: player.equipments.map(pe => ({
          ...pe,
          equipment: {
            ...pe.equipment,
            stats: pe.equipment.stats ? JSON.parse(pe.equipment.stats) : {}
          }
        })),
        skills: player.skills.map(ps => ({
          ...ps,
          skill: {
            ...ps.skill,
            effects: ps.skill.effects ? JSON.parse(ps.skill.effects) : {},
            requirements: ps.skill.requirements ? JSON.parse(ps.skill.requirements) : {}
          }
        }))
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})


