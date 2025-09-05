import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
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
