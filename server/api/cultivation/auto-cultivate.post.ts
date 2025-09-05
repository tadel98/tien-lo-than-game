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
    const player = await (prisma as any).player.findUnique({
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
    const updatedPlayer = await (prisma as any).player.update({
      where: { id: playerId },
      data: {
        experience: newExp,
        level: newLevel,
        updatedAt: new Date()
      }
    })

    // Nếu có level up, cập nhật sức mạnh chiến đấu
    if (levelUp) {
      try {
        const combatPowerResponse = await $fetch('/api/character/update-combat-power', {
          method: 'POST',
          body: {
            playerId,
            levelGain
          }
        })
        console.log('Combat power updated:', combatPowerResponse.data.combatPowerIncrease)
      } catch (err) {
        console.error('Error updating combat power:', err)
      }
    }

    // Tạo log tu luyện
    await (prisma as any).cultivationLog.create({
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
