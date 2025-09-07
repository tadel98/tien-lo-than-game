
import { getQuery, eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const query = getQuery(event)
    const playerId = query.playerId as string

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    // Lấy thông tin linh thú của người chơi
    const spiritBeasts = await (prisma as any).spiritBeast.findMany({
      where: { playerId },
      include: {
        type: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Lấy danh sách loại linh thú
    const beastTypes = await (prisma as any).spiritBeastType.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    // Lấy danh sách thức ăn
    const foods = await (prisma as any).beastFood.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' }
    })

    // Lấy khu vực săn
    const huntingGrounds = await (prisma as any).huntingGround.findMany({
      where: { isActive: true },
      orderBy: { level: 'asc' }
    })

    // Lấy lịch sử săn gần đây
    const recentHunting = await (prisma as any).huntingHistory.findMany({
      where: { playerId },
      include: {
        ground: true,
        beast: {
          include: {
            type: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return {
      success: true,
      data: {
        spiritBeasts,
        beastTypes,
        foods,
        huntingGrounds,
        recentHunting
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})


