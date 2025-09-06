import { PrismaClient } from '@prisma/client'
import { getQuery, eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const playerId = query.playerId as string

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    // Lấy tất cả nhiệm vụ
    const quests = await prisma.quest.findMany({
      orderBy: { difficulty: 'asc' }
    })

    // Lấy nhiệm vụ của người chơi
    const playerQuests = await prisma.playerQuest.findMany({
      where: { playerId },
      include: {
        quest: true
      }
    })

    // Tạo map để dễ tra cứu
    const playerQuestMap = new Map()
    playerQuests.forEach((pq: any) => {
      playerQuestMap.set(pq.questId, pq)
    })

    // Kết hợp thông tin nhiệm vụ với trạng thái của người chơi
    const questsWithStatus = quests.map((quest: any) => {
      const playerQuest = playerQuestMap.get(quest.id)
      
      // Xử lý nhiệm vụ lặp lại
      if (quest.isRepeatable && playerQuest) {
        const now = new Date()
        const cooldownUntil = playerQuest.cooldownUntil ? new Date(playerQuest.cooldownUntil) : null
        
        // Kiểm tra xem nhiệm vụ có thể nhận lại không
        if (cooldownUntil && now >= cooldownUntil) {
          return {
            ...quest,
            playerStatus: {
              status: 'available',
              progress: {},
              startedAt: null,
              completedAt: null,
              lastCompletedAt: playerQuest.lastCompletedAt,
              cooldownUntil: null,
              canRepeat: true
            }
          }
        } else if (cooldownUntil) {
          return {
            ...quest,
            playerStatus: {
              status: 'cooldown',
              progress: {},
              startedAt: null,
              completedAt: null,
              lastCompletedAt: playerQuest.lastCompletedAt,
              cooldownUntil: playerQuest.cooldownUntil,
              canRepeat: false,
              cooldownRemaining: Math.max(0, Math.ceil((cooldownUntil.getTime() - now.getTime()) / 1000))
            }
          }
        }
      }
      
      return {
        ...quest,
        playerStatus: playerQuest ? {
          status: playerQuest.status,
          progress: playerQuest.progress ? JSON.parse(playerQuest.progress) : {},
          startedAt: playerQuest.startedAt,
          completedAt: playerQuest.completedAt,
          lastCompletedAt: playerQuest.lastCompletedAt,
          cooldownUntil: playerQuest.cooldownUntil,
          canRepeat: quest.isRepeatable
        } : {
          status: 'available',
          progress: {},
          startedAt: null,
          completedAt: null,
          lastCompletedAt: null,
          cooldownUntil: null,
          canRepeat: quest.isRepeatable
        }
      }
    })

    return {
      success: true,
      data: {
        quests: questsWithStatus,
        total: quests.length
      }
    }
  } catch (error: any) {
    console.error('Quest list error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi lấy danh sách nhiệm vụ'
    })
  }
})
