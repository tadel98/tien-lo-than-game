import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    // Get player ID from query or session
    const query = getQuery(event)
    const playerId = query.playerId as string

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    // Get player resources with resource details
    const playerResources = await prisma.playerResource.findMany({
      where: {
        playerId
      },
      include: {
        resource: true
      }
    })

    return {
      success: true,
      data: playerResources
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})
