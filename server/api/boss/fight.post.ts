export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { playerId, bossId, playerCombatPower, playerLevel } = body

    if (!playerId || !bossId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin playerId hoặc bossId'
      })
    }

    // Mock boss data - trong thực tế sẽ lấy từ database
    const bossData = {
      'demon_lord': {
        id: 'demon_lord',
        name: 'Ma Vương Hắc Ám',
        level: 10,
        hp: 5000,
        maxHp: 5000,
        attack: 300,
        defense: 200,
        speed: 150,
        combatPower: 15000,
        rewards: {
          exp: 1000,
          tien_ngoc: 500,
          linh_thach: 200,
          items: [
            { id: 'demon_sword', name: 'Kiếm Ma Vương', rarity: 'epic', dropRate: 0.3 },
            { id: 'dark_armor', name: 'Áo Giáp Hắc Ám', rarity: 'rare', dropRate: 0.5 }
          ]
        }
      },
      'dragon_king': {
        id: 'dragon_king',
        name: 'Long Vương Cổ Đại',
        level: 20,
        hp: 15000,
        maxHp: 15000,
        attack: 800,
        defense: 600,
        speed: 300,
        combatPower: 50000,
        rewards: {
          exp: 5000,
          tien_ngoc: 2000,
          linh_thach: 1000,
          items: [
            { id: 'dragon_scale', name: 'Vảy Rồng', rarity: 'legendary', dropRate: 0.1 },
            { id: 'dragon_heart', name: 'Trái Tim Rồng', rarity: 'epic', dropRate: 0.3 },
            { id: 'ancient_sword', name: 'Kiếm Cổ Đại', rarity: 'legendary', dropRate: 0.2 }
          ]
        }
      },
      'phoenix_emperor': {
        id: 'phoenix_emperor',
        name: 'Phượng Hoàng Đế',
        level: 30,
        hp: 30000,
        maxHp: 30000,
        attack: 1500,
        defense: 1200,
        speed: 500,
        combatPower: 100000,
        rewards: {
          exp: 15000,
          tien_ngoc: 8000,
          linh_thach: 5000,
          items: [
            { id: 'phoenix_feather', name: 'Lông Phượng Hoàng', rarity: 'legendary', dropRate: 0.05 },
            { id: 'emperor_crown', name: 'Vương Miện Đế', rarity: 'legendary', dropRate: 0.1 },
            { id: 'divine_armor', name: 'Áo Giáp Thần Thánh', rarity: 'legendary', dropRate: 0.15 }
          ]
        }
      },
      'shadow_assassin': {
        id: 'shadow_assassin',
        name: 'Sát Thủ Bóng Tối',
        level: 5,
        hp: 2000,
        maxHp: 2000,
        attack: 150,
        defense: 80,
        speed: 200,
        combatPower: 5000,
        rewards: {
          exp: 300,
          tien_ngoc: 150,
          linh_thach: 50,
          items: [
            { id: 'shadow_dagger', name: 'Dao Găm Bóng Tối', rarity: 'uncommon', dropRate: 0.4 },
            { id: 'stealth_cloak', name: 'Áo Choàng Tàng Hình', rarity: 'rare', dropRate: 0.3 }
          ]
        }
      }
    }

    const boss = bossData[bossId]
    if (!boss) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy boss'
      })
    }

    // Tính toán kết quả chiến đấu
    const bossCombatPower = boss.combatPower
    const powerRatio = playerCombatPower / bossCombatPower
    let winChance = 0.5 // 50% cơ bản

    if (powerRatio >= 1.2) {
      winChance = 0.9 // 90% nếu mạnh hơn 20%
    } else if (powerRatio >= 1.0) {
      winChance = 0.7 // 70% nếu mạnh hơn
    } else if (powerRatio >= 0.8) {
      winChance = 0.4 // 40% nếu yếu hơn 20%
    } else {
      winChance = 0.1 // 10% nếu yếu hơn nhiều
    }

    // Bonus từ level
    const levelBonus = Math.min(0.2, (playerLevel - boss.level) * 0.05)
    winChance = Math.min(0.95, winChance + levelBonus)

    const isWin = Math.random() < winChance

    let result = {
      isWin,
      damageDealt: 0,
      damageTaken: 0,
      rewards: null
    }

    if (isWin) {
      // Tính toán thưởng
      const bonusMultiplier = Math.min(2.0, 1 + (powerRatio - 1) * 0.5)
      
      const baseRewards = boss.rewards
      const rewards = {
        exp: Math.floor(baseRewards.exp * bonusMultiplier),
        tien_ngoc: Math.floor(baseRewards.tien_ngoc * bonusMultiplier),
        linh_thach: Math.floor(baseRewards.linh_thach * bonusMultiplier),
        items: []
      }

      // Xử lý drop items
      baseRewards.items.forEach(item => {
        if (Math.random() < item.dropRate * bonusMultiplier) {
          rewards.items.push({
            id: item.id,
            name: item.name,
            rarity: item.rarity,
            quantity: 1
          })
        }
      })

      result.rewards = rewards
      result.damageDealt = Math.floor(boss.hp * (0.5 + Math.random() * 0.5))
      result.damageTaken = Math.floor(playerCombatPower * 0.1 * (1 - powerRatio * 0.5))
    } else {
      result.damageDealt = Math.floor(boss.hp * (0.1 + Math.random() * 0.3))
      result.damageTaken = Math.floor(playerCombatPower * 0.3 * (1 + powerRatio))
    }

    return {
      success: true,
      data: result
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi chiến đấu với boss'
    })
  }
})
