<template>
  <div class="cultivation-panel game-card p-6 rounded-lg">
    <h2 class="text-2xl font-bold text-center mb-6 text-white">
      🧘 Tu Luyện
    </h2>

    <!-- Thông tin cấp độ và cảnh giới -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-white">Cấp Độ</h3>
          <p class="text-2xl font-bold" :style="{ color: realmColor }">
            {{ cultivationStatus?.cultivation?.currentLevel || 1 }}
          </p>
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-white">Cảnh Giới</h3>
          <p class="text-xl font-bold" :style="{ color: realmColor }">
            {{ cultivationStatus?.cultivation?.realm || 'Phàm cảnh' }}
          </p>
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-white">Huyền Lực</h3>
          <p class="text-xl font-bold text-purple-400">
            {{ cultivationStatus?.cultivation?.huyenLucAmount?.toLocaleString() || 0 }}
          </p>
        </div>
      </div>

      <!-- Progress bar cấp độ -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-game-text-secondary">Kinh Nghiệm</span>
          <span class="text-sm text-game-text-secondary">
            {{ Math.round(progressPercentage) }}%
          </span>
        </div>
        <div class="w-full bg-game-light rounded-full h-4">
          <div 
            class="progress-bar h-4 rounded-full transition-all duration-500"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <div class="flex justify-between items-center mt-1">
          <span class="text-sm">
            {{ cultivationStatus?.cultivation?.currentExp?.toLocaleString() || 0 }}
          </span>
          <span class="text-sm">
            {{ cultivationStatus?.cultivation?.nextLevelExp?.toLocaleString() || 0 }}
          </span>
        </div>
      </div>

      <!-- Progress bar cảnh giới -->
      <div v-if="realmProgress" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-game-text-secondary">Tiến Độ Cảnh Giới</span>
          <span class="text-sm text-game-text-secondary">
            {{ realmProgress.percentage }}%
          </span>
        </div>
        <div class="w-full bg-game-light rounded-full h-3">
          <div 
            class="h-3 rounded-full transition-all duration-500"
            :style="{ 
              width: `${realmProgress.percentage}%`,
              background: `linear-gradient(90deg, ${realmColor} 0%, ${nextRealmColor} 100%)`
            }"
          ></div>
        </div>
        <div class="flex justify-between items-center mt-1">
          <span class="text-sm">{{ realmProgress.current }}/{{ realmProgress.max }}</span>
          <span class="text-sm text-game-text-secondary">
            Cấp {{ nextRealmLevel }} để lên {{ nextRealm }}
          </span>
        </div>
      </div>
    </div>

    <!-- Nút tu luyện -->
    <div class="space-y-4">
      <button
        @click="handleCultivation('basic')"
        :disabled="!canCultivate || loading"
        class="w-full game-button py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading && isCultivating">Đang tu luyện...</span>
        <span v-else>🧘 Tu Luyện Cơ Bản</span>
      </button>

      <button
        @click="handleCultivation('advanced')"
        :disabled="!canCultivate || loading"
        class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <span v-if="loading && isCultivating">Đang tu luyện...</span>
        <span v-else>⚡ Tu Luyện Nâng Cao</span>
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

    <!-- Thông tin chi phí -->
    <div class="mt-6 p-4 bg-game-light/50 rounded-lg">
      <h4 class="text-sm font-semibold text-white mb-2">Chi Phí Tu Luyện:</h4>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Tu Luyện Cơ Bản:</span>
          <span class="text-purple-400">100 Huyền Lực</span>
        </div>
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Tu Luyện Nâng Cao:</span>
          <span class="text-purple-400">500 Huyền Lực</span>
        </div>
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Đột Phá:</span>
          <span class="text-purple-400">1000+ Huyền Lực</span>
        </div>
        <div class="flex justify-between">
          <span class="text-game-text-secondary">+ Linh Thạch:</span>
          <span class="text-blue-400">5000+ Linh Thạch</span>
        </div>
      </div>
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

// Computed
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

const realmProgress = computed(() => {
  return cultivationStatus.value?.cultivation?.realmProgress
})

const cultivationInfo = computed(() => {
  const level = cultivationStatus.value?.cultivation?.currentLevel || 1
  return cultivationStore.getCultivationInfo(level)
})

const nextRealm = computed(() => cultivationInfo.value.nextRealm.name)
const nextRealmColor = computed(() => cultivationInfo.value.nextRealm.color)
const nextRealmLevel = computed(() => cultivationInfo.value.nextRealm.min)

// Methods
const handleCultivation = async (type) => {
  try {
    const result = await cultivationStore.startCultivation(props.playerId, type)
    
    // Cập nhật tài nguyên trong player store
    await playerStore.fetchResources(props.playerId)
    
    // Hiển thị thông báo thành công
    if (result?.data) {
      console.log(`Tu luyện thành công! Nhận được ${result.data.experienceGain} kinh nghiệm`)
    }
  } catch (err) {
    console.error('Lỗi tu luyện:', err)
  }
}

const handleBreakthrough = async () => {
  try {
    const result = await cultivationStore.breakthrough(props.playerId)
    
    // Cập nhật tài nguyên trong player store
    await playerStore.fetchResources(props.playerId)
    
    // Hiển thị thông báo thành công
    if (result?.data?.breakthrough) {
      const { oldLevel, newLevel, oldRealm, newRealm, isRealmChange } = result.data.breakthrough
      console.log(`Đột phá thành công! Từ cấp ${oldLevel} lên cấp ${newLevel}`)
      if (isRealmChange) {
        console.log(`Chúc mừng! Đã lên cảnh giới mới: ${newRealm}`)
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
