import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { playerId, resourceName, amount, locked } = body

    if (!playerId || !resourceName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Tìm resource theo name
    const resource = await prisma.resource.findUnique({
      where: { name: resourceName }
    })

    if (!resource) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy tài nguyên'
      })
    }

    // Update player resource
    const updatedResource = await prisma.playerResource.upsert({
      where: {
        playerId_resourceId: {
          playerId,
          resourceId: resource.id
        }
      },
      update: {
        ...(amount !== undefined && { amount }),
        ...(locked !== undefined && { locked })
      },
      create: {
        playerId,
        resourceId: resource.id,
        amount: amount || 0,
        locked: locked || 0
      }
    })

    return {
      success: true,
      message: 'Cập nhật tài nguyên thành công',
      data: updatedResource
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})
