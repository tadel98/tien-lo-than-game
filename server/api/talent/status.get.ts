
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'
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

    // Lấy thông tin thiên phú của người chơi
    const playerTalents = await (prisma as any).playerTalent.findMany({
      where: { playerId },
      include: {
        talent: {
          include: {
            type: true
          }
        }
      }
    })

    // Lấy tất cả thiên phú có sẵn
    const availableTalents = await (prisma as any).talent.findMany({
      where: { isActive: true },
      include: {
        type: true
      }
    })

    // Lấy buffs hiện tại
    const playerBuffs = await (prisma as any).playerBuff.findMany({
      where: { 
        playerId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        buff: true
      }
    })

    // Tính toán tổng hiệu ứng từ thiên phú
    let totalEffects = {
      attack: 0,
      defense: 0,
      speed: 0,
      hp: 0,
      mp: 0,
      luck: 0,
      wisdom: 0,
      strength: 0,
      agility: 0,
      vitality: 0,
      spirit: 0,
      expMultiplier: 1,
      dropRate: 1,
      critChance: 0,
      critDamage: 0
    }

    // Cộng hiệu ứng từ thiên phú đã mở khóa
    for (const playerTalent of playerTalents) {
      if (playerTalent.isUnlocked && playerTalent.isActive && playerTalent.talent.effects) {
        try {
          const effects = JSON.parse(playerTalent.talent.effects) as any
          const level = playerTalent.level
          
          for (const [effect, value] of Object.entries(effects)) {
            if (totalEffects[effect] !== undefined) {
              if (typeof value === 'number') {
                totalEffects[effect] += value * level
              } else if (typeof value === 'object' && (value as any)?.scaling) {
                // Hiệu ứng có scaling theo level
                totalEffects[effect] += ((value as any)?.base || 0) + (((value as any)?.scaling || 0) * level)
              }
            }
          }
        } catch (e) {
          console.error('Error parsing talent effects:', e)
        }
      }
    }

    // Cộng hiệu ứng từ buffs
    for (const playerBuff of playerBuffs) {
      if (playerBuff.buff.effects) {
        try {
          const effects = JSON.parse(playerBuff.buff.effects)
          const stacks = playerBuff.stacks
          
          for (const [effect, value] of Object.entries(effects)) {
            if (totalEffects[effect] !== undefined) {
              if (playerBuff.buff.stackable) {
                totalEffects[effect] += (value as number) * stacks
              } else {
                totalEffects[effect] += (value as number)
              }
            }
          }
        } catch (e) {
          console.error('Error parsing buff effects:', e)
        }
      }
    }

    return {
      success: true,
      data: {
        playerTalents: playerTalents.map(pt => ({
          ...pt,
          talent: {
            ...pt.talent,
            effects: pt.talent.effects ? JSON.parse(pt.talent.effects) as any : {} as any,
            requirements: pt.talent.requirements ? JSON.parse(pt.talent.requirements) : {}
          }
        })),
        availableTalents: availableTalents.map(t => ({
          ...t,
          effects: t.effects ? JSON.parse(t.effects) : {},
          requirements: t.requirements ? JSON.parse(t.requirements) : {}
        })),
        playerBuffs: playerBuffs.map(pb => ({
          ...pb,
          buff: {
            ...pb.buff,
            effects: pb.buff.effects ? JSON.parse(pb.buff.effects) : {}
          }
        })),
        totalEffects
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})


