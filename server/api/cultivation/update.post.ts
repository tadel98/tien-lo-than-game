import { prisma } from '../../../lib/prisma'
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { playerId, cultivationData } = body

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    if (!cultivationData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu dữ liệu tu luyện'
      })
    }

    // Chuẩn bị dữ liệu để lưu
    const updateData = {
      currentRealm: cultivationData.currentRealm || 1,
      currentFloor: cultivationData.currentFloor || 1,
      currentExp: cultivationData.currentExp || 0,
      totalExpGained: cultivationData.totalExpGained || 0,
      currentQuality: cultivationData.currentQuality || 'Hạ Phẩm',
      eternalTitles: JSON.stringify(cultivationData.eternalTitles || []),
      hasAscended: cultivationData.hasAscended || false
    }

    // Cập nhật hoặc tạo mới dữ liệu tu luyện
    const cultivation = await (prisma as any).playerCultivation.upsert({
      where: { playerId },
      update: updateData,
      create: {
        playerId,
        ...updateData
      }
    })

    // Parse eternalTitles từ JSON string để trả về
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
