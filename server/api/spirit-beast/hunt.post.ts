
import { readBody, eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = getPrismaClient()
const body = await readBody(event)
    const { playerId, groundId } = body

    if (!playerId || !groundId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin người chơi
    const player = await (prisma as any).player.findUnique({
      where: { id: playerId }
    })

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    // Lấy thông tin khu săn bắn
    const ground = await (prisma as any).huntingGround.findUnique({
      where: { id: groundId }
    })

    if (!ground) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy khu săn bắn'
      })
    }

    // Tính toán xác suất bắt được linh thú
    const baseValue = Number(ground.baseValue)
    const calculatedStats = {
      strength: baseValue + (player.level * 0.1),
      agility: baseValue + (player.level * 0.1),
      intelligence: baseValue + (player.level * 0.1)
    }

    // Tính xác suất thành công
    const successRate = Math.min(0.8, 0.3 + (player.level * 0.01))
    const isSuccess = Math.random() < successRate

    let capturedBeast = null
    if (isSuccess) {
      // Tạo linh thú mới
      const beastType = await (prisma as any).spiritBeastType.findFirst({
        where: {
          level: {
            lte: player.level
          }
        },
        orderBy: {
          level: 'desc'
        }
      })

      if (beastType) {
        capturedBeast = await (prisma as any).spiritBeast.create({
          data: {
            playerId,
            typeId: beastType.id,
            name: beastType.name,
            level: 1,
            experience: 0,
            stats: JSON.stringify(calculatedStats),
            isActive: false,
            isFighting: false
          }
        })
      }
    }

    // Tính toán phần thưởng
    const rewards: any = {
      experience: Math.floor(Math.random() * 100) + 50,
      resources: {
        linh_thach: Math.floor(Math.random() * 10) + 5
      }
    }

    // Thêm phần thưởng ngẫu nhiên
    const dropRates = JSON.parse(ground.dropRates || '{}')
    for (const [item, rate] of Object.entries(dropRates)) {
      if (Math.random() < Number(rate)) {
        rewards.additional = rewards.additional || {}
        rewards.additional[item] = Math.floor(Math.random() * 3) + 1
      }
    }

    // Ghi lại lịch sử săn bắn
    await (prisma as any).huntingHistory.create({
      data: {
        playerId,
        groundId,
        capturedBeastId: (capturedBeast as any)?.id || null,
        isSuccess,
        rewards: JSON.stringify(rewards),
        createdAt: new Date()
      }
    })

    return {
      success: true,
      message: isSuccess ? 'Bắt được linh thú!' : 'Không bắt được linh thú',
      capturedBeast,
      rewards,
      isSuccess
    }
  } catch (error: any) {
    console.error('Hunt error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi săn bắn'
    })
  }
})

