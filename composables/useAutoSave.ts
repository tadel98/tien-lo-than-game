import { onMounted, onUnmounted } from 'vue'

export const useAutoSave = () => {
  const autoSaveStore = useAutoSaveStore()
  const authStore = useAuthStore()

  const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
    // Save data before leaving the page
    if (authStore.user?.player?.id) {
      await autoSaveStore.saveBeforeLogout(authStore.user.player.id)
    }
  }

  const handleVisibilityChange = async () => {
    // Save data when tab becomes hidden (user switches tabs)
    if (document.hidden && authStore.user?.player?.id) {
      await autoSaveStore.saveBeforeLogout(authStore.user.player.id)
    }
  }

  onMounted(() => {
    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    // Remove event listeners
    window.removeEventListener('beforeunload', handleBeforeUnload)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return {
    autoSaveStore,
    forceSave: () => {
      if (authStore.user?.player?.id) {
        return autoSaveStore.forceSave(authStore.user.player.id)
      }
    }
  }
}
