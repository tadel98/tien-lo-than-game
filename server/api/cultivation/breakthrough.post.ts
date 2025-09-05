import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError } from 'h3'
import { $fetch } from 'ofetch'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { playerId } = body

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

    // Kiểm tra điều kiện đột phá
    const currentLevel = player.level
    const currentExp = Number(player.experience)
    const nextLevelExp = calculateNextLevelExp(currentLevel)

    if (currentExp < nextLevelExp) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Chưa đủ kinh nghiệm để đột phá'
      })
    }

    // Kiểm tra tài nguyên cần thiết
    const breakthroughCost = calculateBreakthroughCost(currentLevel)
    const tienNgocResource = player.resources.find(r => r.resource.name === 'tien_ngoc')
    const linhThachResource = player.resources.find(r => r.resource.name === 'linh_thach')

    if (!tienNgocResource || Number(tienNgocResource.amount) < breakthroughCost.tienNgoc) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Không đủ Tiên Ngọc để đột phá'
      })
    }

    if (!linhThachResource || Number(linhThachResource.amount) < breakthroughCost.linhThach) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Không đủ Linh Thạch để đột phá'
      })
    }

    // Thực hiện đột phá
    const newLevel = currentLevel + 1
    const newRealm = calculateRealm(newLevel)
    const oldRealm = calculateRealm(currentLevel)

    // Cập nhật người chơi
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        level: newLevel,
        realm: newRealm
      }
    })

    // Cập nhật sức mạnh chiến đấu khi đột phá
    try {
      const combatPowerResponse = await $fetch('/api/character/update-combat-power', {
        method: 'POST',
        body: {
          playerId,
          levelGain: 1 // Đột phá tăng 1 level
        }
      })
      console.log('Combat power updated after breakthrough:', combatPowerResponse.data.combatPowerIncrease)
    } catch (err) {
      console.error('Error updating combat power after breakthrough:', err)
    }

    // Trừ tài nguyên
    // Trừ Tiên Ngọc
    await prisma.playerResource.update({
      where: { id: tienNgocResource.id },
      data: {
        amount: Number(tienNgocResource.amount) - breakthroughCost.tienNgoc
      }
    })

    await prisma.playerResource.update({
      where: { id: linhThachResource.id },
      data: {
        amount: Number(linhThachResource.amount) - breakthroughCost.linhThach
      }
    })

    // Thưởng đột phá
    const rewards = calculateBreakthroughRewards(newLevel)
    for (const [resourceName, amount] of Object.entries(rewards)) {
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

    return {
      success: true,
      message: 'Đột phá thành công!',
      data: {
        player: {
          ...updatedPlayer,
          experience: updatedPlayer.experience.toString()
        },
        breakthrough: {
          oldLevel: currentLevel,
          newLevel,
          oldRealm,
          newRealm,
          isRealmChange: oldRealm !== newRealm,
          rewards
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

// Tính toán kinh nghiệm cần cho cấp tiếp theo
// Công thức mới: 100 ngày online liên tục để lên cảnh giới cao nhất
// 100 ngày = 8,640,000 giây, tu luyện mỗi 6s = 1,440,000 lần
// Mỗi lần +1000 EXP = 1,440,000,000 EXP tổng cộng
// Level 1000 cần khoảng 1,440,000,000 EXP
function calculateNextLevelExp(level: number): number {
  // Công thức mới: EXP cần = level^2 * 1440 (thay vì level^2 * 1000)
  // Điều chỉnh để level 1000 cần khoảng 1,440,000,000 EXP
  return Math.pow(level, 2) * 1440
}

// Tính toán cảnh giới
function calculateRealm(level: number): string {
  if (level < 10) return 'Phàm cảnh'
  if (level < 50) return 'Luyện Khí cảnh'
  if (level < 100) return 'Trúc Cơ cảnh'
  if (level < 200) return 'Kim Đan cảnh'
  if (level < 500) return 'Nguyên Anh cảnh'
  if (level < 1000) return 'Hóa Thần cảnh'
  return 'Hợp Thể cảnh'
}

// Tính toán chi phí đột phá
function calculateBreakthroughCost(level: number) {
  const baseTienNgoc = 1000
  const baseLinhThach = 5000
  
  const levelMultiplier = Math.floor(level / 10) + 1
  
  return {
    tienNgoc: baseTienNgoc * levelMultiplier,
    linhThach: baseLinhThach * levelMultiplier
  }
}

// Tính toán phần thưởng đột phá
function calculateBreakthroughRewards(level: number) {
  const baseRewards = {
    tien_ngoc: 10,
    linh_thach: 1000,
    nguyen_thach: 500
  }
  
  const levelMultiplier = Math.floor(level / 10) + 1
  
  const rewards = {}
  for (const [resource, amount] of Object.entries(baseRewards)) {
    rewards[resource] = amount * levelMultiplier
  }
  
  return rewards
}
