
import { readBody, eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = getPrismaClient()
const body = await readBody(event)
    const { playerId, monsterType = 'basic' } = body

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    // Lấy thông tin người chơi
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    })

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    // Tính toán EXP và tài nguyên từ đánh quái
    const combatResult = calculateCombatResult(player.level, monsterType)
    const newExperience = BigInt(player.experience) + BigInt(combatResult.expGain)
    const newLevel = calculateNewLevel(Number(newExperience))

    // Cập nhật người chơi
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        experience: newExperience,
        level: newLevel
      }
    })

    // Cập nhật tài nguyên nếu có
    if (combatResult.resources) {
      for (const [resourceName, amount] of Object.entries(combatResult.resources)) {
        const resource = await prisma.resource.findFirst({
          where: { name: resourceName }
        })
        
        if (resource) {
          const playerResource = await prisma.playerResource.findFirst({
            where: {
              playerId,
              resourceId: resource.id
            }
          })

          if (playerResource) {
            await prisma.playerResource.update({
              where: { id: playerResource.id },
              data: {
                amount: Number(playerResource.amount) + Number(amount)
              }
            })
          }
        }
      }
    }

    const levelUp = newLevel > player.level

    return {
      success: true,
      message: 'Đánh quái thành công',
      data: {
        player: {
          ...updatedPlayer,
          experience: updatedPlayer.experience.toString()
        },
        combat: {
          expGain: combatResult.expGain,
          resourcesGained: combatResult.resources,
          levelUp,
          oldLevel: player.level,
          newLevel: newLevel,
          monsterType
        }
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})

// Tính toán kết quả đánh quái
function calculateCombatResult(playerLevel: number, monsterType: string) {
  const baseExp = 50
  const levelMultiplier = Math.floor(playerLevel / 10) + 1
  
  let expGain = 0
  let resources = {}

  switch (monsterType) {
    case 'basic':
      expGain = Math.floor(baseExp * levelMultiplier * (0.8 + Math.random() * 0.4)) // 50-150 EXP
      resources = {
        linh_thach: Math.floor(10 + Math.random() * 20) // 10-30 linh thạch
      }
      break
    case 'elite':
      expGain = Math.floor(baseExp * levelMultiplier * (1.2 + Math.random() * 0.6)) // 100-250 EXP
      resources = {
        linh_thach: Math.floor(30 + Math.random() * 40), // 30-70 linh thạch
        tien_ngoc: Math.floor(1 + Math.random() * 3) // 1-3 tiên ngọc
      }
      break
    case 'boss':
      expGain = Math.floor(baseExp * levelMultiplier * (2 + Math.random() * 1)) // 200-500 EXP
      resources = {
        linh_thach: Math.floor(50 + Math.random() * 100), // 50-150 linh thạch
        tien_ngoc: Math.floor(5 + Math.random() * 10), // 5-15 tiên ngọc
        nguyen_thach: Math.floor(1 + Math.random() * 5) // 1-5 nguyên thạch
      }
      break
    default:
      expGain = Math.floor(baseExp * levelMultiplier * (0.5 + Math.random() * 0.5)) // 25-100 EXP
      resources = {
        linh_thach: Math.floor(5 + Math.random() * 15) // 5-20 linh thạch
      }
  }

  return {
    expGain,
    resources
  }
}

// Tính toán cấp độ mới
function calculateNewLevel(experience: number): number {
  // Công thức: level = sqrt(experience / 1440) + 1
  return Math.floor(Math.sqrt(experience / 1440)) + 1
}

