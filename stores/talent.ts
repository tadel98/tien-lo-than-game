import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTalentStore = defineStore('talent', () => {
  // State
  const playerTalents = ref<any[]>([])
  const availableTalents = ref<any[]>([])
  const playerBuffs = ref<any[]>([])
  const totalEffects = ref<any>({})
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const unlockedTalents = computed(() => {
    return playerTalents.value.filter(talent => talent.isUnlocked)
  })

  const activeTalents = computed(() => {
    return playerTalents.value.filter(talent => talent.isUnlocked && talent.isActive)
  })

  const activeBuffs = computed(() => {
    return playerBuffs.value.filter(buff => {
      if (!buff.expiresAt) return true
      return new Date(buff.expiresAt) > new Date()
    })
  })

  const talentTypes = computed(() => {
    const types = new Map()
    availableTalents.value.forEach(talent => {
      if (talent?.talent?.type?.id) {
        if (!types.has(talent.talent.type.id)) {
          types.set(talent.talent.type.id, talent.talent.type)
        }
      }
    })
    return Array.from(types.values())
  })

  // Actions
  const fetchTalentStatus = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/talent/status?playerId=${playerId}`)
      playerTalents.value = response.data.playerTalents
      availableTalents.value = response.data.availableTalents
      playerBuffs.value = response.data.playerBuffs
      totalEffects.value = response.data.totalEffects
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching talent status:', err)
    } finally {
      loading.value = false
    }
  }

  const unlockTalent = async (playerId: string, talentId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/talent/unlock', {
        method: 'POST',
        body: {
          playerId,
          talentId
        }
      })

      // Cập nhật local state
      await fetchTalentStatus(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error unlocking talent:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const upgradeTalent = async (playerId: string, talentId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/talent/upgrade', {
        method: 'POST',
        body: {
          playerId,
          talentId
        }
      })

      // Cập nhật local state
      await fetchTalentStatus(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error upgrading talent:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleTalent = async (playerId: string, talentId: string, isActive: boolean) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/talent/toggle', {
        method: 'POST',
        body: {
          playerId,
          talentId,
          isActive
        }
      })

      // Cập nhật local state
      await fetchTalentStatus(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error toggling talent:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#6b7280',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b',
      mythic: '#ef4444'
    }
    return colors[rarity] || '#6b7280'
  }

  const getTalentTypeColor = (typeName: string) => {
    const colors = {
      'combat': '#ef4444',
      'cultivation': '#8b5cf6',
      'defense': '#10b981',
      'utility': '#06b6d4',
      'special': '#f59e0b'
    }
    return colors[typeName] || '#6b7280'
  }

  const getBuffTypeColor = (type: string) => {
    const colors = {
      'buff': '#10b981',
      'debuff': '#ef4444',
      'neutral': '#6b7280'
    }
    return colors[type] || '#6b7280'
  }

  const canUnlockTalent = (talent: any, playerLevel: number, playerRealm: string) => {
    if (!talent.requirements) return true

    const requirements = talent.requirements
    if (requirements.level && playerLevel < requirements.level) return false
    if (requirements.realm && playerRealm !== requirements.realm) return false

    return true
  }

  const canUpgradeTalent = (playerTalent: any) => {
    return playerTalent.isUnlocked && playerTalent.level < playerTalent.talent.maxLevel
  }

  const getTalentUpgradeCost = (playerTalent: any) => {
    return playerTalent.talent.cost * playerTalent.level
  }

  // Reset store
  const reset = () => {
    playerTalents.value = []
    availableTalents.value = []
    playerBuffs.value = []
    totalEffects.value = {}
    loading.value = false
    error.value = null
  }

  return {
    // State
    playerTalents,
    availableTalents,
    playerBuffs,
    totalEffects,
    loading,
    error,

    // Getters
    unlockedTalents,
    activeTalents,
    activeBuffs,
    talentTypes,

    // Actions
    fetchTalentStatus,
    unlockTalent,
    upgradeTalent,
    toggleTalent,
    getRarityColor,
    getTalentTypeColor,
    getBuffTypeColor,
    canUnlockTalent,
    canUpgradeTalent,
    getTalentUpgradeCost,
    reset
  }
})
