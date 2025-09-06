<template>
  <div class="quest-panel game-card p-6 rounded-lg">
    <h2 class="text-2xl font-bold text-center mb-6 text-white">
      📜 Nhiệm Vụ & Đánh Quái
    </h2>

    <!-- Thông tin cấp độ -->
    <div class="mb-6 text-center">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-white mb-2">Cấp Độ & Cảnh Giới</h3>
        <div class="flex items-center justify-center space-x-6">
          <div class="text-center">
            <p class="text-3xl font-bold" :style="{ color: realmColor }">
              {{ player?.level || 1 }}
            </p>
            <p class="text-sm text-game-text-secondary">Cấp</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold" :style="{ color: realmColor }">
              {{ player?.realm || 'Phàm cảnh' }}
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
          <span>{{ currentExp?.toLocaleString() || 0 }}</span>
          <span>{{ nextLevelExp?.toLocaleString() || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Nút hành động -->
    <div class="space-y-3">
      <button
        @click="handleQuestComplete"
        :disabled="!canCompleteQuest || loading"
        class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg"
      >
        <span v-if="loading">Đang hoàn thành...</span>
        <span v-else>📜 Hoàn Thành Nhiệm Vụ (+EXP)</span>
      </button>

      <button
        @click="handleCombat"
        :disabled="!canCombat || loading"
        class="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 py-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg"
      >
        <span v-if="loading">Đang chiến đấu...</span>
        <span v-else>⚔️ Đánh Quái (+EXP)</span>
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

    <!-- Thông tin EXP -->
    <div class="mt-6 p-4 bg-game-light/50 rounded-lg">
      <h4 class="text-sm font-semibold text-white mb-2">Cách Lên Level:</h4>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Hoàn thành nhiệm vụ:</span>
          <span class="text-green-400">+100-500 EXP</span>
        </div>
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Đánh quái:</span>
          <span class="text-red-400">+50-200 EXP</span>
        </div>
        <div class="flex justify-between">
          <span class="text-game-text-secondary">Đột phá cần:</span>
          <span class="text-yellow-400">Đủ EXP + Tài nguyên</span>
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

const playerStore = usePlayerStore()
const questStore = useQuestStore()

// Props
const props = defineProps({
  playerId: {
    type: String,
    required: true
  }
})

// Computed
const player = computed(() => playerStore.player)
const loading = computed(() => questStore.loading)
const error = computed(() => questStore.error)

// Tính toán progress
const currentExp = computed(() => {
  return player.value?.experience ? Number(player.value.experience) : 0
})

const nextLevelExp = computed(() => {
  const level = player.value?.level || 1
  return Math.pow(level, 2) * 1440 // Công thức EXP cần cho level tiếp theo
})

const progressPercentage = computed(() => {
  if (!currentExp.value || !nextLevelExp.value) return 0
  return Math.min((currentExp.value / nextLevelExp.value) * 100, 100)
})

const realmColor = computed(() => {
  const level = player.value?.level || 1
  if (level < 10) return '#6b7280'
  if (level < 50) return '#3b82f6'
  if (level < 100) return '#10b981'
  if (level < 200) return '#f59e0b'
  if (level < 500) return '#ef4444'
  if (level < 1000) return '#8b5cf6'
  return '#f97316'
})

const canCompleteQuest = computed(() => {
  // Kiểm tra có nhiệm vụ nào có thể hoàn thành không
  return true // Tạm thời luôn true
})

const canCombat = computed(() => {
  // Kiểm tra có thể đánh quái không (có thể dựa vào level, tài nguyên, etc.)
  return true // Tạm thời luôn true
})

const canBreakthrough = computed(() => {
  return progressPercentage.value >= 100
})

// Methods
const handleQuestComplete = async () => {
  try {
    // Tìm nhiệm vụ có thể hoàn thành
    const quests = Array.isArray(questStore.quests) ? questStore.quests : []
    const availableQuests = quests.filter(q => q.status === 'available')
    
    if (availableQuests.length === 0) {
      console.log('Không có nhiệm vụ nào để hoàn thành')
      return
    }

    // Hoàn thành nhiệm vụ đầu tiên
    const quest = availableQuests[0]
    const result = await questStore.completeQuest(props.playerId, quest.id)
    
    // Cập nhật player data
    await playerStore.fetchPlayer(props.playerId)
    
    if (result?.data) {
      console.log(`Hoàn thành nhiệm vụ! +${result.data.experienceGain || 0} EXP`)
    }
  } catch (err) {
    console.error('Lỗi hoàn thành nhiệm vụ:', err)
  }
}

const handleCombat = async () => {
  try {
    const response = await $fetch('/api/combat/fight', {
      method: 'POST',
      body: {
        playerId: props.playerId,
        monsterType: 'basic'
      }
    })
    
    // Cập nhật player data
    await playerStore.fetchPlayer(props.playerId)
    
    if (response?.data?.combat) {
      const { expGain, levelUp, oldLevel, newLevel } = response.data.combat
      console.log(`Đánh quái thành công! +${expGain} EXP`)
      
      if (levelUp) {
        console.log(`Level up! Từ cấp ${oldLevel} lên cấp ${newLevel}`)
      }
    }
  } catch (err) {
    console.error('Lỗi đánh quái:', err)
  }
}

const handleBreakthrough = async () => {
  try {
    // Simulate breakthrough
    const currentLevel = player.value?.level || 1
    const newLevel = currentLevel + 1
    
    const result = await playerStore.updatePlayer(props.playerId, {
      level: newLevel,
      realm: getRealmByLevel(newLevel)
    })
    
    if (result) {
      console.log(`Đột phá thành công! Lên cấp ${newLevel}`)
    }
  } catch (err) {
    console.error('Lỗi đột phá:', err)
  }
}

const getRealmByLevel = (level) => {
  if (level < 10) return 'Phàm cảnh'
  if (level < 50) return 'Luyện Khí cảnh'
  if (level < 100) return 'Trúc Cơ cảnh'
  if (level < 200) return 'Kim Đan cảnh'
  if (level < 500) return 'Nguyên Anh cảnh'
  if (level < 1000) return 'Hóa Thần cảnh'
  return 'Hợp Thể cảnh'
}

// Initialize
onMounted(async () => {
  if (props.playerId) {
    await questStore.fetchQuests(props.playerId)
  } else {
    console.error('QuestPanel: playerId is empty')
  }
})
</script>
