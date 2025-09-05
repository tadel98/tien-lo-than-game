<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Header -->
    <header class="bg-black/50 backdrop-blur-sm border-b border-purple-500/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-2xl font-bold text-white">
              🔥 Đạo Lô
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
      <!-- Furnace Status -->
      <div class="mb-8">
        <div class="game-card p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-white mb-4">Trạng Thái Lò Đạo</h2>
          <div v-if="furnaces.length === 0" class="text-center py-8">
            <div class="text-6xl mb-4">🔥</div>
            <div class="text-xl text-white mb-2">Chưa có lò đạo</div>
            <div class="text-game-text-secondary">Hãy mua lò đạo tại cửa hàng!</div>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="playerFurnace in furnaces"
              :key="playerFurnace.id"
              class="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-white">{{ playerFurnace.furnace.displayName }}</h3>
                <span class="text-2xl">{{ playerFurnace.furnace.icon }}</span>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-game-text-secondary">Cấp độ:</span>
                  <span class="text-sm text-white">{{ playerFurnace.level }}/{{ playerFurnace.furnace.maxLevel }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-game-text-secondary">Kinh nghiệm:</span>
                  <span class="text-sm text-white">{{ playerFurnace.experience }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-game-text-secondary">Hiệu suất:</span>
                  <span class="text-sm text-green-400">{{ (playerFurnace.furnace.efficiency * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Categories -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">Công Thức Chế Tạo</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            v-for="category in recipeCategories"
            :key="category.name"
            @click="selectedCategory = category.name"
            :class="[
              'p-4 rounded-lg border-2 transition-all duration-300',
              selectedCategory === category.name
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-600 bg-gray-800/50 hover:border-purple-400'
            ]"
          >
            <div class="text-center">
              <div class="text-3xl mb-2">{{ category.icon }}</div>
              <div class="text-sm font-semibold text-white">{{ category.displayName }}</div>
              <div class="text-xs text-game-text-secondary">{{ getRecipeCount(category.name) }} công thức</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-white">Đang tải công thức...</div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-400">Lỗi: {{ error }}</div>
      </div>

      <!-- Recipes Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          class="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{{ getCategoryIcon(recipe.category) }}</span>
              <div>
                <h3 class="text-lg font-semibold text-white">{{ recipe.displayName }}</h3>
                <div class="text-xs text-game-text-secondary">{{ getCategoryName(recipe.category) }}</div>
              </div>
            </div>
          </div>

          <p class="text-sm text-game-text-secondary mb-4">{{ recipe.description }}</p>

          <!-- Required Materials -->
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-white mb-2">Nguyên liệu cần:</h4>
            <div class="space-y-1">
              <div
                v-for="material in getRequiredMaterials(recipe)"
                :key="material.name"
                class="flex justify-between text-xs"
              >
                <span class="text-game-text-secondary">{{ material.name }}</span>
                <span class="text-white">{{ material.amount }}</span>
              </div>
            </div>
          </div>

          <!-- Craft Result -->
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-white mb-2">Kết quả:</h4>
            <div class="space-y-1">
              <div
                v-for="result in getCraftResult(recipe)"
                :key="result.name"
                class="flex justify-between text-xs"
              >
                <span class="text-game-text-secondary">{{ result.name }}</span>
                <span class="text-green-400">{{ result.amount }}</span>
              </div>
            </div>
          </div>

          <!-- Recipe Info -->
          <div class="mb-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-xs text-game-text-secondary">Cấp độ yêu cầu:</span>
              <span class="text-xs text-white">{{ recipe.level }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-game-text-secondary">Tỷ lệ thành công:</span>
              <span 
                class="text-xs font-semibold"
                :style="{ color: getSuccessRateColor(recipe.successRate) }"
              >
                {{ (recipe.successRate * 100).toFixed(1) }}%
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-game-text-secondary">Kinh nghiệm:</span>
              <span class="text-xs text-blue-400">{{ recipe.experience }}</span>
            </div>
          </div>

          <!-- Craft Button -->
          <button
            @click="craftItem(recipe)"
            :disabled="!canCraftRecipe(recipe) || loading"
            class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white transition-all duration-300"
          >
            {{ canCraftRecipe(recipe) ? 'Chế Tạo' : 'Thiếu nguyên liệu' }}
          </button>
        </div>
      </div>

      <!-- Recent Crafting History -->
      <div v-if="recentCrafting.length > 0" class="mt-12">
        <h2 class="text-2xl font-bold text-white mb-4">Lịch Sử Chế Tạo</h2>
        <div class="game-card p-6 rounded-lg">
          <div class="space-y-3">
            <div
              v-for="craft in recentCrafting"
              :key="craft.id"
              class="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <span class="text-lg">{{ getCategoryIcon(craft.recipe.category) }}</span>
                <div>
                  <div class="text-white font-semibold">{{ craft.recipe.displayName }}</div>
                  <div class="text-xs text-game-text-secondary">
                    {{ new Date(craft.createdAt).toLocaleString() }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div 
                  class="text-sm font-semibold"
                  :class="craft.success ? 'text-green-400' : 'text-red-400'"
                >
                  {{ craft.success ? 'Thành công' : 'Thất bại' }}
                </div>
                <div class="text-xs text-game-text-secondary">x{{ craft.quantity }}</div>
              </div>
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
const shopStore = useShopStore()
const furnaceStore = useFurnaceStore()

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const resources = computed(() => playerStore.resources)
const furnaces = computed(() => furnaceStore.furnaces)
const recipes = computed(() => furnaceStore.recipes)
const recentCrafting = computed(() => furnaceStore.recentCrafting)
const loading = computed(() => furnaceStore.loading)
const error = computed(() => furnaceStore.error)

// State
const selectedCategory = ref('all')

// Recipe categories
const recipeCategories = [
  { name: 'all', displayName: 'Tất Cả', icon: '🔧' },
  { name: 'alchemy', displayName: 'Luyện Đan', icon: '🧪' },
  { name: 'forging', displayName: 'Luyện Khí', icon: '🔨' },
  { name: 'crafting', displayName: 'Chế Tạo', icon: '⚒️' }
]

// Computed
const filteredRecipes = computed(() => {
  if (selectedCategory.value === 'all') {
    return recipes.value
  }
  return recipes.value.filter(recipe => recipe.category === selectedCategory.value)
})

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount).toLocaleString() : '0'
}

const getCategoryIcon = (category) => furnaceStore.getCategoryIcon(category)
const getCategoryName = (category) => furnaceStore.getCategoryName(category)
const getSuccessRateColor = (rate) => furnaceStore.getSuccessRateColor(rate)
const getRequiredMaterials = (recipe) => furnaceStore.getRequiredMaterials(recipe)
const getCraftResult = (recipe) => furnaceStore.getCraftResult(recipe)

const getRecipeCount = (category) => {
  if (category === 'all') {
    return recipes.value.length
  }
  return recipes.value.filter(recipe => recipe.category === category).length
}

const canCraftRecipe = (recipe) => {
  if (!player.value || player.value.level < recipe.level) return false
  return furnaceStore.canCraft(recipe, shopStore.inventory)
}

const craftItem = async (recipe) => {
  if (!player.value?.id) return
  
  try {
    const result = await furnaceStore.craftItem(player.value.id, recipe.id, 1)
    
    // Refresh inventory
    await shopStore.fetchInventory(player.value.id)
    
    if (result.success) {
      console.log(`Chế tạo thành công: ${recipe.displayName}`)
    } else {
      console.log(`Chế tạo thất bại: ${recipe.displayName}`)
    }
  } catch (err) {
    console.error('Lỗi chế tạo:', err)
  }
}

const handleLogout = () => {
  authStore.logout()
  playerStore.reset()
  shopStore.reset()
  furnaceStore.reset()
}

// Initialize on mount
onMounted(async () => {
  authStore.initializeAuth()
  
  if (isAuthenticated.value && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await shopStore.fetchInventory(authStore.user.player.id)
    await furnaceStore.fetchFurnaceStatus(authStore.user.player.id)
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await shopStore.fetchInventory(authStore.user.player.id)
    await furnaceStore.fetchFurnaceStatus(authStore.user.player.id)
  } else {
    furnaceStore.reset()
  }
})
</script>
