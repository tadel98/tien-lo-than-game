import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { playerId, questId } = body

    if (!playerId || !questId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Kiểm tra nhiệm vụ có tồn tại không
    const quest = await (prisma as any).quest.findUnique({
      where: { id: questId }
    })

    if (!quest) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy nhiệm vụ'
      })
    }

    // Kiểm tra người chơi có đủ level không
    const player = await (prisma as any).player.findUnique({
      where: { id: playerId }
    })

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    if (player.level < quest.level) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cần level ${quest.level} để nhận nhiệm vụ này`
      })
    }

    // Kiểm tra nhiệm vụ đã được nhận chưa
    const existingPlayerQuest = await (prisma as any).playerQuest.findFirst({
      where: {
        playerId,
        questId
      }
    })

    if (existingPlayerQuest) {
      if (existingPlayerQuest.status === 'in_progress') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nhiệm vụ đang được thực hiện'
        })
      }
      if (existingPlayerQuest.status === 'completed') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nhiệm vụ đã hoàn thành'
        })
      }
    }

    // Bắt đầu nhiệm vụ
    const playerQuest = await (prisma as any).playerQuest.upsert({
      where: {
        playerId_questId: {
          playerId,
          questId
        }
      },
      update: {
        status: 'in_progress',
        startedAt: new Date(),
        progress: JSON.stringify({})
      },
      create: {
        playerId,
        questId,
        status: 'in_progress',
        startedAt: new Date(),
        progress: JSON.stringify({})
      }
    })

    return {
      success: true,
      data: {
        quest: {
          ...quest,
          playerStatus: {
            status: playerQuest.status,
            progress: JSON.parse(playerQuest.progress),
            startedAt: playerQuest.startedAt,
            completedAt: playerQuest.completedAt
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Start quest error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi bắt đầu nhiệm vụ'
    })
  }
})
