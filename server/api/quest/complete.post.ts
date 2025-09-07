
import { readBody, eventHandler, createError } from 'h3'
import { getPrismaClient } from '../../../lib/prisma.js'



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const body = await readBody(event)
    const { playerId, questId } = body

    console.log('Quest complete request:', { playerId, questId })

    if (!playerId || !questId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin player quest
    const playerQuest = await prisma.playerQuest.findFirst({
      where: {
        playerId,
        questId
      },
      include: {
        quest: true,
        player: true
      }
    })

    if (!playerQuest) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy nhiệm vụ của người chơi'
      })
    }

    if (playerQuest.status !== 'in_progress') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nhiệm vụ không đang được thực hiện'
      })
    }

    const quest = playerQuest.quest
    const now = new Date()

    // Cập nhật trạng thái quest
    let updateData: any = {
      status: 'completed',
      completedAt: now,
      lastCompletedAt: now
    }

    // Xử lý quest lặp lại
    if (quest.isRepeatable && quest.repeatInterval) {
      const cooldownUntil = new Date(now.getTime() + quest.repeatInterval * 60 * 1000)
      updateData.cooldownUntil = cooldownUntil
      updateData.status = 'cooldown'
    }

    await prisma.playerQuest.update({
      where: { id: playerQuest.id },
      data: updateData
    })

    // Phân tích và áp dụng phần thưởng
    let rewards: any = {}
    let levelUp = false
    let newLevel = 0

    try {
      rewards = JSON.parse(quest.rewards || '{}')
    } catch (e) {
      console.error('Error parsing quest rewards:', e)
      rewards = {}
    }

    // Cập nhật kinh nghiệm
    if (rewards.experience) {
      const currentExp = Number(playerQuest.player?.experience || 0)
      const newExp = currentExp + Number(rewards.experience)
      
      // Tính level mới
      let calculatedLevel = playerQuest.player?.level || 1
      for (let level = calculatedLevel + 1; level <= 1000; level++) {
        const requiredExp = Math.pow(level, 2) * 1440
        if (newExp >= requiredExp) {
          calculatedLevel = level
          levelUp = true
        } else {
          break
        }
      }

      await prisma.player.update({
        where: { id: playerId },
        data: { 
          level: calculatedLevel,
          experience: newExp
        }
      })

      newLevel = calculatedLevel
    }

    // Cập nhật tài nguyên
    if (rewards.resources && typeof rewards.resources === 'object') {
      for (const [resourceName, amount] of Object.entries(rewards.resources)) {
        const resource = await prisma.resource.findFirst({
          where: { name: resourceName }
        })

        if (resource) {
          await prisma.playerResource.upsert({
            where: {
              playerId_resourceId: {
                playerId,
                resourceId: resource.id
              }
            },
            update: {
              amount: {
                increment: Number(amount)
              }
            },
            create: {
              playerId,
              resourceId: resource.id,
              amount: Number(amount)
            }
          })
        }
      }
    }

    console.log('Quest completed successfully:', quest.displayName)

    return {
      success: true,
      message: 'Hoàn thành nhiệm vụ thành công',
      data: {
        quest: {
          id: quest.id,
          name: quest.name,
          displayName: quest.displayName,
          description: quest.description,
          category: quest.category,
          difficulty: quest.difficulty,
          rewards: quest.rewards,
          isRepeatable: quest.isRepeatable,
          repeatInterval: quest.repeatInterval,
          playerStatus: {
            status: updateData.status,
            progress: JSON.parse(playerQuest.progress || '{}'),
            startedAt: playerQuest.startedAt?.toISOString(),
            completedAt: updateData.completedAt?.toISOString(),
            cooldownUntil: updateData.cooldownUntil?.toISOString()
          }
        },
        rewards,
        levelUp,
        newLevel: levelUp ? newLevel : playerQuest.player?.level || 1
      }
    }
  } catch (error: any) {
    console.error('Complete quest error:', error)
    
    // Nếu là lỗi business logic, giữ nguyên status code
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi hoàn thành nhiệm vụ'
    })
  }
})


