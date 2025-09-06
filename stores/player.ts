import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // State
  const player = ref<any>(null)
  const resources = ref<any[]>([])
  const companions = ref<any[]>([])
  const achievements = ref<any[]>([])
  const quests = ref<any[]>([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getResourceByName = (name: string) => {
    return resources.value?.find(r => r.resource?.name === name)
  }

  const getActiveCompanions = () => {
    return companions.value.filter(c => c.isActive)
  }

  const getCompletedQuests = () => {
    return quests.value.filter(q => q.status === 'completed')
  }

  // Actions
  const fetchPlayer = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/player/${playerId}`)
      const { data } = response
      player.value = data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching player:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchResources = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/player/resources?playerId=${playerId}`)
      const { data } = response
      resources.value = data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching resources:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCompanions = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/player/companions?playerId=${playerId}`)
      const { data } = response
      companions.value = data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching companions:', err)
    } finally {
      loading.value = false
    }
  }

  const updateResource = async (playerId: string, resourceName: string, amount: number, locked: number = 0) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/player/resources/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId,
          resourceName,
          amount,
          locked
        })
      })

      // Update local state
      const index = resources.value.findIndex(r => r.resource?.name === resourceName)
      if (index !== -1) {
        resources.value[index] = response.data
      } else {
        // Add new resource to local state if not found
        resources.value.push(response.data)
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating resource:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePlayer = async (playerId: string, updates: any) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/player/update', {
        method: 'POST',
        body: {
          playerId,
          ...updates
        }
      })

      // Update local state
      if (player.value) {
        Object.assign(player.value, response.data)
      }

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating player:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addResource = async (playerId: string, resourceName: string, amount: number) => {
    const resource = getResourceByName(resourceName)
    const currentAmount = resource ? Number(resource.amount || 0) : 0
    const newAmount = currentAmount + amount
    return await updateResource(playerId, resourceName, newAmount, resource?.locked || 0)
  }

  const spendResource = async (playerId: string, resourceName: string, amount: number) => {
    const resource = getResourceByName(resourceName)
    const currentAmount = resource ? Number(resource.amount || 0) : 0
    
    if (currentAmount < amount) {
      throw new Error(`Không đủ ${resourceName}`)
    }

    const newAmount = currentAmount - amount
    return await updateResource(playerId, resourceName, newAmount, resource?.locked || 0)
  }

  // Initialize player data
  const initializePlayer = async (playerId: string) => {
    await Promise.all([
      fetchPlayer(playerId),
      fetchResources(playerId),
      fetchCompanions(playerId)
    ])
  }

  // Reset store
  const reset = () => {
    player.value = null
    resources.value = []
    companions.value = []
    achievements.value = []
    quests.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    player,
    resources,
    companions,
    achievements,
    quests,
    loading,
    error,

    // Getters
    getResourceByName,
    getActiveCompanions,
    getCompletedQuests,

    // Actions
    fetchPlayer,
    fetchResources,
    fetchCompanions,
    updateResource,
    updatePlayer,
    addResource,
    spendResource,
    initializePlayer,
    reset
  }
})
