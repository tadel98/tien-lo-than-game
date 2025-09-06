import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBossStore = defineStore('boss', () => {
  // State
  const bosses = ref<any[]>([])
  const currentBoss = ref<any>(null)
  const combatLog = ref<string[]>([])
  const isInCombat = ref(false)
  const combatResult = ref<any>(null)
  const loading = ref(false)
  const error = ref(null)

  // Boss data
  const bossTemplates = [
    {
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
        exp: 5000, // Tăng từ 1000 lên 5000
        tien_ngoc: 500,
        linh_thach: 200,
        items: [
          { id: 'demon_sword', name: 'Kiếm Ma Vương', rarity: 'epic', dropRate: 0.3 },
          { id: 'dark_armor', name: 'Áo Giáp Hắc Ám', rarity: 'rare', dropRate: 0.5 }
        ]
      },
      description: 'Ma vương hùng mạnh từ địa ngục, sở hữu sức mạnh khủng khiếp.',
      icon: '👹',
      difficulty: 'hard'
    },
    {
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
        exp: 15000, // Tăng từ 5000 lên 15000
        tien_ngoc: 2000,
        linh_thach: 1000,
        items: [
          { id: 'dragon_scale', name: 'Vảy Rồng', rarity: 'legendary', dropRate: 0.1 },
          { id: 'dragon_heart', name: 'Trái Tim Rồng', rarity: 'epic', dropRate: 0.3 },
          { id: 'ancient_sword', name: 'Kiếm Cổ Đại', rarity: 'legendary', dropRate: 0.2 }
        ]
      },
      description: 'Long vương cổ đại với sức mạnh vô song, chỉ có những cao thủ mới dám thách thức.',
      icon: '🐉',
      difficulty: 'extreme'
    },
    {
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
        exp: 50000, // Tăng từ 15000 lên 50000
        tien_ngoc: 8000,
        linh_thach: 5000,
        items: [
          { id: 'phoenix_feather', name: 'Lông Phượng Hoàng', rarity: 'legendary', dropRate: 0.05 },
          { id: 'emperor_crown', name: 'Vương Miện Đế', rarity: 'legendary', dropRate: 0.1 },
          { id: 'divine_armor', name: 'Áo Giáp Thần Thánh', rarity: 'legendary', dropRate: 0.15 }
        ]
      },
      description: 'Phượng hoàng đế với sức mạnh thần thánh, chỉ có những bậc thầy mới có thể đánh bại.',
      icon: '🔥',
      difficulty: 'godlike'
    },
    {
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
        exp: 1500, // Tăng từ 300 lên 1500
        tien_ngoc: 150,
        linh_thach: 50,
        items: [
          { id: 'shadow_dagger', name: 'Dao Găm Bóng Tối', rarity: 'uncommon', dropRate: 0.4 },
          { id: 'stealth_cloak', name: 'Áo Choàng Tàng Hình', rarity: 'rare', dropRate: 0.3 }
        ]
      },
      description: 'Sát thủ bóng tối với tốc độ cao và sát thương lớn.',
      icon: '🗡️',
      difficulty: 'medium'
    }
  ]

  // Getters
  const availableBosses = computed(() => {
    return bosses.value.filter(boss => !boss.isDefeated)
  })

  const defeatedBosses = computed(() => {
    return bosses.value.filter(boss => boss.isDefeated)
  })

  const getBossByDifficulty = (difficulty: string) => {
    return bosses.value.filter(boss => boss.difficulty === difficulty)
  }

  const canFightBoss = (boss: any, playerLevel: number, playerCombatPower: number) => {
    return playerLevel >= boss.level && playerCombatPower >= boss.combatPower * 0.8
  }

  // Actions
  const initializeBosses = () => {
    bosses.value = bossTemplates.map(boss => ({
      ...boss,
      isDefeated: false,
      lastFightTime: null,
      fightCount: 0
    }))
  }

  const startCombat = (bossId: string) => {
    const boss = bosses.value.find(b => b.id === bossId)
    if (!boss) return false

    currentBoss.value = { ...boss }
    isInCombat.value = true
    combatLog.value = []
    combatResult.value = null

    return true
  }

  const endCombat = () => {
    isInCombat.value = false
    currentBoss.value = null
    combatLog.value = []
  }

  const addCombatLog = (message: string) => {
    combatLog.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
  }

  const calculateCombatResult = (playerCombatPower: number, playerLevel: number) => {
    if (!currentBoss.value) return null

    const boss = currentBoss.value
    const bossCombatPower = boss.combatPower

    // Tính toán tỷ lệ thắng dựa trên combat power
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

    if (isWin) {
      // Tính toán thưởng
      const rewards = calculateRewards(boss, powerRatio)
      return {
        isWin: true,
        rewards,
        damageDealt: Math.floor(boss.hp * (0.5 + Math.random() * 0.5)),
        damageTaken: Math.floor(playerCombatPower * 0.1 * (1 - powerRatio * 0.5))
      }
    } else {
      return {
        isWin: false,
        rewards: null,
        damageDealt: Math.floor(boss.hp * (0.1 + Math.random() * 0.3)),
        damageTaken: Math.floor(playerCombatPower * 0.3 * (1 + powerRatio))
      }
    }
  }

  const calculateRewards = (boss: any, powerRatio: number) => {
    const baseRewards = { ...boss.rewards }
    
    // Bonus thưởng dựa trên tỷ lệ sức mạnh
    const bonusMultiplier = Math.min(2.0, 1 + (powerRatio - 1) * 0.5)
    
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
    const droppedItems = []
    
    // Xử lý drop items
    rewards.items.forEach(item => {
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

  const markBossDefeated = (bossId: string) => {
    const boss = bosses.value.find(b => b.id === bossId)
    if (boss) {
      boss.isDefeated = true
      boss.lastFightTime = new Date()
      boss.fightCount++
    }
  }

  const resetBoss = (bossId: string) => {
    const boss = bosses.value.find(b => b.id === bossId)
    if (boss) {
      boss.isDefeated = false
      boss.lastFightTime = null
      boss.fightCount = 0
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444',
      extreme: '#8b5cf6',
      godlike: '#f97316'
    }
    return colors[difficulty] || '#6b7280'
  }

  const getDifficultyName = (difficulty: string) => {
    const names = {
      easy: 'Dễ',
      medium: 'Trung Bình',
      hard: 'Khó',
      extreme: 'Cực Khó',
      godlike: 'Thần Thánh'
    }
    return names[difficulty] || difficulty
  }

  // Reset store
  const reset = () => {
    bosses.value = []
    currentBoss.value = null
    combatLog.value = []
    isInCombat.value = false
    combatResult.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    bosses,
    currentBoss,
    combatLog,
    isInCombat,
    combatResult,
    loading,
    error,

    // Getters
    availableBosses,
    defeatedBosses,
    getBossByDifficulty,
    canFightBoss,

    // Actions
    initializeBosses,
    startCombat,
    endCombat,
    addCombatLog,
    calculateCombatResult,
    processRewards,
    markBossDefeated,
    resetBoss,
    getDifficultyColor,
    getDifficultyName,
    reset
  }
})
