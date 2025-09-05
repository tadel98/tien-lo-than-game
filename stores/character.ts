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
    return stats.value?.combatPower || 0
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
        body: {
          playerId,
          stats: newStats
        }
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
        body: {
          playerId,
          equipmentId
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
        body: {
          playerId,
          equipmentId
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
        body: {
          playerId,
          skillId
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

    // Actions
    fetchCharacterData,
    updateStats,
    equipItem,
    unequipItem,
    learnSkill,
    getStatColor,
    getRarityColor,
    getSkillCategoryColor,
    reset
  }
})
