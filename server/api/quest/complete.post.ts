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

    // Lấy thông tin nhiệm vụ và người chơi
    const playerQuest = await (prisma as any).playerQuest.findFirst({
      where: {
        playerId,
        questId
      },
      include: {
        quest: true
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

    // Kiểm tra điều kiện hoàn thành (đơn giản - chỉ cần bắt đầu nhiệm vụ)
    // Trong thực tế có thể kiểm tra các điều kiện phức tạp hơn

    // Cập nhật trạng thái nhiệm vụ
    const now = new Date()
    let updateData: any = {
      status: 'completed',
      completedAt: now,
      lastCompletedAt: now
    }

    // Nếu là nhiệm vụ lặp lại, tính toán cooldown
    if (quest.isRepeatable && quest.repeatInterval) {
      const cooldownUntil = new Date(now.getTime() + quest.repeatInterval * 60 * 1000)
      updateData.cooldownUntil = cooldownUntil
      updateData.status = 'cooldown'
    }

    await (prisma as any).playerQuest.update({
      where: { id: playerQuest.id },
      data: updateData
    })

    // Phân tích phần thưởng
    const rewards = JSON.parse(quest.rewards)
    const player = await (prisma as any).player.findUnique({
      where: { id: playerId },
      include: {
        resources: {
          include: {
            resource: true
          }
        }
      }
    })

    // Cập nhật kinh nghiệm
    if (rewards.experience) {
      const newExp = Number(player.experience) + Number(rewards.experience)
      await (prisma as any).player.update({
        where: { id: playerId },
        data: { experience: newExp }
      })
    }

    // Cập nhật tài nguyên
    if (rewards.resources) {
      for (const [resourceName, amount] of Object.entries(rewards.resources)) {
        const resource = await (prisma as any).resource.findFirst({
          where: { name: resourceName }
        })

        if (resource) {
          const playerResource = await (prisma as any).playerResource.findFirst({
            where: {
              playerId,
              resourceId: resource.id
            }
          })

          if (playerResource) {
            await (prisma as any).playerResource.update({
              where: { id: playerResource.id },
              data: {
                amount: Number(playerResource.amount) + Number(amount)
              }
            })
          } else {
            await (prisma as any).playerResource.create({
              data: {
                playerId,
                resourceId: resource.id,
                amount: Number(amount)
              }
            })
          }
        }
      }
    }

    // Cập nhật level nếu cần
    let levelUp = false
    let newLevel = player.level
    if (rewards.experience) {
      const newExp = Number(player.experience) + Number(rewards.experience)
      // Tính level mới dựa trên công thức: level^2 * 1440
      for (let level = player.level + 1; level <= 1000; level++) {
        const requiredExp = Math.pow(level, 2) * 1440
        if (newExp >= requiredExp) {
          newLevel = level
          levelUp = true
        } else {
          break
        }
      }

      if (levelUp) {
        await (prisma as any).player.update({
          where: { id: playerId },
          data: { 
            level: newLevel,
            experience: newExp
          }
        })
      }
    }

    // Cập nhật sức mạnh chiến đấu sau khi hoàn thành nhiệm vụ
    try {
      await fetch('/api/character/sync-combat-power', {
        method: 'POST'
      })
    } catch (e) {
      console.error('Error syncing combat power:', e)
    }

    return {
      success: true,
      data: {
        quest: {
          ...quest,
          playerStatus: {
            status: 'completed',
            progress: JSON.parse(playerQuest.progress),
            startedAt: playerQuest.startedAt,
            completedAt: new Date()
          }
        },
        rewards,
        levelUp,
        newLevel: levelUp ? newLevel : player.level
      }
    }
  } catch (error: any) {
    console.error('Complete quest error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi hoàn thành nhiệm vụ'
    })
  }
})
