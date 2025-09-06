import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError } from 'h3'
import { $fetch } from 'ofetch'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { playerId, expGain = 1000 } = body

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu playerId'
      })
    }

    // Lấy thông tin người chơi
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
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

    // Tính toán kinh nghiệm mới
    const newExp = Number(player.experience) + Number(expGain)
    
    // Kiểm tra level up với công thức mới
    const currentLevel = player.level
    let newLevel = currentLevel
    let levelUp = false
    let levelGain = 0
    
    // Tính level mới dựa trên công thức: level^2 * 1440
    for (let level = currentLevel + 1; level <= 1000; level++) {
      const requiredExp = Math.pow(level, 2) * 1440
      if (newExp >= requiredExp) {
        newLevel = level
        levelUp = true
        levelGain = level - currentLevel
      } else {
        break
      }
    }

    // Cập nhật thông tin người chơi
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        experience: BigInt(newExp),
        level: newLevel,
        updatedAt: new Date()
      }
    })

    // Nếu có level up, cập nhật sức mạnh chiến đấu
    if (levelUp) {
      try {
        // Tính toán điểm cộng cho mỗi level
        const pointsPerLevel = 5 + Math.floor(updatedPlayer.level / 10)
        const totalPoints = pointsPerLevel * levelGain

        // Lấy stats hiện tại
        let playerStats = await prisma.playerStats.findUnique({
          where: { playerId }
        })

        if (!playerStats) {
          // Tạo stats mới nếu chưa có
          playerStats = await prisma.playerStats.create({
            data: {
              playerId,
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
          })
        }

        // Phân bổ điểm ngẫu nhiên
        const stats = { ...playerStats }
        const statKeys = ['hp', 'mp', 'attack', 'defense', 'speed', 'luck', 'wisdom', 'strength', 'agility', 'vitality', 'spirit']
        
        for (let i = 0; i < totalPoints; i++) {
          const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)]
          stats[randomStat] = (stats[randomStat] || 0) + 1
        }

        // Cập nhật stats
        await prisma.playerStats.update({
          where: { playerId },
          data: stats
        })

        // Tính toán sức mạnh chiến đấu mới
        const basePower = (stats.hp || 0) + (stats.mp || 0) + (stats.attack || 0) + (stats.defense || 0) + 
                         (stats.speed || 0) + (stats.luck || 0) + (stats.wisdom || 0) + 
                         (stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)
        
        const mainStatsBonus = ((stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)) * 2
        const newCombatPower = Math.floor(basePower * 10 + mainStatsBonus)

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

        console.log('Combat power updated:', newCombatPower)
      } catch (err) {
        console.error('Error updating combat power:', err)
      }
    }

    // Tạo log tu luyện
    await prisma.cultivationLog.create({
      data: {
        playerId,
        type: 'auto_cultivation',
        description: `Tu luyện tự động +${expGain} EXP`,
        expGained: Number(expGain),
        levelGained: levelGain,
        timestamp: new Date()
      }
    })

    return {
      success: true,
      data: {
        player: {
          id: updatedPlayer.id,
          name: updatedPlayer.name,
          level: updatedPlayer.level,
          experience: Number(updatedPlayer.experience),
          realm: updatedPlayer.realm
        },
        cultivation: {
          expGained: Number(expGain),
          levelUp,
          levelGain,
          newLevel: updatedPlayer.level,
          newExp: Number(updatedPlayer.experience)
        }
      }
    }
  } catch (error: any) {
    console.error('Auto cultivation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi tu luyện tự động'
    })
  }
})
