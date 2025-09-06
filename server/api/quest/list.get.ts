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

    console.log('Quest list request for player:', playerId)

    // Lấy tất cả quests active
    const quests = await prisma.quest.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { difficulty: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // Lấy player quests
    const playerQuests = await prisma.playerQuest.findMany({
      where: { playerId }
    })

    // Tạo map để tra cứu nhanh
    const playerQuestMap = new Map()
    playerQuests.forEach(pq => {
      playerQuestMap.set(pq.questId, pq)
    })

    // Lấy thông tin player để kiểm tra level
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    })

    // Kết hợp quest với player status
    const questsWithStatus = quests.map(quest => {
      const playerQuest = playerQuestMap.get(quest.id)
      const now = new Date()
      
      let playerStatus = {
        status: 'available',
        progress: {},
        startedAt: null,
        completedAt: null,
        lastCompletedAt: null,
        cooldownUntil: null,
        canRepeat: quest.isRepeatable
      }

      if (playerQuest) {
        // Kiểm tra level requirement trước
        let canAccess = true
        try {
          const requirements = JSON.parse(quest.requirements || '{}')
          const requiredLevel = requirements.level || 1
          if (player && player.level < requiredLevel) {
            canAccess = false
          }
        } catch (e) {
          console.error('Error parsing quest requirements:', e)
        }

        if (!canAccess) {
          // Player level không đủ, hiển thị locked
          playerStatus = {
            status: 'locked',
            progress: {},
            startedAt: null,
            completedAt: null,
            lastCompletedAt: playerQuest.lastCompletedAt,
            cooldownUntil: null,
            canRepeat: false
          }
        } else if (quest.isRepeatable && playerQuest.status === 'cooldown') {
          // Xử lý quest lặp lại
          const cooldownUntil = playerQuest.cooldownUntil ? new Date(playerQuest.cooldownUntil) : null
          
          if (cooldownUntil && now >= cooldownUntil) {
            // Cooldown đã hết, có thể nhận lại
            playerStatus = {
              status: 'available',
              progress: {},
              startedAt: null,
              completedAt: null,
              lastCompletedAt: playerQuest.lastCompletedAt,
              cooldownUntil: null,
              canRepeat: true
            }
          } else {
            // Vẫn đang cooldown
            const remainingSeconds = cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil.getTime() - now.getTime()) / 1000)) : 0
            playerStatus = {
              status: 'cooldown',
              progress: playerQuest.progress ? JSON.parse(playerQuest.progress) : {},
              startedAt: null,
              completedAt: null,
              lastCompletedAt: playerQuest.lastCompletedAt,
              cooldownUntil: playerQuest.cooldownUntil,
              canRepeat: false,
              cooldownRemaining: remainingSeconds
            }
          }
        } else {
          // Quest thường hoặc đang in_progress/completed
          playerStatus = {
            status: playerQuest.status,
            progress: playerQuest.progress ? JSON.parse(playerQuest.progress) : {},
            startedAt: playerQuest.startedAt,
            completedAt: playerQuest.completedAt,
            lastCompletedAt: playerQuest.lastCompletedAt,
            cooldownUntil: playerQuest.cooldownUntil,
            canRepeat: quest.isRepeatable
          }
        }
      } else {
        // Chưa có player quest, kiểm tra level requirement
        try {
          const requirements = JSON.parse(quest.requirements || '{}')
          const requiredLevel = requirements.level || 1
          
          if (player && player.level < requiredLevel) {
            playerStatus.status = 'locked'
            playerStatus.canRepeat = false
          } else {
            playerStatus.status = 'available'
            playerStatus.canRepeat = quest.isRepeatable
          }
        } catch (e) {
          console.error('Error parsing quest requirements:', e)
          // Nếu không parse được requirements, cho phép quest available
          playerStatus.status = 'available'
          playerStatus.canRepeat = quest.isRepeatable
        }
      }

      return {
        id: quest.id,
        name: quest.name,
        displayName: quest.displayName,
        description: quest.description,
        category: quest.category,
        difficulty: quest.difficulty,
        rewards: quest.rewards,
        requirements: quest.requirements,
        isActive: quest.isActive,
        isRepeatable: quest.isRepeatable,
        repeatInterval: quest.repeatInterval,
        createdAt: quest.createdAt.toISOString(),
        updatedAt: quest.updatedAt.toISOString(),
        playerStatus
      }
    })

    console.log(`Returning ${questsWithStatus.length} quests for player ${playerId}`)

    return {
      success: true,
      data: {
        quests: questsWithStatus,
        total: questsWithStatus.length
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