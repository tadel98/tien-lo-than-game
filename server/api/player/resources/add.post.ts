
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
import { getPrismaClient } from '../../../lib/prisma.js'



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const body = await readBody(event)
    const { playerId, resourceName, amount } = body

    if (!playerId || !resourceName || !amount) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Tìm resource theo tên
    const resource = await prisma.resource.findFirst({
      where: { name: resourceName }
    })

    if (!resource) {
      throw createError({
        statusCode: 404,
        statusMessage: `Không tìm thấy tài nguyên ${resourceName}`
      })
    }

    // Tìm player resource
    const playerResource = await prisma.playerResource.findFirst({
      where: {
        playerId,
        resourceId: resource.id
      }
    })

    if (!playerResource) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy tài nguyên của người chơi'
      })
    }

    // Cập nhật số lượng
    const newAmount = Number(playerResource.amount) + Number(amount)
    
    const updatedResource = await prisma.playerResource.update({
      where: { id: playerResource.id },
      data: {
        amount: newAmount
      }
    })

    return {
      success: true,
      message: `Đã thêm ${amount} ${resource.displayName}`,
      data: updatedResource
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})



