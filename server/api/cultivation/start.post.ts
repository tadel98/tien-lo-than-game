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

    // Kiểm tra Sức Mạnh Chiến Đấu (Huyền Lực)
    const huyenLucResource = player.resources.find(r => r.resource.name === 'huyen_luc')
    const huyenLucAmount = huyenLucResource ? Number(huyenLucResource.amount) : 0

    if (huyenLucAmount < 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Không đủ Sức Mạnh Chiến Đấu để tu luyện (cần ít nhất 100)'
      })
    }

    // Tính toán kinh nghiệm và tài nguyên
    const experienceGain = calculateExperienceGain(player.level, cultivationType)
    const resourceCost = calculateResourceCost(cultivationType) // Bao gồm Sức Mạnh Chiến Đấu (Huyền Lực)
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
    if (huyenLucResource) {
      // Trừ Sức Mạnh Chiến Đấu (Huyền Lực)
      await prisma.playerResource.update({
        where: { id: huyenLucResource.id },
        data: {
          amount: Number(huyenLucResource.amount) - resourceCost.huyenLuc
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
      huyenLuc: 100, // Sức Mạnh Chiến Đấu (Huyền Lực)
      rewards: {
        linh_thach: 50
      }
    },
    advanced: {
      huyenLuc: 500, // Sức Mạnh Chiến Đấu (Huyền Lực)
      rewards: {
        linh_thach: 200,
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
