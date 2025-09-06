<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
    <!-- Header -->
    <header class="bg-black/50 backdrop-blur-sm border-b border-red-500/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-2xl font-bold text-white">
              ⚔️ Boss Chiến Đấu
            </NuxtLink>
          </div>

          <!-- Player Info -->
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <p class="text-sm text-game-text-secondary">Cấp Độ</p>
              <p class="text-lg font-semibold text-blue-400">{{ player?.level || 1 }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-game-text-secondary">Sức Mạnh</p>
              <p class="text-lg font-semibold text-red-400">{{ combatPower.toLocaleString() }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-game-text-secondary">Tiên Ngọc</p>
              <p class="text-lg font-semibold text-yellow-400">{{ getResourceAmount('tien_ngoc') }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <NuxtLink to="/" class="game-button px-6 py-2 rounded-lg text-white font-semibold">
              🏠 Trang Chủ
            </NuxtLink>
            <button @click="handleLogout" class="game-button px-6 py-2 rounded-lg text-white font-semibold">
              🚪 Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Combat Status -->
      <div v-if="isInCombat" class="mb-8">
        <div class="game-card p-6 rounded-lg border-2 border-red-500">
          <h2 class="text-2xl font-bold text-white mb-4">🔥 Đang Chiến Đấu</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Player Info -->
            <div class="bg-gray-800/50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-white mb-2">Người Chơi</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Cấp độ:</span>
                  <span class="text-white">{{ player?.level || 1 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Sức mạnh:</span>
                  <span class="text-red-400">{{ combatPower.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Boss Info -->
            <div class="bg-red-900/50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-white mb-2">{{ currentBoss?.name }}</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Cấp độ:</span>
                  <span class="text-white">{{ currentBoss?.level }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Sức mạnh:</span>
                  <span class="text-red-400">{{ currentBoss?.combatPower.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">HP:</span>
                  <span class="text-green-400">{{ currentBoss?.hp }}/{{ currentBoss?.maxHp }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Combat Actions -->
          <div class="mt-6 flex justify-center space-x-4">
            <button
              @click="fightBoss"
              :disabled="loading"
              class="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold text-lg"
            >
              ⚔️ Tấn Công
            </button>
            <button
              @click="fleeCombat"
              class="px-8 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold text-lg"
            >
              🏃 Chạy Trốn
            </button>
          </div>
        </div>
      </div>

      <!-- Boss List -->
      <div v-else>
        <!-- Difficulty Filter -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">Lọc Theo Độ Khó</h2>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="difficulty in difficulties"
              :key="difficulty.value"
              @click="selectedDifficulty = difficulty.value"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all duration-300',
                selectedDifficulty === difficulty.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              {{ difficulty.label }}
            </button>
          </div>
        </div>

        <!-- Boss Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="boss in filteredBosses"
            :key="boss.id"
            class="game-card p-6 rounded-lg border-2"
            :class="[
              boss.isDefeated ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'
            ]"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ boss.name }}</h3>
              <span class="text-3xl">{{ boss.icon }}</span>
            </div>

            <p class="text-game-text-secondary mb-4">{{ boss.description }}</p>

            <!-- Boss Stats -->
            <div class="mb-4 space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">Cấp độ:</span>
                <span class="text-sm text-white">{{ boss.level }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">Sức mạnh:</span>
                <span class="text-sm text-red-400">{{ boss.combatPower.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">Độ khó:</span>
                <span 
                  class="text-sm font-semibold"
                  :style="{ color: getDifficultyColor(boss.difficulty) }"
                >
                  {{ getDifficultyName(boss.difficulty) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">HP:</span>
                <span class="text-sm text-green-400">{{ boss.hp.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Rewards Preview -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-white mb-2">Thưởng:</h4>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">EXP:</span>
                  <span class="text-blue-400">{{ boss.rewards.exp.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Tiên Ngọc:</span>
                  <span class="text-yellow-400">{{ boss.rewards.tien_ngoc.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Linh Thạch:</span>
                  <span class="text-blue-400">{{ boss.rewards.linh_thach.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button
                v-if="!boss.isDefeated"
                @click="startFight(boss)"
                :disabled="!canFightBoss(boss, player?.level || 1, combatPower)"
                class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"
              >
                ⚔️ Chiến Đấu
              </button>
              <button
                v-else
                @click="resetBoss(boss.id)"
                class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold text-white"
              >
                🔄 Tái Chiến
              </button>
            </div>

            <!-- Cannot Fight Reason -->
            <div v-if="!canFightBoss(boss, player?.level || 1, combatPower) && !boss.isDefeated" class="mt-2 text-xs text-red-400">
              <div v-if="(player?.level || 1) < boss.level">
                Cần cấp độ {{ boss.level }}
              </div>
              <div v-else-if="combatPower < boss.combatPower * 0.8">
                Cần sức mạnh {{ Math.floor(boss.combatPower * 0.8).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Combat Result Modal -->
      <div v-if="combatResult" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-lg max-w-md w-full p-6">
          <div class="text-center">
            <div class="text-6xl mb-4">
              {{ combatResult.isWin ? '🎉' : '💀' }}
            </div>
            <h2 class="text-2xl font-bold text-white mb-4">
              {{ combatResult.isWin ? 'Chiến Thắng!' : 'Thất Bại!' }}
            </h2>
            
            <div v-if="combatResult.isWin && combatResult.rewards" class="mb-6">
              <h3 class="text-lg font-semibold text-white mb-3">Thưởng Nhận Được:</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">EXP:</span>
                  <span class="text-blue-400">+{{ combatResult.rewards.exp.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Tiên Ngọc:</span>
                  <span class="text-yellow-400">+{{ combatResult.rewards.tien_ngoc.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Linh Thạch:</span>
                  <span class="text-blue-400">+{{ combatResult.rewards.linh_thach.toLocaleString() }}</span>
                </div>
                <div v-if="combatResult.rewards.items.length > 0" class="mt-3">
                  <div class="text-game-text-secondary mb-2">Vật phẩm:</div>
                  <div v-for="item in combatResult.rewards.items" :key="item.id" class="text-green-400">
                    +{{ item.name }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-center space-x-4">
              <button
                @click="closeCombatResult"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Stores
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const characterStore = useCharacterStore()
const bossStore = useBossStore()
const cultivationStore = useCultivationStore()

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const combatPower = computed(() => characterStore.combatPower)
const bosses = computed(() => bossStore.bosses)
const currentBoss = computed(() => bossStore.currentBoss)
const isInCombat = computed(() => bossStore.isInCombat)
const combatResult = computed(() => bossStore.combatResult)
const loading = computed(() => bossStore.loading)

// State
const selectedDifficulty = ref('all')

// Difficulty options
const difficulties = [
  { value: 'all', label: 'Tất Cả' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung Bình' },
  { value: 'hard', label: 'Khó' },
  { value: 'extreme', label: 'Cực Khó' },
  { value: 'godlike', label: 'Thần Thánh' }
]

// Computed
const filteredBosses = computed(() => {
  if (selectedDifficulty.value === 'all') {
    return bosses.value
  }
  return bosses.value.filter(boss => boss.difficulty === selectedDifficulty.value)
})

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount).toLocaleString() : '0'
}

const getDifficultyColor = (difficulty) => bossStore.getDifficultyColor(difficulty)
const getDifficultyName = (difficulty) => bossStore.getDifficultyName(difficulty)
const canFightBoss = (boss, playerLevel, playerCombatPower) => bossStore.canFightBoss(boss, playerLevel, playerCombatPower)

const startFight = (boss) => {
  bossStore.startCombat(boss.id)
}

const fightBoss = async () => {
  if (!currentBoss.value || !player.value?.id) return

  try {
    loading.value = true
    
    // Tính toán kết quả chiến đấu
    const result = bossStore.calculateCombatResult(combatPower.value, player.value.level)
    
    if (result.isWin) {
      // Xử lý thưởng
      const processedRewards = bossStore.processRewards(result.rewards)
      
      // Cập nhật tài nguyên người chơi
      await playerStore.addResource(player.value.id, 'tien_ngoc', processedRewards.tien_ngoc)
      await playerStore.addResource(player.value.id, 'linh_thach', processedRewards.linh_thach)
      
      // Thêm EXP vào cultivation system
      cultivationStore.addExp(processedRewards.exp)
      
      // Đánh dấu boss đã bị đánh bại
      bossStore.markBossDefeated(currentBoss.value.id)
      
      bossStore.addCombatLog(`Đánh bại ${currentBoss.value.name}! Nhận được ${processedRewards.exp} EXP, ${processedRewards.tien_ngoc} Tiên Ngọc`)
    } else {
      bossStore.addCombatLog(`Thất bại trước ${currentBoss.value.name}! Mất ${result.damageTaken} HP`)
    }
    
    // Kết thúc chiến đấu
    bossStore.endCombat()
    bossStore.combatResult.value = result
    
  } catch (err) {
    console.error('Lỗi chiến đấu:', err)
  } finally {
    loading.value = false
  }
}

const fleeCombat = () => {
  bossStore.addCombatLog('Chạy trốn khỏi chiến đấu!')
  bossStore.endCombat()
}

const resetBoss = (bossId) => {
  bossStore.resetBoss(bossId)
}

const closeCombatResult = () => {
  bossStore.combatResult.value = null
}

const handleLogout = () => {
  authStore.logout()
  playerStore.reset()
  bossStore.reset()
}

// Initialize on mount
onMounted(async () => {
  authStore.initializeAuth()
  
  if (isAuthenticated.value && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await characterStore.fetchCharacterData(authStore.user.player.id)
    bossStore.initializeBosses()
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await characterStore.fetchCharacterData(authStore.user.player.id)
    bossStore.initializeBosses()
  } else {
    bossStore.reset()
  }
})
</script>
