import { getPrismaClient } from '../../../lib/prisma.js'
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

export default eventHandler(async (event) => {
  try {
    const prisma = await getPrismaClient()
    // Get player ID from query
    const query = getQuery(event)
    const playerId = query.playerId as string

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    // Get player companions with companion details
    const playerCompanions = await prisma.playerCompanion.findMany({
      where: {
        playerId
      },
      include: {
        companion: true
      }
    })

    return {
      success: true,
      data: playerCompanions
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})


