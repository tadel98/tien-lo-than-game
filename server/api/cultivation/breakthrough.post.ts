import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError } from 'h3'

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

    // Bỏ điều kiện tài nguyên - chỉ cần đủ EXP

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
      // Tính toán điểm cộng cho level mới
      const pointsPerLevel = 5 + Math.floor(newLevel / 10)
      const totalPoints = pointsPerLevel

      // Lấy stats hiện tại
      let playerStats = await prisma.playerStats.findUnique({
        where: { playerId }
      })

      if (!playerStats) {
        // Tạo stats mới nếu chưa có
        playerStats = await prisma.playerStats.create({
          data: {
            playerId,
            hp: 100 + (newLevel * 10),
            mp: 50 + (newLevel * 5),
            attack: 10 + (newLevel * 2),
            defense: 5 + (newLevel * 1),
            speed: 8 + (newLevel * 1),
            luck: 5,
            wisdom: 5,
            strength: 5 + Math.floor(newLevel / 5),
            agility: 5 + Math.floor(newLevel / 5),
            vitality: 5 + Math.floor(newLevel / 5),
            spirit: 5 + Math.floor(newLevel / 5)
          }
        })
      } else {
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
        const levelBonus = newLevel * 10
        const newCombatPower = Math.floor(basePower * 10 + mainStatsBonus + levelBonus)

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
              amount: newCombatPower,
              locked: 0
            }
          })
        }

        console.log('Combat power updated after breakthrough:', newCombatPower)
      }
    } catch (err) {
      console.error('Error updating combat power after breakthrough:', err)
    }

    // Không trừ tài nguyên - breakthrough miễn phí

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
      message: 'Đột phá thành công! (Miễn phí)',
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
          rewards,
          cost: {
            tienNgoc: 0,
            linhThach: 0
          }
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
