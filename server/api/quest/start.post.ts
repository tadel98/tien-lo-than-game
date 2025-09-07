
import { readBody, eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = getPrismaClient()
const body = await readBody(event)
    const { playerId, questId } = body

    console.log('Quest start request:', { playerId, questId })

    if (!playerId || !questId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin quest
    const quest = await prisma.quest.findUnique({
      where: { id: questId }
    })

    if (!quest) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy nhiệm vụ'
      })
    }

    if (!quest.isActive) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nhiệm vụ không khả dụng'
      })
    }

    // Lấy thông tin player
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    })

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    // Kiểm tra level requirement
    let requiredLevel = 1
    try {
      const requirements = JSON.parse(quest.requirements || '{}')
      requiredLevel = requirements.level || 1
    } catch (e) {
      console.error('Error parsing quest requirements:', e)
    }

    if (player.level < requiredLevel) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cần level ${requiredLevel} để nhận nhiệm vụ này`
      })
    }

    // Kiểm tra quest đã tồn tại chưa
    const existingPlayerQuest = await prisma.playerQuest.findFirst({
      where: {
        playerId,
        questId
      }
    })

    if (existingPlayerQuest) {
      // Nếu quest đang in_progress
      if (existingPlayerQuest.status === 'in_progress') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nhiệm vụ đang được thực hiện'
        })
      }

      // Nếu quest đã completed và không repeatable
      if (existingPlayerQuest.status === 'completed' && !quest.isRepeatable) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nhiệm vụ đã hoàn thành và không thể lặp lại'
        })
      }

      // Nếu quest đang cooldown
      if (existingPlayerQuest.status === 'cooldown') {
        const now = new Date()
        const cooldownUntil = existingPlayerQuest.cooldownUntil ? new Date(existingPlayerQuest.cooldownUntil) : null
        
        if (cooldownUntil && now < cooldownUntil) {
          const remainingSeconds = Math.ceil((cooldownUntil.getTime() - now.getTime()) / 1000)
          throw createError({
            statusCode: 400,
            statusMessage: `Nhiệm vụ đang trong thời gian cooldown. Còn lại ${remainingSeconds} giây`
          })
        }
      }
    }

    // Tạo hoặc cập nhật player quest
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
        progress: JSON.stringify({}),
        completedAt: null
      },
      create: {
        playerId,
        questId,
        status: 'in_progress',
        startedAt: new Date(),
        progress: JSON.stringify({})
      }
    })

    console.log('Quest started successfully:', playerQuest.id)

    return {
      success: true,
      message: 'Đã nhận nhiệm vụ thành công',
      data: {
        quest: {
          id: quest.id,
          name: quest.name,
          displayName: quest.displayName,
          description: quest.description,
          category: quest.category,
          difficulty: quest.difficulty,
          rewards: quest.rewards,
          requirements: quest.requirements,
          isRepeatable: quest.isRepeatable,
          repeatInterval: quest.repeatInterval,
          playerStatus: {
            status: playerQuest.status,
            progress: playerQuest.progress ? JSON.parse(playerQuest.progress) : {},
            startedAt: playerQuest.startedAt?.toISOString(),
            completedAt: playerQuest.completedAt?.toISOString()
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Start quest error:', error)
    
    // Nếu là lỗi business logic, giữ nguyên status code
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi bắt đầu nhiệm vụ'
    })
  }
})
