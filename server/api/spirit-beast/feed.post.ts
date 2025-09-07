
import { readBody, eventHandler, createError } from 'h3'
import { getPrismaClient } from '../../../lib/prisma.js'



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const body = await readBody(event)
    const { playerId, beastId, foodId, quantity = 1 } = body

    if (!playerId || !beastId || !foodId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin người chơi
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

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    // Lấy thông tin linh thú
    const beast = await (prisma as any).spiritBeast.findFirst({
      where: {
        id: beastId,
        playerId
      },
      include: {
        type: true
      }
    })

    if (!beast) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy linh thú'
      })
    }

    // Lấy thông tin thức ăn
    const food = await (prisma as any).beastFood.findUnique({
      where: { id: foodId }
    })

    if (!food) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy thức ăn'
      })
    }

    // Kiểm tra tiền tệ
    const totalCost = food.price * quantity
    const currencyResource = player.resources.find(r => r.resource.name === food.currency)
    
    if (!currencyResource || Number(currencyResource.amount) < totalCost) {
      throw createError({
        statusCode: 400,
        statusMessage: `Không đủ ${food.currency} để mua thức ăn`
      })
    }

    // Parse effects
    const effects = JSON.parse(food.effects)
    const currentStats = JSON.parse(beast.stats)

    // Tính toán hiệu ứng
    const newStats = { ...currentStats }
    const newHappiness = Math.min(100, beast.happiness + (effects.happiness || 0) * quantity)
    const newHunger = Math.min(100, beast.hunger + (effects.hunger || 0) * quantity)
    const newHealth = Math.min(100, beast.health + (effects.health || 0) * quantity)

    // Cập nhật stats nếu có
    for (const [stat, value] of Object.entries(effects)) {
      if (stat !== 'happiness' && stat !== 'hunger' && stat !== 'health' && typeof value === 'number') {
        newStats[stat] = (newStats[stat] || 0) + value * quantity
      }
    }

    // Thực hiện giao dịch
    await prisma.$transaction(async (tx) => {
      // Trừ tiền
      await tx.playerResource.update({
        where: { id: currencyResource?.id },
        data: {
          amount: Number(currencyResource.amount) - totalCost
        }
      })

      // Cập nhật linh thú
      await (tx as any).spiritBeast.update({
        where: { id: beastId },
        data: {
          stats: JSON.stringify(newStats),
          happiness: newHappiness,
          hunger: newHunger,
          health: newHealth,
          lastFedAt: new Date()
        }
      })

      // Ghi lịch sử cho ăn
      await (tx as any).beastFeedingHistory.create({
        data: {
          playerId,
          beastId,
          foodId,
          quantity,
          effects: JSON.stringify(effects)
        }
      })
    })

    return {
      success: true,
      message: 'Cho ăn thành công!',
      data: {
        beast: beast.name,
        food: food.displayName,
        quantity,
        effects: {
          happiness: newHappiness - beast.happiness,
          hunger: newHunger - beast.hunger,
          health: newHealth - beast.health,
          stats: newStats
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



