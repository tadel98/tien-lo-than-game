import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { monsterId, playerId } = body

    if (!monsterId || !playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Monster ID and Player ID are required'
      })
    }

    // Mock monster fight logic
    const monster = {
      id: monsterId,
      name: 'Quái Vật',
      level: 1,
      hp: 100,
      attack: 20,
      defense: 10,
      exp: 50,
      linh_thach: 10
    }

    const player = {
      id: playerId,
      level: 1,
      hp: 100,
      attack: 25,
      defense: 15
    }

    // Simple combat calculation
    const playerDamage = Math.max(1, player.attack - monster.defense)
    const monsterDamage = Math.max(1, monster.attack - player.defense)
    
    const isVictory = playerDamage >= monster.hp

    const rewards = {
      exp: isVictory ? monster.exp : 0,
      linh_thach: isVictory ? monster.linh_thach : 0,
      tien_ngoc: isVictory ? 5 : 0
    }

    return {
      success: true,
      victory: isVictory,
      rewards,
      damage: {
        player: monsterDamage,
        monster: playerDamage
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
