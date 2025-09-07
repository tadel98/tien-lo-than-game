
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const body = await readBody(event)
    const { playerId, talentId } = body

    if (!playerId || !talentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin thiên phú
    const talent = await (prisma as any).talent.findUnique({
      where: { id: talentId },
      include: {
        type: true
      }
    })

    if (!talent) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy thiên phú'
      })
    }

    // Kiểm tra yêu cầu
    if (talent.requirements) {
      try {
        const requirements = JSON.parse(talent.requirements)
        const player = await (prisma as any).player.findUnique({
          where: { id: playerId }
        })

        if (player && requirements.level && player.level < requirements.level) {
          throw createError({
            statusCode: 400,
            statusMessage: `Cần cấp ${requirements.level} để mở khóa thiên phú này`
          })
        }

        if (requirements.realm && player && player.realm !== requirements.realm) {
          throw createError({
            statusCode: 400,
            statusMessage: `Cần cảnh giới ${requirements.realm} để mở khóa thiên phú này`
          })
        }
      } catch (e) {
        console.error('Error parsing talent requirements:', e)
      }
    }

    // Kiểm tra đã mở khóa chưa
    const existingTalent = await (prisma as any).playerTalent.findUnique({
      where: {
        playerId_talentId: {
          playerId,
          talentId
        }
      }
    })

    if (existingTalent && existingTalent.isUnlocked) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Đã mở khóa thiên phú này rồi'
      })
    }

    // Kiểm tra tài nguyên
    if (talent.cost > 0) {
      const playerResource = await (prisma as any).playerResource.findFirst({
        where: {
          playerId,
          resource: {
            name: 'tien_ngoc' // Sử dụng Tiên Ngọc để mở khóa
          }
        }
      })

      if (!playerResource || Number(playerResource.amount) < talent.cost) {
        throw createError({
          statusCode: 400,
          statusMessage: `Không đủ Tiên Ngọc để mở khóa (cần ${talent.cost})`
        })
      }

      // Trừ tài nguyên
      await (prisma as any).playerResource.update({
        where: { id: playerResource?.id },
        data: {
          amount: Number(playerResource.amount) - talent.cost
        }
      })
    }

    // Mở khóa thiên phú
    const playerTalent = await (prisma as any).playerTalent.upsert({
      where: {
        playerId_talentId: {
          playerId,
          talentId
        }
      },
      update: {
        isUnlocked: true,
        unlockedAt: new Date()
      },
      create: {
        playerId,
        talentId,
        isUnlocked: true,
        unlockedAt: new Date()
      },
      include: {
        talent: {
          include: {
            type: true
          }
        }
      }
    })

    return {
      success: true,
      message: `Đã mở khóa thiên phú ${talent.displayName}`,
      data: {
        ...playerTalent,
        talent: {
          ...playerTalent.talent,
          effects: playerTalent.talent.effects ? JSON.parse(playerTalent.talent.effects) : {},
          requirements: playerTalent.talent.requirements ? JSON.parse(playerTalent.talent.requirements) : {}
        }
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})


