import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

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

    // Lấy thông tin động phủ của người chơi
    let caveDwelling = await (prisma as any).caveDwelling.findUnique({
      where: { playerId }
    })

    // Nếu chưa có động phủ, tạo mới
    if (!caveDwelling) {
      caveDwelling = await (prisma as any).caveDwelling.create({
        data: {
          playerId,
          name: 'Động phủ sơ cấp',
          level: 1,
          maxLevel: 10,
          spiritualEnergy: 0,
          maxSpiritualEnergy: 100,
          comfortLevel: 1,
          decorationLevel: 1,
          protectionLevel: 1,
          cultivationBonus: 0.1, // 10% bonus tu luyện
          resourceGeneration: 0.05, // 5% bonus tài nguyên
          isActive: true
        }
      })
    }

    // Tính toán benefits dựa trên level
    const benefits = calculateCaveBenefits(caveDwelling.level)
    
    // Tính toán upgrade cost
    const upgradeCost = calculateUpgradeCost(caveDwelling.level)

    return {
      success: true,
      data: {
        caveDwelling: {
          ...caveDwelling,
          benefits,
          upgradeCost,
          canUpgrade: canUpgradeCave(caveDwelling)
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

// Tính toán lợi ích của động phủ
function calculateCaveBenefits(level: number) {
  return {
    cultivationBonus: 0.1 + (level - 1) * 0.05, // 10% + 5% mỗi level
    resourceGeneration: 0.05 + (level - 1) * 0.02, // 5% + 2% mỗi level
    spiritualEnergyRegen: 10 + (level - 1) * 5, // 10 + 5 mỗi level
    maxSpiritualEnergy: 100 + (level - 1) * 50, // 100 + 50 mỗi level
    comfortBonus: 1 + (level - 1) * 0.5, // 1 + 0.5 mỗi level
    protectionBonus: 1 + (level - 1) * 0.3 // 1 + 0.3 mỗi level
  }
}

// Tính toán chi phí nâng cấp
function calculateUpgradeCost(level: number) {
  const baseCost = {
    linhThach: 1000,
    nguyenThach: 500,
    huyenLuc: 200
  }
  
  const multiplier = Math.pow(1.5, level - 1)
  
  return {
    linhThach: Math.floor(baseCost.linhThach * multiplier),
    nguyenThach: Math.floor(baseCost.nguyenThach * multiplier),
    huyenLuc: Math.floor(baseCost.huyenLuc * multiplier)
  }
}

// Kiểm tra có thể nâng cấp không
function canUpgradeCave(caveDwelling: any) {
  return caveDwelling.level < caveDwelling.maxLevel
}
