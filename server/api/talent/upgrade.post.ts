
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
import { getPrismaClient } from '../../../lib/prisma.js'



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

    // Lấy thông tin thiên phú của người chơi
    const playerTalent = await (prisma as any).playerTalent.findUnique({
      where: {
        playerId_talentId: {
          playerId,
          talentId
        }
      },
      include: {
        talent: true
      }
    })

    if (!playerTalent || !playerTalent.isUnlocked) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Thiên phú chưa được mở khóa'
      })
    }

    if (playerTalent.level >= playerTalent.talent.maxLevel) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiên phú đã đạt cấp tối đa'
      })
    }

    // Tính chi phí nâng cấp
    const upgradeCost = playerTalent.talent.cost * playerTalent.level

    // Kiểm tra tài nguyên
    if (upgradeCost > 0) {
      const playerResource = await (prisma as any).playerResource.findFirst({
        where: {
          playerId,
          resource: {
            name: 'tien_ngoc'
          }
        }
      })

      if (!playerResource || Number(playerResource.amount) < upgradeCost) {
        throw createError({
          statusCode: 400,
          statusMessage: `Không đủ Tiên Ngọc để nâng cấp (cần ${upgradeCost})`
        })
      }

      // Trừ tài nguyên
      await (prisma as any).playerResource.update({
        where: { id: playerResource?.id },
        data: {
          amount: Number(playerResource.amount) - upgradeCost
        }
      })
    }

    // Nâng cấp thiên phú
    const updatedPlayerTalent = await (prisma as any).playerTalent.update({
      where: { id: playerTalent?.id },
      data: {
        level: playerTalent.level + 1
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
      message: `Đã nâng cấp ${updatedPlayerTalent.talent.displayName} lên cấp ${updatedPlayerTalent.level}`,
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



