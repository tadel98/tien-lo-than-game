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

    // Lấy thông tin trang bị
    const playerEquipment = await (prisma as any).playerEquipment.findFirst({
      where: {
        playerId,
        equipmentId
      },
      include: {
        equipment: {
          include: {
            type: true
          }
        }
      }
    })

    if (!playerEquipment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy trang bị'
      })
    }

    // Kiểm tra yêu cầu trang bị
    if (playerEquipment.equipment.requirements) {
      try {
        const requirements = JSON.parse(playerEquipment.equipment.requirements)
        const player = await (prisma as any).player.findUnique({
          where: { id: playerId }
        })

        if (player && requirements.level && player.level < requirements.level) {
          throw createError({
            statusCode: 400,
            statusMessage: `Cần cấp ${requirements.level} để trang bị`
          })
        }
      } catch (e) {
        console.error('Error parsing equipment requirements:', e)
      }
    }

    // Tháo trang bị cùng slot hiện tại
    const currentEquipped = await (prisma as any).playerEquipment.findFirst({
      where: {
        playerId,
        isEquipped: true,
        equipment: {
          type: {
            slot: playerEquipment.equipment.type.slot
          }
        }
      }
    })

    if (currentEquipped) {
      await (prisma as any).playerEquipment.update({
        where: { id: currentEquipped?.id },
        data: { isEquipped: false }
      })
    }

    // Trang bị mới
    const updatedEquipment = await (prisma as any).playerEquipment.update({
      where: { id: playerEquipment?.id },
      data: { isEquipped: true }
    })

    return {
      success: true,
      message: `Đã trang bị ${playerEquipment.equipment.displayName}`,
      data: updatedEquipment
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})
