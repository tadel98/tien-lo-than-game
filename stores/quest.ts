import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Declare $fetch as global
declare const $fetch: any

export const useQuestStore = defineStore('quest', () => {
  // State
  const quests = ref<any[]>([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const availableQuests = computed(() => {
    return quests.value.filter(q => q.status === 'available')
  })

  const completedQuests = computed(() => {
    return quests.value.filter(q => q.status === 'completed')
  })

  const activeQuests = computed(() => {
    return quests.value.filter(q => q.status === 'active')
  })

  const inProgressQuests = computed(() => {
    return quests.value.filter(q => q.status === 'in_progress')
  })

  // Actions
  const fetchQuests = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/quest/list?playerId=${playerId}`)
      quests.value = response.data || []
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

      // Cập nhật local state
      const quest = quests.value.find(q => q.id === questId)
      if (quest) {
        quest.status = 'active'
        quest.startedAt = new Date()
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

      // Cập nhật local state
      const quest = quests.value.find(q => q.id === questId)
      if (quest) {
        quest.status = 'completed'
        quest.completedAt = new Date()
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

  // Reset store
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
    completedQuests,
    activeQuests,
    inProgressQuests,

    // Actions
    fetchQuests,
    startQuest,
    completeQuest,
    reset
  }
})