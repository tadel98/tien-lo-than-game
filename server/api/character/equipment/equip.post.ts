
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
import { getPrismaClient } from '../../../lib/prisma.js'



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const body = await readBody(event)
    const { playerId, equipmentId } = body

    if (!playerId || !equipmentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin trang bị từ inventory trước
    const inventoryItem = await (prisma as any).inventory.findFirst({
      where: {
        playerId,
        itemId: equipmentId,
        itemType: 'equipment'
      }
    })

    if (!inventoryItem) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy trang bị trong túi đồ'
      })
    }

    // Tìm equipment trong database
    const equipment = await (prisma as any).equipment.findFirst({
      where: {
        id: equipmentId
      },
      include: {
        type: true
      }
    })

    if (!equipment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy thông tin trang bị'
      })
    }

    // Tạo hoặc cập nhật playerEquipment
    const playerEquipment = await (prisma as any).playerEquipment.upsert({
      where: {
        playerId_equipmentId: {
          playerId,
          equipmentId
        }
      },
      update: {},
      create: {
        playerId,
        equipmentId,
        isEquipped: false
      },
      include: {
        equipment: {
          include: {
            type: true
          }
        }
      }
    })

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
            slot: equipment.type.slot
          }
        }
      }
    })

    if (currentEquipped) {
      await (prisma as any).playerEquipment.update({
        where: { id: currentEquipped.id },
        data: { isEquipped: false }
      })
    }

    // Trang bị mới
    const updatedEquipment = await (prisma as any).playerEquipment.update({
      where: { id: playerEquipment.id },
      data: { isEquipped: true }
    })

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
      message: `Đã trang bị ${equipment.displayName}`,
      data: updatedEquipment
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})



