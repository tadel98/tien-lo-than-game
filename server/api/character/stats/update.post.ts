
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
import { getPrismaClient } from '../../../lib/prisma.js'



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const body = await readBody(event)
    const { playerId, stats } = body

    if (!playerId || !stats) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Kiểm tra người chơi tồn tại
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    })

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    // Cập nhật hoặc tạo stats
    const updatedStats = await prisma.playerStats.upsert({
      where: { playerId },
      update: stats,
      create: {
        playerId,
        ...stats
      }
    })

    return {
      success: true,
      message: 'Cập nhật thuộc tính thành công',
      data: updatedStats
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})



