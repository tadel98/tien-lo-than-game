import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { playerId, cultivationType = 'basic' } = body

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
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

    // Kiểm tra Linh Thạch để tu luyện
    const linhThachResource = player.resources.find(r => r.resource.name === 'linh_thach')
    const linhThachAmount = linhThachResource ? Number(linhThachResource.amount) : 0

    if (linhThachAmount < 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Không đủ Linh Thạch để tu luyện (cần ít nhất 100)'
      })
    }

    // Tính toán kinh nghiệm và tài nguyên
    const experienceGain = calculateExperienceGain(player.level, cultivationType)
    const resourceCost = calculateResourceCost(cultivationType) // Bao gồm Linh Thạch
    const newExperience = BigInt(player.experience) + BigInt(experienceGain)

    // Cập nhật người chơi
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        experience: newExperience,
        level: calculateNewLevel(Number(newExperience))
      }
    })

    // Trừ tài nguyên
    if (linhThachResource) {
      // Trừ Linh Thạch
      await prisma.playerResource.update({
        where: { id: linhThachResource.id },
        data: {
          amount: Number(linhThachResource.amount) - resourceCost.linhThach
        }
      })
    }

    // Thêm tài nguyên thưởng (nếu có)
    if (resourceCost.rewards) {
      for (const [resourceName, amount] of Object.entries(resourceCost.rewards)) {
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

    return {
      success: true,
      message: 'Tu luyện thành công',
      data: {
        player: {
          ...updatedPlayer,
          experience: updatedPlayer.experience.toString()
        },
        experienceGain,
        resourceCost,
        newLevel: updatedPlayer.level
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})

// Tính toán kinh nghiệm nhận được
function calculateExperienceGain(level: number, cultivationType: string): number {
  const baseExp = 100
  const levelMultiplier = Math.floor(level / 10) + 1
  const typeMultiplier = cultivationType === 'advanced' ? 2 : 1
  
  return Math.floor(baseExp * levelMultiplier * typeMultiplier)
}

// Tính toán tài nguyên cần thiết
function calculateResourceCost(cultivationType: string) {
  const costs = {
    basic: {
      linhThach: 100, // Linh Thạch
      rewards: {
        tien_ngoc: 10
      }
    },
    advanced: {
      linhThach: 500, // Linh Thạch
      rewards: {
        tien_ngoc: 50,
        nguyen_thach: 100
      }
    }
  }
  
  return costs[cultivationType] || costs.basic
}

// Tính toán cấp độ mới
function calculateNewLevel(experience: number): number {
  // Công thức: level = sqrt(experience / 1000) + 1
  return Math.floor(Math.sqrt(experience / 1000)) + 1
}
