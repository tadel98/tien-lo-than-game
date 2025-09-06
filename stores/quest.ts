import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQuestStore = defineStore('quest', () => {
  // State
  const quests = ref<any[]>([])
  const questStats = ref<any>(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const availableQuests = computed(() => {
    return quests.value.filter(quest => quest.playerStatus?.status === 'available')
  })

  const inProgressQuests = computed(() => {
    return quests.value.filter(quest => quest.playerStatus?.status === 'in_progress')
  })

  const completedQuests = computed(() => {
    return quests.value.filter(quest => quest.playerStatus?.status === 'completed')
  })

  const lockedQuests = computed(() => {
    return quests.value.filter(quest => quest.playerStatus?.status === 'locked')
  })

  const cooldownQuests = computed(() => {
    return quests.value.filter(quest => quest.playerStatus?.status === 'cooldown')
  })

  const questsByCategory = computed(() => {
    const grouped: { [key: string]: any[] } = {}
    quests.value.forEach(quest => {
      if (!grouped[quest.category]) {
        grouped[quest.category] = []
      }
      grouped[quest.category].push(quest)
    })
    return grouped
  })

  const questsByDifficulty = computed(() => {
    const grouped: { [key: string]: any[] } = {}
    quests.value.forEach(quest => {
      if (!grouped[quest.difficulty]) {
        grouped[quest.difficulty] = []
      }
      grouped[quest.difficulty].push(quest)
    })
    return grouped
  })

  // Quest counters
  const questCounts = computed(() => {
    if (!questStats.value) return {
      total: 0,
      available: 0,
      inProgress: 0,
      completed: 0,
      locked: 0,
      cooldown: 0
    }
    
    return {
      total: questStats.value.stats.total,
      available: questStats.value.stats.available,
      inProgress: questStats.value.stats.inProgress,
      completed: questStats.value.stats.completed,
      locked: questStats.value.stats.locked,
      cooldown: questStats.value.stats.cooldown
    }
  })

  // Actions
  const fetchQuests = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/quest/list?playerId=${playerId}`)
      quests.value = response.data.quests
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching quests:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchQuestStats = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/quest/stats?playerId=${playerId}`)
      questStats.value = response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching quest stats:', err)
    } finally {
      loading.value = false
    }
  }

  // Helper function to format cooldown time
  const formatCooldownTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes} phút ${remainingSeconds > 0 ? remainingSeconds + ' giây' : ''}`
    } else {
      return `${remainingSeconds} giây`
    }
  }

  // Get quests with formatted cooldown
  const questsWithFormattedCooldown = computed(() => {
    return quests.value.map(quest => {
      if (quest.playerStatus?.cooldownRemaining) {
        return {
          ...quest,
          playerStatus: {
            ...quest.playerStatus,
            formattedCooldown: formatCooldownTime(quest.playerStatus.cooldownRemaining)
          }
        }
      }
      return quest
    })
  })

  const startQuest = async (playerId: string, questId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/quest/start', {
        method: 'POST',
        body: {
          playerId,
          questId
        }
      })

      // Cập nhật quest trong danh sách
      const questIndex = quests.value.findIndex(q => q.id === questId)
      if (questIndex !== -1) {
        quests.value[questIndex] = response.data.quest
      }

      return response.data
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.data?.message || err.message
      console.error('Error starting quest:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const completeQuest = async (playerId: string, questId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/quest/complete', {
        method: 'POST',
        body: {
          playerId,
          questId
        }
      })

      // Cập nhật quest trong danh sách
      const questIndex = quests.value.findIndex(q => q.id === questId)
      if (questIndex !== -1) {
        quests.value[questIndex] = response.data.quest
      }

      return response.data
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.data?.message || err.message
      console.error('Error completing quest:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getQuestById = (questId: string) => {
    return quests.value.find(quest => quest.id === questId)
  }

  const getQuestsByLevel = (level: number) => {
    return quests.value.filter(quest => quest.level === level)
  }

  const reset = () => {
    quests.value = []
    questStats.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    quests,
    questStats,
    loading,
    error,
    
    // Getters
    availableQuests,
    inProgressQuests,
    completedQuests,
    lockedQuests,
    cooldownQuests,
    questsByCategory,
    questsByDifficulty,
    questCounts,
    questsWithFormattedCooldown,
    
    // Actions
    fetchQuests,
    fetchQuestStats,
    startQuest,
    completeQuest,
    getQuestById,
    formatCooldownTime,
    reset
  }
})
