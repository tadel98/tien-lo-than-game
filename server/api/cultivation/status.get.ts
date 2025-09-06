import { PrismaClient } from '@prisma/client'
import { getQuery, eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const playerId = query.playerId as string

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

    // Tính toán thông tin tu luyện
    const currentLevel = player.level
    const currentExp = Number(player.experience)
    const nextLevelExp = calculateNextLevelExp(currentLevel)
    const progressPercentage = Math.min((currentExp / nextLevelExp) * 100, 100)

    // Tính toán cảnh giới
    const realm = calculateRealm(currentLevel)
    const realmProgress = calculateRealmProgress(currentLevel)

    // Lấy tài nguyên cần thiết
    const linhThachResource = player.resources.find(r => r.resource.name === 'linh_thach')
    const linhThachAmount = linhThachResource ? Number(linhThachResource.amount) : 0

    return {
      success: true,
      data: {
        player: {
          ...player,
          experience: player.experience.toString()
        },
        cultivation: {
          currentLevel,
          currentExp,
          nextLevelExp,
          progressPercentage: Math.round(progressPercentage * 100) / 100,
          realm,
          realmProgress,
          canCultivate: linhThachAmount >= 100,
          linhThachAmount
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
function calculateNextLevelExp(level: number): number {
  // Công thức mới: EXP cần = level^2 * 1440
  // Để level 1000 cần khoảng 1,440,000,000 EXP (100 ngày online)
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

// Tính toán tiến độ cảnh giới
function calculateRealmProgress(level: number): { current: number, max: number, percentage: number } {
  const realmLevels = {
    'Phàm cảnh': { min: 1, max: 9 },
    'Luyện Khí cảnh': { min: 10, max: 49 },
    'Trúc Cơ cảnh': { min: 50, max: 99 },
    'Kim Đan cảnh': { min: 100, max: 199 },
    'Nguyên Anh cảnh': { min: 200, max: 499 },
    'Hóa Thần cảnh': { min: 500, max: 999 },
    'Hợp Thể cảnh': { min: 1000, max: 1000 } // Cảnh giới cao nhất
  }

  const realm = calculateRealm(level)
  const realmInfo = realmLevels[realm]
  
  if (!realmInfo) {
    return { current: 0, max: 1, percentage: 0 }
  }

  const current = Math.min(level - realmInfo.min + 1, realmInfo.max - realmInfo.min + 1)
  const max = realmInfo.max - realmInfo.min + 1
  const percentage = Math.round((current / max) * 100)

  return { current, max, percentage }
}
