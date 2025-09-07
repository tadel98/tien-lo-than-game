import { getQuery, eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')

export default eventHandler(async (event) => {
  try {
    const prisma = getPrismaClient()
    const query = getQuery(event)
    const category = query.category as string

    // Lấy danh sách cửa hàng
    const shops = await prisma.shop.findMany({
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
