
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const body = await readBody(event)
    const { playerId, level, realm, experience } = body

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    // Update player data
    const updatedPlayer = await prisma.player.update({
      where: {
        id: playerId
      },
      data: {
        ...(level && { level }),
        ...(realm && { realm }),
        ...(experience && { experience: BigInt(experience) })
      }
    })

    return {
      success: true,
      message: 'Cập nhật thông tin người chơi thành công',
      data: {
        ...updatedPlayer,
        experience: updatedPlayer.experience.toString()
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})


