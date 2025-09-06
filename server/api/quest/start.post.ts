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
    const quest = await prisma.quest.findUnique({
      where: { id: questId }
    })

    if (!quest) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy nhiệm vụ'
      })
    }

    // Kiểm tra người chơi có đủ level không
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    })

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    // Parse requirements để kiểm tra level
    let requiredLevel = 1
    try {
      const requirements = JSON.parse(quest.requirements || '{}')
      requiredLevel = requirements.level || 1
    } catch (e) {
      console.error('Error parsing quest requirements:', e)
      // Nếu không parse được requirements, coi như level 1
      requiredLevel = 1
    }

    if (player.level < requiredLevel) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cần level ${requiredLevel} để nhận nhiệm vụ này`
      })
    }

    // Kiểm tra nhiệm vụ đã được nhận chưa
    const existingPlayerQuest = await prisma.playerQuest.findFirst({
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
      if (existingPlayerQuest.status === 'completed' && !quest.isRepeatable) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nhiệm vụ đã hoàn thành'
        })
      }
      if (existingPlayerQuest.status === 'cooldown') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nhiệm vụ đang trong thời gian cooldown'
        })
      }
      // Quest có thể bắt đầu nếu status là 'available' hoặc 'completed' (cho repeatable quests)
    }

    // Bắt đầu nhiệm vụ
    const playerQuest = await prisma.playerQuest.upsert({
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
          // Convert any BigInt fields to string
          createdAt: quest.createdAt.toISOString(),
          updatedAt: quest.updatedAt.toISOString(),
          playerStatus: {
            status: playerQuest.status,
            progress: JSON.parse(playerQuest.progress),
            startedAt: playerQuest.startedAt?.toISOString(),
            completedAt: playerQuest.completedAt?.toISOString()
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Start quest error:', error)
    
    // Nếu là lỗi business logic (400), giữ nguyên status code
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      throw error
    }
    
    // Chỉ throw 500 cho lỗi server thực sự
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi bắt đầu nhiệm vụ'
    })
  }
})
