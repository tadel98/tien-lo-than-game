import { PrismaClient } from '@prisma/client'
import { getQuery, eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = parseInt(query.limit as string) || 20
    const type = query.type as string || 'level' // level, combat_power, experience

    // Lấy top 20 người chơi theo tiêu chí
    let players
    let orderBy

    switch (type) {
      case 'combat_power':
        orderBy = { level: 'desc' }
        break
      case 'experience':
        orderBy = { experience: 'desc' }
        break
      case 'level':
      default:
        orderBy = { level: 'desc' }
        break
    }

    players = await (prisma as any).player.findMany({
      take: limit,
      orderBy,
      include: {
        stats: true,
        equipments: {
          where: { isEquipped: true },
          include: {
            equipment: {
              include: {
                type: true
              }
            }
          }
        },
        resources: {
          include: {
            resource: true
          }
        }
      }
    })

    // Tính toán sức mạnh chiến đấu cho mỗi người chơi
    const rankedPlayers = players.map((player: any, index: number) => {
      // Lấy sức mạnh chiến đấu từ database
      let combatPower = 0
      const combatPowerResource = player.resources?.find((r: any) => r.resource.name === 'suc_manh_chien_dau')
      
      if (combatPowerResource) {
        combatPower = Number(combatPowerResource.amount) || 0
      } else if (player.stats) {
        // Fallback: tính toán nếu chưa có trong database
        const baseStats = player.stats
        const totalStats = {
          strength: baseStats.strength + (baseStats.strength * 0.1 * player.level),
          agility: baseStats.agility + (baseStats.agility * 0.1 * player.level),
          intelligence: baseStats.intelligence + (baseStats.intelligence * 0.1 * player.level),
          vitality: baseStats.vitality + (baseStats.vitality * 0.1 * player.level)
        }
        
        // Thêm bonus từ equipment
        let equipmentBonus = 0
        if (player.equipments) {
          player.equipments.forEach((equipment: any) => {
            if (equipment.equipment) {
              equipmentBonus += equipment.equipment.stats?.strength || 0
              equipmentBonus += equipment.equipment.stats?.agility || 0
              equipmentBonus += equipment.equipment.stats?.intelligence || 0
              equipmentBonus += equipment.equipment.stats?.vitality || 0
            }
          })
        }
        
        combatPower = Math.floor(
          (totalStats.strength + totalStats.agility + totalStats.intelligence + totalStats.vitality) * 10 + 
          equipmentBonus * 5 + 
          player.level * 100
        )
      }

      // Lấy tài nguyên chính
      const linhThachResource = player.resources?.find((r: any) => r.resource.name === 'linh_thach')
      const tienNgocResource = player.resources?.find((r: any) => r.resource.name === 'tien_ngoc')
      
      return {
        rank: index + 1,
        id: player.id,
        name: player.name,
        level: player.level,
        realm: player.realm,
        experience: Number(player.experience),
        combatPower,
        resources: {
          tienNgoc: tienNgocResource ? Number(tienNgocResource.amount) : 0,
          linhThach: linhThachResource ? Number(linhThachResource.amount) : 0
        },
        stats: player.stats ? {
          strength: player.stats.strength,
          agility: player.stats.agility,
          intelligence: player.stats.intelligence,
          vitality: player.stats.vitality
        } : null,
        equipmentCount: player.equipments?.length || 0,
        lastActive: player.updatedAt
      }
    })

    // Sắp xếp lại theo sức mạnh chiến đấu nếu cần
    if (type === 'combat_power') {
      rankedPlayers.sort((a: any, b: any) => b.combatPower - a.combatPower)
      rankedPlayers.forEach((player: any, index: number) => {
        player.rank = index + 1
      })
    }

    return {
      success: true,
      data: {
        ranking: rankedPlayers,
        type,
        total: rankedPlayers.length,
        lastUpdated: new Date().toISOString()
      }
    }
  } catch (error: any) {
    console.error('Ranking error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi lấy bảng xếp hạng'
    })
  }
})
