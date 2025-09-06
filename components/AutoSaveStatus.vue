<template>
  <div v-if="showStatus" class="fixed bottom-4 right-4 z-50">
    <div class="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg">
      <div class="flex items-center space-x-2">
        <div v-if="isSaving" class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <div v-else-if="lastSaveTime" class="w-4 h-4 bg-green-500 rounded-full"></div>
        <div v-else class="w-4 h-4 bg-gray-500 rounded-full"></div>
        
        <span class="text-sm text-white">
          <span v-if="isSaving">Đang lưu...</span>
          <span v-else-if="lastSaveTime">Đã lưu {{ formatTime(lastSaveTime) }}</span>
          <span v-else>Chưa lưu</span>
        </span>
      </div>
      
      <div v-if="saveError" class="mt-2 text-xs text-red-400">
        Lỗi: {{ saveError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const autoSaveStore = useAutoSaveStore()

const isSaving = computed(() => autoSaveStore.isSaving)
const lastSaveTime = computed(() => autoSaveStore.lastSaveTime)
const saveError = computed(() => autoSaveStore.saveError)

const showStatus = computed(() => {
  return isSaving.value || lastSaveTime.value || saveError.value
})

const formatTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  
  if (seconds < 60) {
    return `${seconds}s trước`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m trước`
  } else {
    return date.toLocaleTimeString('vi-VN')
  }
}
</script>
