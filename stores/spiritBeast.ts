import { defineStore } from 'pinia'
import { ref } from 'vue'

// $fetch is already available in Nuxt 3, no need to declare

export const useSpiritBeastStore = defineStore('spiritBeast', () => {
  // State
  const spiritBeasts = ref<any[]>([])
  const beastTypes = ref<any[]>([])
  const foods = ref<any[]>([])
  const huntingGrounds = ref<any[]>([])
  const recentHunting = ref<any[]>([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getBeastsByType = (typeId: string) => {
    return spiritBeasts.value.filter(beast => beast.typeId === typeId)
  }

  const getActiveBeasts = () => {
    return spiritBeasts.value.filter(beast => beast.isActive)
  }

  const getFightingBeasts = () => {
    return spiritBeasts.value.filter(beast => beast.isFighting)
  }

  const getBeastTypeById = (id: string) => {
    return beastTypes.value.find(type => type.id === id)
  }

  const getFoodById = (id: string) => {
    return foods.value.find(food => food.id === id)
  }

  const getHuntingGroundById = (id: string) => {
    return huntingGrounds.value.find(ground => ground.id === id)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      common: '#6b7280',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b',
      mythical: '#ef4444'
    }
    return colors[category] || '#6b7280'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#10b981',
      normal: '#f59e0b',
      hard: '#f97316',
      extreme: '#ef4444'
    }
    return colors[difficulty] || '#6b7280'
  }

  const getBeastStatusColor = (beast: any) => {
    if (beast.health < 30) return '#ef4444' // red
    if (beast.happiness < 30) return '#f97316' // orange
    if (beast.hunger < 30) return '#f59e0b' // yellow
    return '#10b981' // green
  }

  const getBeastStatusText = (beast: any) => {
    if (beast.health < 30) return 'Bị thương'
    if (beast.happiness < 30) return 'Buồn bã'
    if (beast.hunger < 30) return 'Đói'
    return 'Khỏe mạnh'
  }

  // Actions
  const fetchSpiritBeastStatus = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/spirit-beast/status?playerId=${playerId}`)
      
      spiritBeasts.value = response.data.spiritBeasts
      beastTypes.value = response.data.beastTypes
      foods.value = response.data.foods
      huntingGrounds.value = response.data.huntingGrounds
      recentHunting.value = response.data.recentHunting
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching spirit beast status:', err)
    } finally {
      loading.value = false
    }
  }

  const huntBeast = async (playerId: string, groundId: string) => {
    try {
      loading.value = true
      error.value = null

      const data = await $fetch('/api/spirit-beast/hunt', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          groundId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Refresh spirit beast status after hunting
      await fetchSpiritBeastStatus(playerId)

      return data
    } catch (err: any) {
      error.value = err.message
      console.error('Error hunting beast:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const feedBeast = async (playerId: string, beastId: string, foodId: string, quantity: number = 1) => {
    try {
      loading.value = true
      error.value = null

      const data = await $fetch('/api/spirit-beast/feed', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          beastId,
          foodId,
          quantity
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Refresh spirit beast status after feeding
      await fetchSpiritBeastStatus(playerId)

      return data
    } catch (err: any) {
      error.value = err.message
      console.error('Error feeding beast:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const canHuntAtGround = (ground: any, playerLevel: number) => {
    return playerLevel >= ground.level
  }

  const getBeastStats = (beast: any) => {
    try {
      return JSON.parse(beast.stats)
    } catch (e) {
      return {}
    }
  }

  const getBeastSkills = (beast: any) => {
    try {
      return beast.skills ? JSON.parse(beast.skills) : []
    } catch (e) {
      return []
    }
  }

  const getFoodEffects = (food: any) => {
    try {
      return JSON.parse(food.effects)
    } catch (e) {
      return {}
    }
  }

  const getGroundBeastTypes = (ground: any) => {
    try {
      return JSON.parse(ground.beastTypes)
    } catch (e) {
      return {}
    }
  }

  const getGroundDropRates = (ground: any) => {
    try {
      return JSON.parse(ground.dropRates)
    } catch (e) {
      return {}
    }
  }

  // Reset store
  const reset = () => {
    spiritBeasts.value = []
    beastTypes.value = []
    foods.value = []
    huntingGrounds.value = []
    recentHunting.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    spiritBeasts,
    beastTypes,
    foods,
    huntingGrounds,
    recentHunting,
    loading,
    error,

    // Getters
    getBeastsByType,
    getActiveBeasts,
    getFightingBeasts,
    getBeastTypeById,
    getFoodById,
    getHuntingGroundById,
    getCategoryColor,
    getDifficultyColor,
    getBeastStatusColor,
    getBeastStatusText,

    // Actions
    fetchSpiritBeastStatus,
    huntBeast,
    feedBeast,
    canHuntAtGround,
    getBeastStats,
    getBeastSkills,
    getFoodEffects,
    getGroundBeastTypes,
    getGroundDropRates,
    reset
  }
})
