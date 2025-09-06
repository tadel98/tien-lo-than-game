import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMonsterStore = defineStore('monster', () => {
  // State
  const monsters = ref<any[]>([])
  const currentMonster = ref<any>(null)
  const isInCombat = ref(false)
  const combatLog = ref<string[]>([])
  const combatResult = ref<any>(null)
  const loading = ref(false)
  const error = ref(null)

  // Monster data
  const monsterTemplates = [
    {
      id: 'goblin',
      name: 'Yêu Tinh Xanh',
      level: 1,
      hp: 100,
      maxHp: 100,
      attack: 20,
      defense: 10,
      speed: 30,
      combatPower: 500,
      rewards: {
        exp: 50, // EXP cao hơn
        tien_ngoc: 10,
        linh_thach: 5,
        items: [
          { id: 'goblin_ear', name: 'Tai Yêu Tinh', rarity: 'common', dropRate: 0.8 },
          { id: 'rusty_knife', name: 'Dao Gỉ', rarity: 'common', dropRate: 0.3 }
        ]
      },
      description: 'Yêu tinh xanh yếu ớt, phù hợp cho người mới bắt đầu.',
      icon: '👹',
      difficulty: 'easy'
    },
    {
      id: 'orc',
      name: 'Orc Chiến Binh',
      level: 3,
      hp: 300,
      maxHp: 300,
      attack: 60,
      defense: 30,
      speed: 25,
      combatPower: 1500,
      rewards: {
        exp: 150, // EXP cao hơn
        tien_ngoc: 30,
        linh_thach: 15,
        items: [
          { id: 'orc_axe', name: 'Rìu Orc', rarity: 'uncommon', dropRate: 0.4 },
          { id: 'leather_armor', name: 'Áo Da', rarity: 'common', dropRate: 0.6 }
        ]
      },
      description: 'Orc chiến binh mạnh mẽ, cần kỹ năng để đánh bại.',
      icon: '👺',
      difficulty: 'medium'
    },
    {
      id: 'skeleton',
      name: 'Bộ Xương Ma',
      level: 5,
      hp: 500,
      maxHp: 500,
      attack: 80,
      defense: 40,
      speed: 35,
      combatPower: 2500,
      rewards: {
        exp: 300, // EXP cao hơn
        tien_ngoc: 60,
        linh_thach: 30,
        items: [
          { id: 'bone_sword', name: 'Kiếm Xương', rarity: 'uncommon', dropRate: 0.5 },
          { id: 'skull_helmet', name: 'Mũ Sọ', rarity: 'rare', dropRate: 0.2 }
        ]
      },
      description: 'Bộ xương ma bất tử, khó đánh bại nhưng thưởng hậu hĩnh.',
      icon: '💀',
      difficulty: 'medium'
    },
    {
      id: 'troll',
      name: 'Quỷ Troll',
      level: 8,
      hp: 800,
      maxHp: 800,
      attack: 120,
      defense: 60,
      speed: 20,
      combatPower: 4000,
      rewards: {
        exp: 600, // EXP cao hơn
        tien_ngoc: 120,
        linh_thach: 60,
        items: [
          { id: 'troll_club', name: 'Gậy Troll', rarity: 'rare', dropRate: 0.3 },
          { id: 'troll_hide', name: 'Da Troll', rarity: 'uncommon', dropRate: 0.7 }
        ]
      },
      description: 'Quỷ troll khổng lồ với sức mạnh khủng khiếp.',
      icon: '🧌',
      difficulty: 'hard'
    },
    {
      id: 'demon',
      name: 'Ác Ma',
      level: 12,
      hp: 1200,
      maxHp: 1200,
      attack: 180,
      defense: 90,
      speed: 50,
      combatPower: 6000,
      rewards: {
        exp: 1000, // EXP cao hơn
        tien_ngoc: 200,
        linh_thach: 100,
        items: [
          { id: 'demon_horn', name: 'Sừng Ác Ma', rarity: 'rare', dropRate: 0.4 },
          { id: 'dark_robes', name: 'Áo Choàng Đen', rarity: 'epic', dropRate: 0.1 }
        ]
      },
      description: 'Ác ma từ địa ngục, chỉ có cao thủ mới dám thách thức.',
      icon: '😈',
      difficulty: 'hard'
    },
    {
      id: 'dragon_whelp',
      name: 'Rồng Con',
      level: 15,
      hp: 2000,
      maxHp: 2000,
      attack: 250,
      defense: 120,
      speed: 60,
      combatPower: 10000,
      rewards: {
        exp: 2000, // EXP cao hơn
        tien_ngoc: 400,
        linh_thach: 200,
        items: [
          { id: 'dragon_scale', name: 'Vảy Rồng', rarity: 'epic', dropRate: 0.3 },
          { id: 'dragon_fang', name: 'Răng Rồng', rarity: 'rare', dropRate: 0.6 }
        ]
      },
      description: 'Rồng con mạnh mẽ, thưởng cực kỳ hấp dẫn.',
      icon: '🐲',
      difficulty: 'extreme'
    }
  ]

  // Getters
  const availableMonsters = computed(() => {
    return monsters.value.filter(monster => !monster.isDefeated)
  })

  const getMonsterByDifficulty = (difficulty: string) => {
    return monsters.value.filter(monster => monster.difficulty === difficulty)
  }

  const canFightMonster = (monster: any, playerLevel: number, playerCombatPower: number) => {
    return playerLevel >= monster.level && playerCombatPower >= monster.combatPower * 0.7
  }

  // Actions
  const initializeMonsters = () => {
    monsters.value = monsterTemplates.map(monster => ({
      ...monster,
      isDefeated: false,
      lastFightTime: null,
      fightCount: 0
    }))
  }

  const startCombat = (monsterId: string) => {
    const monster = monsters.value.find(m => m.id === monsterId)
    if (!monster) return false

    currentMonster.value = { ...monster }
    isInCombat.value = true
    combatLog.value = []
    combatResult.value = null

    return true
  }

  const endCombat = () => {
    isInCombat.value = false
    currentMonster.value = null
    combatLog.value = []
  }

  const addCombatLog = (message: string) => {
    combatLog.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
  }

  const calculateCombatResult = (playerCombatPower: number, playerLevel: number) => {
    if (!currentMonster.value) return null

    const monster = currentMonster.value
    const monsterCombatPower = monster.combatPower

    // Tính toán tỷ lệ thắng dựa trên combat power
    const powerRatio = playerCombatPower / monsterCombatPower
    let winChance = 0.6 // 60% cơ bản cho monster (dễ hơn boss)

    if (powerRatio >= 1.5) {
      winChance = 0.95 // 95% nếu mạnh hơn 50%
    } else if (powerRatio >= 1.2) {
      winChance = 0.85 // 85% nếu mạnh hơn 20%
    } else if (powerRatio >= 1.0) {
      winChance = 0.75 // 75% nếu mạnh hơn
    } else if (powerRatio >= 0.8) {
      winChance = 0.5 // 50% nếu yếu hơn 20%
    } else {
      winChance = 0.2 // 20% nếu yếu hơn nhiều
    }

    // Bonus từ level
    const levelBonus = Math.min(0.3, (playerLevel - monster.level) * 0.05)
    winChance = Math.min(0.98, winChance + levelBonus)

    const isWin = Math.random() < winChance

    if (isWin) {
      // Tính toán thưởng
      const rewards = calculateRewards(monster, powerRatio)
      return {
        isWin: true,
        rewards,
        damageDealt: Math.floor(monster.hp * (0.6 + Math.random() * 0.4)),
        damageTaken: Math.floor(playerCombatPower * 0.05 * (1 - powerRatio * 0.3))
      }
    } else {
      return {
        isWin: false,
        rewards: null,
        damageDealt: Math.floor(monster.hp * (0.2 + Math.random() * 0.3)),
        damageTaken: Math.floor(playerCombatPower * 0.2 * (1 + powerRatio))
      }
    }
  }

  const calculateRewards = (monster: any, powerRatio: number) => {
    const baseRewards = { ...monster.rewards }
    
    // Bonus thưởng dựa trên tỷ lệ sức mạnh (ít hơn boss)
    const bonusMultiplier = Math.min(1.5, 1 + (powerRatio - 1) * 0.3)
    
    return {
      exp: Math.floor(baseRewards.exp * bonusMultiplier),
      tien_ngoc: Math.floor(baseRewards.tien_ngoc * bonusMultiplier),
      linh_thach: Math.floor(baseRewards.linh_thach * bonusMultiplier),
      items: baseRewards.items.map(item => ({
        ...item,
        dropRate: Math.min(1.0, item.dropRate * bonusMultiplier)
      }))
    }
  }

  const processRewards = (rewards: any) => {
    const droppedItems: Array<{
      id: string
      name: string
      rarity: string
      quantity: number
    }> = []
    
    // Xử lý drop items
    rewards.items.forEach((item: any) => {
      if (Math.random() < item.dropRate) {
        droppedItems.push({
          id: item.id,
          name: item.name,
          rarity: item.rarity,
          quantity: 1
        })
      }
    })

    return {
      exp: rewards.exp,
      tien_ngoc: rewards.tien_ngoc,
      linh_thach: rewards.linh_thach,
      items: droppedItems
    }
  }

  const markMonsterDefeated = (monsterId: string) => {
    const monster = monsters.value.find(m => m.id === monsterId)
    if (monster) {
      monster.isDefeated = true
      monster.lastFightTime = new Date()
      monster.fightCount++
    }
  }

  const resetMonster = (monsterId: string) => {
    const monster = monsters.value.find(m => m.id === monsterId)
    if (monster) {
      monster.isDefeated = false
      monster.lastFightTime = null
      monster.fightCount = 0
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444',
      extreme: '#8b5cf6'
    }
    return colors[difficulty] || '#6b7280'
  }

  const getDifficultyName = (difficulty: string) => {
    const names = {
      easy: 'Dễ',
      medium: 'Trung Bình',
      hard: 'Khó',
      extreme: 'Cực Khó'
    }
    return names[difficulty] || difficulty
  }

  // Reset store
  const reset = () => {
    monsters.value = []
    currentMonster.value = null
    combatLog.value = []
    isInCombat.value = false
    combatResult.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    monsters,
    currentMonster,
    combatLog,
    isInCombat,
    combatResult,
    loading,
    error,

    // Getters
    availableMonsters,
    getMonsterByDifficulty,
    canFightMonster,

    // Actions
    initializeMonsters,
    startCombat,
    endCombat,
    addCombatLog,
    calculateCombatResult,
    processRewards,
    markMonsterDefeated,
    resetMonster,
    getDifficultyColor,
    getDifficultyName,
    reset
  }
})
