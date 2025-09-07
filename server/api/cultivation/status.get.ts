import { prisma } from '../../../lib/prisma'
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

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

    // Lấy thông tin tu luyện của người chơi
    let cultivation = await (prisma as any).playerCultivation.findUnique({
      where: { playerId }
    })

    // Nếu chưa có dữ liệu tu luyện, tạo mới
    if (!cultivation) {
      cultivation = await (prisma as any).playerCultivation.create({
        data: {
          playerId,
          currentRealm: 1,
          currentFloor: 1,
          currentExp: 0,
          totalExpGained: 0,
          currentQuality: 'Hạ Phẩm',
          eternalTitles: '[]',
          hasAscended: false
        }
      })
    }

    // Parse eternalTitles từ JSON string
    let eternalTitles = []
    try {
      eternalTitles = JSON.parse(cultivation.eternalTitles || '[]')
    } catch (e) {
      eternalTitles = []
    }

    return {
      success: true,
      data: {
        cultivation: {
          ...cultivation,
          eternalTitles
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
