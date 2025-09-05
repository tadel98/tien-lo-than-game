<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Header -->
    <header class="bg-black/50 backdrop-blur-sm border-b border-purple-500/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-2xl font-bold text-white">
              🐾 Linh Thú
            </NuxtLink>
          </div>

          <!-- Player Info -->
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <p class="text-sm text-game-text-secondary">Tiên Ngọc</p>
              <p class="text-lg font-semibold text-yellow-400">{{ getResourceAmount('tien_ngoc') }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-game-text-secondary">Linh Thạch</p>
              <p class="text-lg font-semibold text-blue-400">{{ getResourceAmount('linh_thach') }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-game-text-secondary">Nguyên Thạch</p>
              <p class="text-lg font-semibold text-green-400">{{ getResourceAmount('nguyen_thach') }}</p>
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
      <!-- Tabs -->
      <div class="mb-8">
        <div class="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :class="[
              'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300',
              activeTab === tab.name
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <span class="text-lg">{{ tab.icon }}</span>
              <span>{{ tab.displayName }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- My Beasts Tab -->
      <div v-if="activeTab === 'beasts'" class="space-y-8">
        <!-- Beast Stats -->
        <div class="game-card p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-white mb-4">Thống Kê Linh Thú</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">{{ spiritBeasts.length }}</div>
              <div class="text-sm text-game-text-secondary">Tổng Linh Thú</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-400">{{ getActiveBeasts.length }}</div>
              <div class="text-sm text-game-text-secondary">Đang Hoạt Động</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-400">{{ getFightingBeasts.length }}</div>
              <div class="text-sm text-game-text-secondary">Đang Chiến Đấu</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-400">{{ getAverageLevel }}</div>
              <div class="text-sm text-game-text-secondary">Cấp Trung Bình</div>
            </div>
          </div>
        </div>

        <!-- Beasts Grid -->
        <div v-if="spiritBeasts.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🐾</div>
          <div class="text-xl text-white mb-2">Chưa có linh thú nào</div>
          <div class="text-game-text-secondary">Hãy đi săn để thu thập linh thú!</div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="beast in spiritBeasts"
            :key="beast.id"
            class="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <span class="text-3xl">{{ beast.type.icon }}</span>
                <div>
                  <h3 class="text-lg font-semibold text-white">{{ beast.name }}</h3>
                  <div class="flex items-center space-x-2">
                    <span 
                      class="px-2 py-1 rounded text-xs font-semibold"
                      :style="{ 
                        backgroundColor: getCategoryColor(beast.type.category) + '20',
                        color: getCategoryColor(beast.type.category)
                      }"
                    >
                      {{ beast.type.category.toUpperCase() }}
                    </span>
                    <span class="text-xs text-game-text-secondary">Cấp {{ beast.level }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Beast Status -->
            <div class="mb-4 space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">Sức khỏe:</span>
                <div class="flex items-center space-x-2">
                  <div class="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-red-500 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${beast.health}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-white">{{ beast.health }}%</span>
                </div>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">Hạnh phúc:</span>
                <div class="flex items-center space-x-2">
                  <div class="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${beast.happiness}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-white">{{ beast.happiness }}%</span>
                </div>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-game-text-secondary">Độ no:</span>
                <div class="flex items-center space-x-2">
                  <div class="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-green-500 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${beast.hunger}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-white">{{ beast.hunger }}%</span>
                </div>
              </div>
            </div>

            <!-- Beast Stats -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-white mb-2">Thống kê:</h4>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div
                  v-for="(value, stat) in getBeastStats(beast)"
                  :key="stat"
                  class="flex justify-between"
                >
                  <span class="text-game-text-secondary">{{ stat }}:</span>
                  <span class="text-white">{{ value }}</span>
                </div>
              </div>
            </div>

            <!-- Beast Actions -->
            <div class="flex space-x-2">
              <button
                @click="openFeedModal(beast)"
                :disabled="beast.hunger >= 100"
                class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"
              >
                Cho Ăn
              </button>
              <button
                @click="playWithBeast(beast)"
                :disabled="beast.happiness >= 100"
                class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"
              >
                Chơi
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hunting Tab -->
      <div v-if="activeTab === 'hunting'" class="space-y-8">
        <div class="game-card p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-white mb-4">Khu Vực Săn</h2>
          <div v-if="huntingGrounds.length === 0" class="text-center py-8">
            <div class="text-game-text-secondary">Chưa có khu vực săn nào</div>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="ground in huntingGrounds"
              :key="ground.id"
              class="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white">{{ ground.displayName }}</h3>
                <span class="text-2xl">{{ ground.icon }}</span>
              </div>
              
              <p class="text-sm text-game-text-secondary mb-4">{{ ground.description }}</p>
              
              <div class="mb-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-game-text-secondary">Cấp độ yêu cầu:</span>
                  <span class="text-sm text-white">{{ ground.level }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-game-text-secondary">Độ khó:</span>
                  <span 
                    class="text-sm font-semibold"
                    :style="{ color: getDifficultyColor(ground.difficulty) }"
                  >
                    {{ ground.difficulty.toUpperCase() }}
                  </span>
                </div>
              </div>

              <button
                @click="huntAtGround(ground)"
                :disabled="!canHuntAtGround(ground, player?.level || 0) || loading"
                class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"
              >
                {{ canHuntAtGround(ground, player?.level || 0) ? 'Đi Săn' : `Cần cấp ${ground.level}` }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feeding Tab -->
      <div v-if="activeTab === 'feeding'" class="space-y-8">
        <div class="game-card p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-white mb-4">Thức Ăn Linh Thú</h2>
          <div v-if="foods.length === 0" class="text-center py-8">
            <div class="text-game-text-secondary">Chưa có thức ăn nào</div>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="food in foods"
              :key="food.id"
              class="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white">{{ food.displayName }}</h3>
                <span class="text-2xl">{{ food.icon }}</span>
              </div>
              
              <p class="text-sm text-game-text-secondary mb-4">{{ food.description }}</p>
              
              <div class="mb-4">
                <div class="flex justify-between mb-2">
                  <span class="text-sm text-game-text-secondary">Giá:</span>
                  <span class="text-sm text-white">{{ food.price.toLocaleString() }} {{ getCurrencyName(food.currency) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-game-text-secondary">Loại:</span>
                  <span class="text-sm text-white">{{ food.category }}</span>
                </div>
              </div>

              <button
                @click="openFeedModal(null, food)"
                class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold text-white"
              >
                Mua & Cho Ăn
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feed Modal -->
      <div v-if="showFeedModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-lg max-w-md w-full">
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 class="text-xl font-bold text-white">Cho Ăn Linh Thú</h2>
            <button @click="closeFeedModal" class="text-gray-400 hover:text-white text-2xl">
              ✕
            </button>
          </div>
          
          <div class="p-6">
            <div v-if="selectedBeast" class="mb-4">
              <div class="flex items-center space-x-3 mb-4">
                <span class="text-2xl">{{ selectedBeast.type.icon }}</span>
                <div>
                  <div class="text-white font-semibold">{{ selectedBeast.name }}</div>
                  <div class="text-sm text-game-text-secondary">{{ selectedBeast.type.displayName }}</div>
                </div>
              </div>
            </div>

            <div v-if="selectedFood" class="mb-4">
              <div class="flex items-center space-x-3 mb-4">
                <span class="text-2xl">{{ selectedFood.icon }}</span>
                <div>
                  <div class="text-white font-semibold">{{ selectedFood.displayName }}</div>
                  <div class="text-sm text-game-text-secondary">{{ selectedFood.description }}</div>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm text-game-text-secondary mb-2">Số lượng:</label>
                <input
                  v-model.number="feedQuantity"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full px-3 py-2 bg-gray-700 text-white rounded"
                />
              </div>
            </div>

            <div class="flex space-x-2">
              <button
                @click="confirmFeed"
                :disabled="loading"
                class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"
              >
                {{ loading ? 'Đang xử lý...' : 'Xác nhận' }}
              </button>
              <button
                @click="closeFeedModal"
                class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm font-semibold text-white"
              >
                Hủy
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
const spiritBeastStore = useSpiritBeastStore()

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const resources = computed(() => playerStore.resources)
const spiritBeasts = computed(() => spiritBeastStore.spiritBeasts)
const beastTypes = computed(() => spiritBeastStore.beastTypes)
const foods = computed(() => spiritBeastStore.foods)
const huntingGrounds = computed(() => spiritBeastStore.huntingGrounds)
const recentHunting = computed(() => spiritBeastStore.recentHunting)
const loading = computed(() => spiritBeastStore.loading)
const error = computed(() => spiritBeastStore.error)

// State
const activeTab = ref('beasts')
const showFeedModal = ref(false)
const selectedBeast = ref(null)
const selectedFood = ref(null)
const feedQuantity = ref(1)

// Tabs
const tabs = [
  { name: 'beasts', displayName: 'Linh Thú', icon: '🐾' },
  { name: 'hunting', displayName: 'Săn Bắt', icon: '🏹' },
  { name: 'feeding', displayName: 'Cho Ăn', icon: '🍖' }
]

// Computed
const getActiveBeasts = computed(() => spiritBeastStore.getActiveBeasts())
const getFightingBeasts = computed(() => spiritBeastStore.getFightingBeasts())
const getAverageLevel = computed(() => {
  if (spiritBeasts.value.length === 0) return 0
  const totalLevel = spiritBeasts.value.reduce((sum, beast) => sum + beast.level, 0)
  return Math.round(totalLevel / spiritBeasts.value.length)
})

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount).toLocaleString() : '0'
}

const getCategoryColor = (category) => spiritBeastStore.getCategoryColor(category)
const getDifficultyColor = (difficulty) => spiritBeastStore.getDifficultyColor(difficulty)
const canHuntAtGround = (ground, playerLevel) => spiritBeastStore.canHuntAtGround(ground, playerLevel)
const getBeastStats = (beast) => spiritBeastStore.getBeastStats(beast)

const getCurrencyName = (currency) => {
  const currencies = {
    tien_ngoc: 'Tiên Ngọc',
    linh_thach: 'Linh Thạch',
    nguyen_thach: 'Nguyên Thạch'
  }
  return currencies[currency] || currency
}

const huntAtGround = async (ground) => {
  if (!player.value?.id) return
  
  try {
    const result = await spiritBeastStore.huntBeast(player.value.id, ground.id)
    
    if (result.success) {
      console.log(`Săn thành công tại ${ground.displayName}!`)
      if (result.beast) {
        console.log(`Bắt được: ${result.beast.name}`)
      }
    } else {
      console.log(`Săn thất bại tại ${ground.displayName}`)
    }
  } catch (err) {
    console.error('Lỗi săn linh thú:', err)
  }
}

const openFeedModal = (beast, food) => {
  selectedBeast.value = beast
  selectedFood.value = food
  showFeedModal.value = true
  feedQuantity.value = 1
}

const closeFeedModal = () => {
  showFeedModal.value = false
  selectedBeast.value = null
  selectedFood.value = null
  feedQuantity.value = 1
}

const confirmFeed = async () => {
  if (!player.value?.id || !selectedBeast.value || !selectedFood.value) return
  
  try {
    await spiritBeastStore.feedBeast(
      player.value.id,
      selectedBeast.value.id,
      selectedFood.value.id,
      feedQuantity.value
    )
    
    // Refresh player resources
    await playerStore.fetchResources(player.value.id)
    
    console.log(`Cho ăn thành công: ${selectedBeast.value.name}`)
    closeFeedModal()
  } catch (err) {
    console.error('Lỗi cho ăn:', err)
  }
}

const playWithBeast = async (beast) => {
  // Logic chơi với linh thú
  console.log(`Chơi với ${beast.name}`)
}

const handleLogout = () => {
  authStore.logout()
  playerStore.reset()
  spiritBeastStore.reset()
}

// Initialize on mount
onMounted(async () => {
  authStore.initializeAuth()
  
  if (isAuthenticated.value && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await spiritBeastStore.fetchSpiritBeastStatus(authStore.user.player.id)
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await spiritBeastStore.fetchSpiritBeastStatus(authStore.user.player.id)
  } else {
    spiritBeastStore.reset()
  }
})
</script>
