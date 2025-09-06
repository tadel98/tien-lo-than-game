import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAutoSaveStore = defineStore('autoSave', () => {
  // State
  const isEnabled = ref(true)
  const lastSaveTime = ref<Date | null>(null)
  const saveInterval = ref(6000) // 6 seconds
  const isSaving = ref(false)
  const saveError = ref<string | null>(null)

  // Auto-save timer
  let saveTimer: NodeJS.Timeout | null = null

  // Actions
  const startAutoSave = (playerId: string) => {
    if (!isEnabled.value || !playerId) return

    // Clear existing timer
    if (saveTimer) {
      clearInterval(saveTimer)
    }

    // Start new timer
    saveTimer = setInterval(async () => {
      await savePlayerData(playerId)
    }, saveInterval.value)
  }

  const stopAutoSave = () => {
    if (saveTimer) {
      clearInterval(saveTimer)
      saveTimer = null
    }
  }

  const savePlayerData = async (playerId: string) => {
    if (isSaving.value || !playerId) return

    try {
      isSaving.value = true
      saveError.value = null

      // Get all stores using dynamic import to avoid TypeScript errors
      const { usePlayerStore } = await import('./player')
      const { useCharacterStore } = await import('./character')
      const { useCultivationStore } = await import('./cultivation')
      const { useQuestStore } = await import('./quest')
      const { useSpiritBeastStore } = await import('./spiritBeast')
      const { useTalentStore } = await import('./talent')

      const playerStore = usePlayerStore()
      const characterStore = useCharacterStore()
      const cultivationStore = useCultivationStore()
      const questStore = useQuestStore()
      const spiritBeastStore = useSpiritBeastStore()
      const talentStore = useTalentStore()

      // Save player data
      if (playerStore.player) {
        await playerStore.updatePlayer(playerId, playerStore.player)
      }

      // Save resources
      if (playerStore.resources.length > 0) {
        for (const resource of playerStore.resources) {
          await playerStore.updateResource(playerId, resource.resource.name, resource.amount)
        }
      }

      // Save character stats
      if (characterStore.stats) {
        await characterStore.updateStats(playerId, characterStore.stats.base)
      }

      // Save cultivation progress
      if (cultivationStore.cultivationStatus) {
        // Note: cultivation store doesn't have updateCultivationProgress method
        // This would need to be implemented in the cultivation store
        console.log('Cultivation data save not implemented yet')
      }

      lastSaveTime.value = new Date()
      console.log('Auto-save completed at:', lastSaveTime.value.toLocaleTimeString())
    } catch (err: any) {
      saveError.value = err.message
      console.error('Auto-save error:', err)
    } finally {
      isSaving.value = false
    }
  }

  const forceSave = async (playerId: string) => {
    await savePlayerData(playerId)
  }

  const saveBeforeLogout = async (playerId: string) => {
    if (!playerId) return

    try {
      console.log('Saving data before logout...')
      await savePlayerData(playerId)
      console.log('Data saved successfully before logout')
    } catch (err) {
      console.error('Error saving data before logout:', err)
    }
  }

  // Watch for changes and auto-save
  const setupAutoSave = async (playerId: string) => {
    if (!isEnabled.value) return

    // Get stores using dynamic import
    const { usePlayerStore } = await import('./player')
    const { useCharacterStore } = await import('./character')

    const playerStore = usePlayerStore()
    const characterStore = useCharacterStore()

    // Watch for player data changes
    watch(
      () => playerStore.player,
      () => {
        if (playerStore.player) {
          savePlayerData(playerId)
        }
      },
      { deep: true }
    )

    // Watch for resource changes
    watch(
      () => playerStore.resources,
      () => {
        if (playerStore.resources.length > 0) {
          savePlayerData(playerId)
        }
      },
      { deep: true }
    )

    // Watch for character stats changes
    watch(
      () => characterStore.stats,
      () => {
        if (characterStore.stats) {
          savePlayerData(playerId)
        }
      },
      { deep: true }
    )
  }

  const reset = () => {
    stopAutoSave()
    lastSaveTime.value = null
    isSaving.value = false
    saveError.value = null
  }

  return {
    // State
    isEnabled,
    lastSaveTime,
    saveInterval,
    isSaving,
    saveError,

    // Actions
    startAutoSave,
    stopAutoSave,
    savePlayerData,
    forceSave,
    saveBeforeLogout,
    setupAutoSave,
    reset
  }
})
