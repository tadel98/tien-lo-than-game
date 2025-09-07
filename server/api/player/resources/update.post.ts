import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
const { getPrismaClient } = require('../../../../lib/prisma')

export default eventHandler(async (event) => {
  try {
    const prisma = await getPrismaClient()
    const body = await readBody(event)
    const { playerId, resourceName, amount, locked } = body

    // console.log('Update resource request:', { playerId, resourceName, amount, locked })

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

    // console.log('Found resource:', resource)

    if (!resource) {
      // Tạo resource nếu chưa tồn tại
      // console.log('Creating resource:', resourceName)
      const newResource = await prisma.resource.create({
        data: {
          name: resourceName,
          displayName: resourceName === 'tien_ngoc' ? 'Tiên Ngọc' : 
                      resourceName === 'linh_thach' ? 'Linh Thạch' : 
                      resourceName === 'tien_ngoc_khoa' ? 'Tiên Ngọc Khóa' : resourceName,
          description: `Tài nguyên ${resourceName}`,
          icon: resourceName === 'tien_ngoc' ? '💎' : 
                resourceName === 'linh_thach' ? '🔮' : 
                resourceName === 'tien_ngoc_khoa' ? '🔒' : '💰',
          color: resourceName === 'tien_ngoc' ? '#fbbf24' : 
                 resourceName === 'linh_thach' ? '#3b82f6' : 
                 resourceName === 'tien_ngoc_khoa' ? '#6b7280' : '#10b981'
        }
      })
      // console.log('Created resource:', newResource)
      
      // Sử dụng resource vừa tạo
      const updatedResource = await prisma.playerResource.upsert({
        where: {
          playerId_resourceId: {
            playerId,
            resourceId: newResource.id
          }
        },
        update: {
          ...(amount !== undefined && { amount }),
          ...(locked !== undefined && { locked })
        },
        create: {
          playerId,
          resourceId: newResource.id,
          amount: amount || 0,
          locked: locked || 0
        }
      })

      return {
        success: true,
        message: 'Cập nhật tài nguyên thành công',
        data: updatedResource
      }
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

