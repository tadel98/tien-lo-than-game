import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQuestStore = defineStore('quest', () => {
  // State
  const quests = ref<any[]>([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const availableQuests = computed(() => {
    return quests.value.filter(quest => quest.playerStatus.status === 'available')
  })

  const inProgressQuests = computed(() => {
    return quests.value.filter(quest => quest.playerStatus.status === 'in_progress')
  })

  const completedQuests = computed(() => {
    return quests.value.filter(quest => quest.playerStatus.status === 'completed')
  })

  const questsByLevel = computed(() => {
    const grouped: { [key: number]: any[] } = {}
    quests.value.forEach(quest => {
      if (!grouped[quest.level]) {
        grouped[quest.level] = []
      }
      grouped[quest.level].push(quest)
    })
    return grouped
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
      error.value = err.message
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
      error.value = err.message
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
    loading.value = false
    error.value = null
  }

  return {
    // State
    quests,
    loading,
    error,
    
    // Getters
    availableQuests,
    inProgressQuests,
    completedQuests,
    questsByLevel,
    
    // Actions
    fetchQuests,
    startQuest,
    completeQuest,
    getQuestById,
    getQuestsByLevel,
    reset
  }
})
