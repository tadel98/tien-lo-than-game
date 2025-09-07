
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

    // Lấy thông tin lò đạo của người chơi
    const playerFurnaces = await (prisma as any).playerFurnace.findMany({
      where: { playerId },
      include: {
        furnace: true
      }
    })

    // Lấy danh sách công thức
    const recipes = await (prisma as any).recipe.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { level: 'asc' }
      ]
    })

    // Lấy lịch sử chế tạo gần đây
    const recentCrafting = await (prisma as any).craftingHistory.findMany({
      where: { playerId },
      include: {
        recipe: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return {
      success: true,
      data: {
        furnaces: playerFurnaces,
        recipes,
        recentCrafting
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})

