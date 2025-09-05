import { PrismaClient } from '@prisma/client'
import { getQuery, eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const category = query.category as string

    // Lấy danh sách cửa hàng
    const shops = await (prisma as any).shop.findMany({
      where: {
        isActive: true,
        ...(category && { category })
      },
      include: {
        items: {
          where: {
            isActive: true
          },
          orderBy: {
            level: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return {
      success: true,
      data: shops
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})
