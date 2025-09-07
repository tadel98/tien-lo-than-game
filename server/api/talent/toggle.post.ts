
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = getPrismaClient()
const body = await readBody(event)
    const { playerId, talentId, isActive } = body

    if (!playerId || !talentId || typeof isActive !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin thiên phú của người chơi
    const playerTalent = await (prisma as any).playerTalent.findUnique({
      where: {
        playerId_talentId: {
          playerId,
          talentId
        }
      }
    })

    if (!playerTalent || !playerTalent.isUnlocked) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Thiên phú chưa được mở khóa'
      })
    }

    // Cập nhật trạng thái
    const updatedPlayerTalent = await (prisma as any).playerTalent.update({
      where: { id: playerTalent?.id },
      data: { isActive },
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
      message: `${isActive ? 'Kích hoạt' : 'Tắt'} thiên phú ${updatedPlayerTalent.talent.displayName}`,
      data: {
        ...updatedPlayerTalent,
        talent: {
          ...updatedPlayerTalent.talent,
          effects: updatedPlayerTalent.talent.effects ? JSON.parse(updatedPlayerTalent.talent.effects) : {},
          requirements: updatedPlayerTalent.talent.requirements ? JSON.parse(updatedPlayerTalent.talent.requirements) : {}
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

