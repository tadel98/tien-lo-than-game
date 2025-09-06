<template>
  <div class="cultivation-panel game-card p-6 rounded-lg">
    <h2 class="text-2xl font-bold text-center mb-6 text-white">
      🧘 Tu Luyện
    </h2>

    <!-- Thông tin cơ bản -->
    <div class="mb-6 text-center">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-white mb-2">Cấp Độ & Cảnh Giới</h3>
        <div class="flex items-center justify-center space-x-6">
          <div class="text-center">
            <p class="text-3xl font-bold" :style="{ color: realmColor }">
              {{ cultivationStatus?.cultivation?.currentLevel || 1 }}
            </p>
            <p class="text-sm text-game-text-secondary">Cấp</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold" :style="{ color: realmColor }">
              {{ cultivationStatus?.cultivation?.realm || 'Phàm cảnh' }}
            </p>
            <p class="text-sm text-game-text-secondary">Cảnh giới</p>
          </div>
        </div>
      </div>

      <!-- Progress bar đơn giản -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-game-text-secondary">Kinh Nghiệm</span>
          <span class="text-sm text-game-text-secondary">
            {{ Math.round(progressPercentage) }}%
          </span>
        </div>
        <div class="w-full bg-game-light rounded-full h-3">
          <div 
            class="h-3 rounded-full transition-all duration-500"
            :style="{ 
              width: `${progressPercentage}%`,
              background: `linear-gradient(90deg, ${realmColor} 0%, #8b5cf6 100%)`
            }"
          ></div>
        </div>
        <div class="flex justify-between items-center mt-1 text-xs">
          <span>{{ cultivationStatus?.cultivation?.currentExp?.toLocaleString() || 0 }}</span>
          <span>{{ cultivationStatus?.cultivation?.nextLevelExp?.toLocaleString() || 0 }}</span>
        </div>
      </div>

      <!-- Tài nguyên -->
      <div class="flex justify-center space-x-4 text-sm">
        <div class="text-center">
          <p class="text-blue-400 font-semibold">
            {{ cultivationStatus?.cultivation?.linhThachAmount?.toLocaleString() || 0 }}
          </p>
          <p class="text-xs text-game-text-secondary">Linh Thạch</p>
        </div>
      </div>
    </div>

    <!-- Nút tu luyện đơn giản -->
    <div class="space-y-3">
      <button
        @click="handleCultivation('basic')"
        :disabled="!canCultivate || loading"
        class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg"
      >
        <span v-if="loading && isCultivating">Đang tu luyện...</span>
        <span v-else>🧘 Tu Luyện (100 Linh Thạch)</span>
      </button>

      <button
        @click="handleBreakthrough"
        :disabled="!canBreakthrough || loading"
        class="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <span v-if="loading">Đang đột phá...</span>
        <span v-else>💥 Đột Phá Cảnh Giới</span>
      </button>
    </div>

    <!-- Thông báo lỗi -->
    <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
      <p class="text-red-400 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const cultivationStore = useCultivationStore()
const playerStore = usePlayerStore()

// Props
const props = defineProps({
  playerId: {
    type: String,
    required: true
  }
})

// Computed - chỉ giữ những gì cần thiết
const cultivationStatus = computed(() => cultivationStore.cultivationStatus)
const loading = computed(() => cultivationStore.loading)
const error = computed(() => cultivationStore.error)
const canCultivate = computed(() => cultivationStore.canCultivate)
const canBreakthrough = computed(() => cultivationStore.canBreakthrough)
const progressPercentage = computed(() => cultivationStore.progressPercentage)
const currentRealm = computed(() => cultivationStore.currentRealm)

const realmColor = computed(() => {
  return cultivationStore.getRealmColor(currentRealm.value)
})

// Methods - đơn giản hóa
const handleCultivation = async () => {
  try {
    const result = await cultivationStore.startCultivation(props.playerId, 'basic')
    await playerStore.fetchResources(props.playerId)
    
    if (result?.data) {
      console.log(`Tu luyện thành công! +${result.data.experienceGain} EXP`)
    }
  } catch (err) {
    console.error('Lỗi tu luyện:', err)
  }
}

const handleBreakthrough = async () => {
  try {
    const result = await cultivationStore.breakthrough(props.playerId)
    await playerStore.fetchResources(props.playerId)
    
    if (result?.data?.breakthrough) {
      const { oldLevel, newLevel, oldRealm, newRealm, isRealmChange } = result.data.breakthrough
      console.log(`Đột phá thành công! Cấp ${oldLevel} → ${newLevel}`)
      if (isRealmChange) {
        console.log(`Cảnh giới mới: ${newRealm}`)
      }
    }
  } catch (err) {
    console.error('Lỗi đột phá:', err)
  }
}

// Initialize
onMounted(async () => {
  await cultivationStore.fetchCultivationStatus(props.playerId)
})
</script>
