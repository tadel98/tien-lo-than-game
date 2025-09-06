<template>
  <button
    @click="handleSave"
    :disabled="isSaving"
    :class="[
      'inline-flex items-center px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105',
      isSaving 
        ? 'bg-gray-500 cursor-not-allowed' 
        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
    ]"
  >
    <div v-if="isSaving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
    <span v-else class="mr-2">💾</span>
    <span>{{ isSaving ? 'Đang lưu...' : 'Lưu ngay' }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const autoSaveStore = useAutoSaveStore()
const authStore = useAuthStore()

const isSaving = computed(() => autoSaveStore.isSaving)

const handleSave = async () => {
  if (authStore.user?.player?.id) {
    await autoSaveStore.forceSave(authStore.user.player.id)
  }
}
</script>
