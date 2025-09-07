
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = getPrismaClient()
const body = await readBody(event)
    const { playerId, equipmentId } = body

    if (!playerId || !equipmentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Tháo trang bị
    const updatedEquipment = await (prisma as any).playerEquipment.updateMany({
      where: {
        playerId,
        equipmentId,
        isEquipped: true
      },
      data: { isEquipped: false }
    })

    if (updatedEquipment.count === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy trang bị đang được trang bị'
      })
    }

    // Cập nhật sức mạnh chiến đấu
    try {
      await fetch('/api/character/sync-combat-power', {
        method: 'POST'
      })
    } catch (e) {
      console.error('Error syncing combat power:', e)
    }

    return {
      success: true,
      message: 'Đã tháo trang bị',
      data: { count: updatedEquipment.count }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})

