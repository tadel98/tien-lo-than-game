<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
    <!-- Header -->
    <header class="bg-black/50 backdrop-blur-sm border-b border-green-500/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-2xl font-bold text-white">
              🗡️ Săn Quái
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
        <div class="game-card p-6 rounded-lg border-2 border-green-500">
          <h2 class="text-2xl font-bold text-white mb-4">⚔️ Đang Săn Quái</h2>
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

            <!-- Monster Info -->
            <div class="bg-green-900/50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-white mb-2">{{ currentMonster?.name }}</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Cấp độ:</span>
                  <span class="text-white">{{ currentMonster?.level }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Sức mạnh:</span>
                  <span class="text-red-400">{{ currentMonster?.combatPower.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">HP:</span>
                  <span class="text-green-400">{{ currentMonster?.hp }}/{{ currentMonster?.maxHp }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Combat Actions -->
          <div class="mt-6 flex justify-center space-x-4">
            <button
              @click="fightMonster"
              :disabled="loading"
              class="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold text-lg"
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

      <!-- Monster List -->
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
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              {{ difficulty.label }}
            </button>
          </div>
        </div>

        <!-- Monster Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="monster in filteredMonsters"
            :key="monster.id"
            class="game-card p-6 rounded-lg border-2"
            :class="[
              monster.isDefeated ? 'border-green-500 bg-green-900/20' : 'border-green-500 bg-green-900/20'
            ]"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ monster.name }}</h3>
              <span class="text-3xl">{{ monster.icon }}</span>
            </div>

            <p class="text-game-text-secondary mb-4">{{ monster.description }}</p>

            <!-- Monster Stats -->
            <div class="mb-4 space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">Cấp độ:</span>
                <span class="text-sm text-white">{{ monster.level }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">Sức mạnh:</span>
                <span class="text-sm text-red-400">{{ monster.combatPower.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">Độ khó:</span>
                <span 
                  class="text-sm font-semibold"
                  :style="{ color: getDifficultyColor(monster.difficulty) }"
                >
                  {{ getDifficultyName(monster.difficulty) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">HP:</span>
                <span class="text-sm text-green-400">{{ monster.hp.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Rewards Preview -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-white mb-2">Thưởng:</h4>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">EXP:</span>
                  <span class="text-blue-400">{{ monster.rewards.exp.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Tiên Ngọc:</span>
                  <span class="text-yellow-400">{{ monster.rewards.tien_ngoc.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-game-text-secondary">Linh Thạch:</span>
                  <span class="text-blue-400">{{ monster.rewards.linh_thach.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button
                v-if="!monster.isDefeated"
                @click="startFight(monster)"
                :disabled="!canFightMonster(monster, player?.level || 1, combatPower)"
                class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"
              >
                ⚔️ Săn Quái
              </button>
              <button
                v-else
                @click="resetMonster(monster.id)"
                class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold text-white"
              >
                🔄 Săn Lại
              </button>
            </div>

            <!-- Cannot Fight Reason -->
            <div v-if="!canFightMonster(monster, player?.level || 1, combatPower) && !monster.isDefeated" class="mt-2 text-xs text-red-400">
              <div v-if="(player?.level || 1) < monster.level">
                Cần cấp độ {{ monster.level }}
              </div>
              <div v-else-if="combatPower < monster.combatPower * 0.7">
                Cần sức mạnh {{ Math.floor(monster.combatPower * 0.7).toLocaleString() }}
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
const monsterStore = useMonsterStore()
const cultivationStore = useCultivationStore()

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const combatPower = computed(() => characterStore.combatPower)
const monsters = computed(() => monsterStore.monsters)
const currentMonster = computed(() => monsterStore.currentMonster)
const isInCombat = computed(() => monsterStore.isInCombat)
const combatResult = computed(() => monsterStore.combatResult)
const loading = computed(() => monsterStore.loading)

// State
const selectedDifficulty = ref('all')

// Difficulty options
const difficulties = [
  { value: 'all', label: 'Tất Cả' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung Bình' },
  { value: 'hard', label: 'Khó' },
  { value: 'extreme', label: 'Cực Khó' }
]

// Computed
const filteredMonsters = computed(() => {
  if (selectedDifficulty.value === 'all') {
    return monsters.value
  }
  return monsters.value.filter(monster => monster.difficulty === selectedDifficulty.value)
})

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount || 0).toLocaleString() : '0'
}

const getDifficultyColor = (difficulty) => monsterStore.getDifficultyColor(difficulty)
const getDifficultyName = (difficulty) => monsterStore.getDifficultyName(difficulty)
const canFightMonster = (monster, playerLevel, playerCombatPower) => monsterStore.canFightMonster(monster, playerLevel, playerCombatPower)

const startFight = (monster) => {
  monsterStore.startCombat(monster.id)
}

const fightMonster = async () => {
  if (!currentMonster.value || !player.value?.id) return

  try {
    monsterStore.loading.value = true
    
    // Tính toán kết quả chiến đấu
    const result = monsterStore.calculateCombatResult(combatPower.value, player.value.level)
    
    if (result.isWin) {
      // Xử lý thưởng
      const processedRewards = monsterStore.processRewards(result.rewards)
      
      // Cập nhật tài nguyên người chơi
      await playerStore.addResource(player.value.id, 'tien_ngoc', processedRewards.tien_ngoc)
      await playerStore.addResource(player.value.id, 'linh_thach', processedRewards.linh_thach)
      
      // Thêm EXP vào cultivation system
      cultivationStore.addExp(processedRewards.exp)
      
      // Đánh dấu monster đã bị đánh bại
      monsterStore.markMonsterDefeated(currentMonster.value.id)
      
      monsterStore.addCombatLog(`Đánh bại ${currentMonster.value.name}! Nhận được ${processedRewards.exp} EXP, ${processedRewards.tien_ngoc} Tiên Ngọc`)
    } else {
      monsterStore.addCombatLog(`Thất bại trước ${currentMonster.value.name}! Mất ${result.damageTaken} HP`)
    }
    
    // Kết thúc chiến đấu
    monsterStore.endCombat()
    monsterStore.combatResult.value = result
    
  } catch (err) {
    console.error('Lỗi săn quái:', err)
  } finally {
    monsterStore.loading.value = false
  }
}

const fleeCombat = () => {
  monsterStore.addCombatLog('Chạy trốn khỏi chiến đấu!')
  monsterStore.endCombat()
}

const resetMonster = (monsterId) => {
  monsterStore.resetMonster(monsterId)
}

const closeCombatResult = () => {
  monsterStore.combatResult.value = null
}

const handleLogout = () => {
  authStore.logout()
  playerStore.reset()
  monsterStore.reset()
}

// Initialize on mount
onMounted(async () => {
  authStore.initializeAuth()
  
  if (isAuthenticated.value && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await characterStore.fetchCharacterData(authStore.user.player.id)
    monsterStore.initializeMonsters()
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await characterStore.fetchCharacterData(authStore.user.player.id)
    monsterStore.initializeMonsters()
  } else {
    monsterStore.reset()
  }
})
</script>
