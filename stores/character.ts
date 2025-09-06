import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCharacterStore = defineStore('character', () => {
  // State
  const characterData = ref<any>(null)
  const stats = ref<any>(null)
  const equipment = ref<any[]>([])
  const skills = ref<any[]>([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const combatPower = computed(() => {
    if (!stats.value || !characterData.value) return 0
    
    // Tính toán sức mạnh chiến đấu dựa trên level và stats
    const baseStats = stats.value.base || stats.value
    const level = characterData.value.level || 1
    
    // Tính stats với bonus level (mỗi level tăng 10% stats)
    const totalStats = {
      hp: (baseStats.hp || 0) + Math.floor((baseStats.hp || 0) * 0.1 * level),
      mp: (baseStats.mp || 0) + Math.floor((baseStats.mp || 0) * 0.1 * level),
      attack: (baseStats.attack || 0) + Math.floor((baseStats.attack || 0) * 0.1 * level),
      defense: (baseStats.defense || 0) + Math.floor((baseStats.defense || 0) * 0.1 * level),
      speed: (baseStats.speed || 0) + Math.floor((baseStats.speed || 0) * 0.1 * level),
      luck: (baseStats.luck || 0) + Math.floor((baseStats.luck || 0) * 0.1 * level),
      wisdom: (baseStats.wisdom || 0) + Math.floor((baseStats.wisdom || 0) * 0.1 * level),
      strength: (baseStats.strength || 0) + Math.floor((baseStats.strength || 0) * 0.1 * level),
      agility: (baseStats.agility || 0) + Math.floor((baseStats.agility || 0) * 0.1 * level),
      vitality: (baseStats.vitality || 0) + Math.floor((baseStats.vitality || 0) * 0.1 * level),
      spirit: (baseStats.spirit || 0) + Math.floor((baseStats.spirit || 0) * 0.1 * level)
    }
    
    // Thêm bonus từ equipment
    let equipmentBonus = 0
    const equippedItems = equipment.value.filter(eq => eq.isEquipped)
    equippedItems.forEach((item) => {
      if (item.stats) {
        equipmentBonus += (item.stats.strength || 0) + (item.stats.agility || 0) + 
                         (item.stats.wisdom || 0) + (item.stats.vitality || 0) +
                         (item.stats.attack || 0) + (item.stats.defense || 0) +
                         (item.stats.hp || 0) + (item.stats.mp || 0) + (item.stats.speed || 0)
      }
    })
    
    // Công thức tính sức mạnh chiến đấu mới
    const basePower = totalStats.hp + totalStats.mp + totalStats.attack + totalStats.defense + 
                     totalStats.speed + totalStats.luck + totalStats.wisdom + 
                     totalStats.strength + totalStats.agility + totalStats.vitality + totalStats.spirit
    
    // Bonus từ level (mỗi level +1000 combat power)
    const levelBonus = level * 1000
    
    // Bonus từ equipment
    const equipmentPower = equipmentBonus * 5
    
    return Math.floor(basePower * 10 + equipmentPower + levelBonus)
  })

  const totalStats = computed(() => {
    return stats.value?.total || {}
  })

  const baseStats = computed(() => {
    return stats.value?.base || {}
  })

  const equippedItems = computed(() => {
    return equipment.value.filter(item => item.isEquipped)
  })

  // Lấy trang bị theo slot
  const getEquippedItemBySlot = (slot: string) => {
    return equipment.value.find(item => item.isEquipped && item.equipmentSlot === slot)
  }

  // Tính toán stats từ trang bị
  const equipmentStats = computed(() => {
    const stats = {
      hp: 0,
      mp: 0,
      attack: 0,
      defense: 0,
      speed: 0,
      luck: 0,
      wisdom: 0,
      strength: 0,
      agility: 0,
      vitality: 0,
      spirit: 0
    }

    equippedItems.value.forEach(item => {
      if (item.stats) {
        Object.keys(item.stats).forEach(stat => {
          if (stats.hasOwnProperty(stat)) {
            stats[stat] += item.stats[stat] || 0
          }
        })
      }
    })

    return stats
  })

  // Tính toán combat power từ trang bị
  const equipmentCombatPower = computed(() => {
    const eqStats = equipmentStats.value
    return Math.floor(
      (eqStats.attack * 2) +
      (eqStats.defense * 1.5) +
      (eqStats.speed * 1.2) +
      (eqStats.hp * 0.1) +
      (eqStats.mp * 0.05) +
      (eqStats.strength * 1.8) +
      (eqStats.agility * 1.3) +
      (eqStats.vitality * 1.5) +
      (eqStats.spirit * 1.1) +
      (eqStats.wisdom * 1.4) +
      (eqStats.luck * 0.8)
    )
  })

  const learnedSkills = computed(() => {
    return skills.value.filter(skill => skill.isLearned)
  })

  // Actions
  const fetchCharacterData = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/character/stats?playerId=${playerId}`)
      characterData.value = response.data.player
      stats.value = response.data.stats
      equipment.value = response.data.equipment
      skills.value = response.data.skills
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching character data:', err)
    } finally {
      loading.value = false
    }
  }

  const updateStats = async (playerId: string, newStats: any) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/character/stats/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId,
          stats: newStats
        })
      })

      // Cập nhật local state
      if (stats.value) {
        Object.assign(stats.value.base, newStats)
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating stats:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const equipItem = async (playerId: string, equipmentId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/character/equipment/equip', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          equipmentId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Cập nhật local state
      await fetchCharacterData(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error equipping item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const unequipItem = async (playerId: string, equipmentId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/character/equipment/unequip', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          equipmentId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Cập nhật local state
      await fetchCharacterData(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error unequipping item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const learnSkill = async (playerId: string, skillId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/character/skills/learn', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          skillId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Cập nhật local state
      await fetchCharacterData(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error learning skill:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getStatColor = (stat: string) => {
    const colors = {
      hp: '#ef4444',
      mp: '#3b82f6',
      attack: '#f59e0b',
      defense: '#10b981',
      speed: '#8b5cf6',
      luck: '#f97316',
      wisdom: '#06b6d4',
      strength: '#84cc16',
      agility: '#ec4899',
      vitality: '#14b8a6',
      spirit: '#6366f1'
    }
    return colors[stat] || '#6b7280'
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#6b7280',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    }
    return colors[rarity] || '#6b7280'
  }

  const getSkillCategoryColor = (category: string) => {
    const colors = {
      combat: '#ef4444',
      cultivation: '#8b5cf6',
      crafting: '#f59e0b',
      passive: '#10b981',
      buff: '#06b6d4',
      debuff: '#f97316'
    }
    return colors[category] || '#6b7280'
  }

  // Kiểm tra có thể trang bị item không
  const canEquipItem = (item: any, playerLevel: number) => {
    // Kiểm tra cấp độ
    if (playerLevel < item.level) {
      return { canEquip: false, reason: `Cần cấp độ ${item.level}` }
    }

    // Kiểm tra slot
    if (!item.equipmentSlot) {
      return { canEquip: false, reason: 'Item không có slot trang bị' }
    }

    // Kiểm tra đã trang bị slot này chưa
    const currentEquipped = getEquippedItemBySlot(item.equipmentSlot)
    if (currentEquipped) {
      return { canEquip: true, reason: `Sẽ thay thế ${currentEquipped.name}` }
    }

    return { canEquip: true, reason: '' }
  }

  // Lấy tên slot trang bị
  const getSlotDisplayName = (slot: string) => {
    const slots = {
      weapon: 'Vũ Khí',
      armor: 'Áo Giáp',
      helmet: 'Mũ',
      boots: 'Giày',
      gloves: 'Găng Tay',
      ring: 'Nhẫn',
      necklace: 'Dây Chuyền',
      belt: 'Thắt Lưng',
      shield: 'Khiên',
      accessory: 'Phụ Kiện'
    }
    return slots[slot] || slot
  }

  // Tính toán tổng stats (base + equipment)
  const totalStatsWithEquipment = computed(() => {
    const base = baseStats.value
    const equipment = equipmentStats.value
    
    return {
      hp: (base.hp || 0) + equipment.hp,
      mp: (base.mp || 0) + equipment.mp,
      attack: (base.attack || 0) + equipment.attack,
      defense: (base.defense || 0) + equipment.defense,
      speed: (base.speed || 0) + equipment.speed,
      luck: (base.luck || 0) + equipment.luck,
      wisdom: (base.wisdom || 0) + equipment.wisdom,
      strength: (base.strength || 0) + equipment.strength,
      agility: (base.agility || 0) + equipment.agility,
      vitality: (base.vitality || 0) + equipment.vitality,
      spirit: (base.spirit || 0) + equipment.spirit
    }
  })

  // Reset store
  const reset = () => {
    characterData.value = null
    stats.value = null
    equipment.value = []
    skills.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    characterData,
    stats,
    equipment,
    skills,
    loading,
    error,

    // Getters
    combatPower,
    totalStats,
    baseStats,
    equippedItems,
    learnedSkills,
    getEquippedItemBySlot,
    equipmentStats,
    equipmentCombatPower,
    totalStatsWithEquipment,

    // Actions
    fetchCharacterData,
    updateStats,
    equipItem,
    unequipItem,
    learnSkill,
    canEquipItem,
    getSlotDisplayName,
    getStatColor,
    getRarityColor,
    getSkillCategoryColor,
    reset
  }
})
