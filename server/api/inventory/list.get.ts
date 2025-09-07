
import { getQuery, eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = getPrismaClient()
const query = getQuery(event)
    const playerId = query.playerId as string

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    // Lấy danh sách inventory
    const inventory = await (prisma as any).inventory.findMany({
      where: { playerId },
      orderBy: [
        { itemType: 'asc' },
        { name: 'asc' }
      ]
    })

    // Nhóm theo loại item
    const groupedInventory = inventory.reduce((acc, item) => {
      if (!acc[item.itemType]) {
        acc[item.itemType] = []
      }
      acc[item.itemType].push(item)
      return acc
    }, {} as Record<string, any[]>)

    return {
      success: true,
      data: {
        inventory,
        grouped: groupedInventory
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})

