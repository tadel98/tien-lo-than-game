
import { getQuery, eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const query = getQuery(event)
    const playerId = query.playerId as string

    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu ID người chơi'
      })
    }

    // Lấy thống kê quests của player
    const playerQuests = await prisma.playerQuest.findMany({
      where: { playerId },
      include: {
        quest: true
      }
    })

    // Tính toán thống kê
    const stats = {
      total: playerQuests.length,
      available: 0,
      inProgress: 0,
      completed: 0,
      locked: 0,
      cooldown: 0,
      byCategory: {
        tutorial: 0,
        daily: 0,
        weekly: 0,
        story: 0,
        special: 0,
        achievement: 0,
        event: 0
      },
      byDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
        expert: 0
      }
    }

    // Đếm theo trạng thái và phân loại
    playerQuests.forEach(pq => {
      const quest = pq.quest
      
      // Đếm theo trạng thái
      if (pq.status === 'available') stats.available++
      else if (pq.status === 'in_progress') stats.inProgress++
      else if (pq.status === 'completed') stats.completed++
      else if (pq.status === 'locked') stats.locked++
      else if (pq.status === 'cooldown') stats.cooldown++

      // Đếm theo category
      if (stats.byCategory[quest.category] !== undefined) {
        stats.byCategory[quest.category]++
      }

      // Đếm theo difficulty
      if (stats.byDifficulty[quest.difficulty] !== undefined) {
        stats.byDifficulty[quest.difficulty]++
      }
    })

    // Lấy quests có thể nhận mới
    const allQuests = await prisma.quest.findMany({
      where: { isActive: true }
    })

    // Lấy thông tin player để kiểm tra level
    const player = await prisma.player.findUnique({ where: { id: playerId } })
    
    const availableQuests = allQuests.filter(quest => {
      const playerQuest = playerQuests.find(pq => pq.questId === quest.id)
      
      // Nếu chưa có player quest và đáp ứng requirements
      if (!playerQuest) {
        try {
          const requirements = JSON.parse(quest.requirements || '{}')
          
          if (player && player.level >= (requirements.level || 1)) {
            return true
          }
        } catch (e) {
          console.error('Error parsing requirements:', e)
        }
      }
      
      return false
    })

    return {
      success: true,
      data: {
        stats,
        newQuestsAvailable: availableQuests.length,
        canReceiveNewQuests: availableQuests.length > 0
      }
    }
  } catch (error: any) {
    console.error('Quest stats error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi lấy thống kê nhiệm vụ'
    })
  }
})


