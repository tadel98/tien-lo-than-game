import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { playerId, skillId } = body

    if (!playerId || !skillId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin kỹ năng
    const skill = await (prisma as any).skill.findUnique({
      where: { id: skillId }
    })

    if (!skill) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy kỹ năng'
      })
    }

    // Kiểm tra yêu cầu học kỹ năng
    if (skill.requirements) {
      try {
        const requirements = JSON.parse(skill.requirements)
        const player = await (prisma as any).player.findUnique({
          where: { id: playerId }
        })

        if (player && requirements.level && player.level < requirements.level) {
          throw createError({
            statusCode: 400,
            statusMessage: `Cần cấp ${requirements.level} để học kỹ năng này`
          })
        }
      } catch (e) {
        console.error('Error parsing skill requirements:', e)
      }
    }

    // Kiểm tra đã học chưa
    const existingSkill = await (prisma as any).playerSkill.findUnique({
      where: {
        playerId_skillId: {
          playerId,
          skillId
        }
      }
    })

    if (existingSkill) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Đã học kỹ năng này rồi'
      })
    }

    // Học kỹ năng
    const playerSkill = await (prisma as any).playerSkill.create({
      data: {
        playerId,
        skillId,
        isLearned: true,
        learnedAt: new Date()
      },
      include: {
        skill: true
      }
    })

    return {
      success: true,
      message: `Đã học kỹ năng ${skill.displayName}`,
      data: playerSkill
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})
