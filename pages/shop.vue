<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Header -->
    <header class="bg-black/50 backdrop-blur-sm border-b border-purple-500/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-2xl font-bold text-white">
              🏪 Cửa Hàng
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
      <!-- Shop Categories -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">Danh Mục Cửa Hàng</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="category in shopCategories"
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
              <div class="text-xs text-game-text-secondary">{{ category.description }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Shop List -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-white">Đang tải cửa hàng...</div>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-400">Lỗi: {{ error }}</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="shop in filteredShops"
          :key="shop.id"
          class="game-card p-6 rounded-lg"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-white">{{ shop.displayName }}</h3>
            <span class="text-2xl">{{ shop.icon }}</span>
          </div>
          
          <p class="text-game-text-secondary mb-4">{{ shop.description }}</p>
          
          <div class="mb-4">
            <div class="text-sm text-game-text-secondary mb-2">Số lượng item: {{ shop.items.length }}</div>
            <div class="text-sm text-game-text-secondary">Loại: {{ getCategoryDisplayName(shop.category) }}</div>
          </div>

          <button
            @click="enterShop(shop)"
            class="w-full game-button py-2 px-4 rounded-lg text-white font-semibold"
          >
            Vào Cửa Hàng
          </button>
        </div>
      </div>

      <!-- Shop Items Modal -->
      <div v-if="currentShop" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{{ currentShop.icon }}</span>
              <h2 class="text-2xl font-bold text-white">{{ currentShop.displayName }}</h2>
            </div>
            <button @click="currentShop = null" class="text-gray-400 hover:text-white text-2xl">
              ✕
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 overflow-y-auto max-h-[60vh]">
            <div v-if="currentShop.items.length === 0" class="text-center py-8">
              <div class="text-game-text-secondary">Cửa hàng này chưa có item nào</div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="item in currentShop.items"
                :key="item.id"
                class="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">{{ getItemTypeIcon(item.itemType) }}</span>
                    <div>
                      <h4 class="text-lg font-semibold text-white">{{ item.displayName }}</h4>
                      <div class="flex items-center space-x-2">
                        <span 
                          class="px-2 py-1 rounded text-xs font-semibold"
                          :style="{ 
                            backgroundColor: getRarityColor(item.rarity) + '20',
                            color: getRarityColor(item.rarity)
                          }"
                        >
                          {{ item.rarity.toUpperCase() }}
                        </span>
                        <span class="text-xs text-game-text-secondary">Cấp {{ item.level }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p class="text-sm text-game-text-secondary mb-3">{{ item.description }}</p>

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="text-yellow-400 font-semibold">{{ item.price.toLocaleString() }}</span>
                    <span class="text-sm text-game-text-secondary">{{ getCurrencyName(item.currency) }}</span>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <input
                      v-model.number="purchaseQuantities[item.id]"
                      type="number"
                      min="1"
                      :max="item.stock === -1 ? 999 : item.stock"
                      class="w-16 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                    />
                    <button
                      @click="purchaseItem(item)"
                      :disabled="loading || !canPurchase(item)"
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"
                    >
                      Mua
                    </button>
                  </div>
                </div>

                <div v-if="item.stock !== -1" class="text-xs text-game-text-secondary mt-2">
                  Còn lại: {{ item.stock }}
                </div>
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

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const resources = computed(() => playerStore.resources)
const shops = computed(() => shopStore.shops)
const loading = computed(() => shopStore.loading)
const error = computed(() => shopStore.error)
const currentShop = computed(() => shopStore.currentShop)

// State
const selectedCategory = ref('all')
const purchaseQuantities = ref({})

// Shop categories
const shopCategories = [
  { name: 'all', displayName: 'Tất Cả', icon: '🏪', description: 'Xem tất cả cửa hàng' },
  { name: 'equipment', displayName: 'Trang Bị', icon: '⚔️', description: 'Vũ khí và áo giáp' },
  { name: 'consumables', displayName: 'Tiêu Hao', icon: '🧪', description: 'Thuốc và vật phẩm' },
  { name: 'materials', displayName: 'Nguyên Liệu', icon: '💎', description: 'Vật liệu chế tạo' }
]

// Computed
const filteredShops = computed(() => {
  if (selectedCategory.value === 'all') {
    return shops.value
  }
  return shops.value.filter(shop => shop.category === selectedCategory.value)
})

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount).toLocaleString() : '0'
}

const getCategoryDisplayName = (category) => {
  const cat = shopCategories.find(c => c.name === category)
  return cat ? cat.displayName : category
}

const getCurrencyName = (currency) => {
  const currencies = {
    tien_ngoc: 'Tiên Ngọc',
    linh_thach: 'Linh Thạch',
    nguyen_thach: 'Nguyên Thạch'
  }
  return currencies[currency] || currency
}

const getRarityColor = (rarity) => shopStore.getRarityColor(rarity)
const getItemTypeIcon = (itemType) => shopStore.getItemTypeIcon(itemType)

const enterShop = (shop) => {
  shopStore.setCurrentShop(shop)
  // Initialize purchase quantities
  shop.items.forEach(item => {
    purchaseQuantities.value[item.id] = 1
  })
}

const canPurchase = (item) => {
  const quantity = purchaseQuantities.value[item.id] || 1
  const totalCost = item.price * quantity
  
  const currencyResource = playerStore.getResourceByName(item.currency)
  if (!currencyResource) return false
  
  return Number(currencyResource.amount) >= totalCost && 
         (item.stock === -1 || item.stock >= quantity) &&
         player.value.level >= item.level
}

const purchaseItem = async (item) => {
  if (!player.value?.id) return
  
  const quantity = purchaseQuantities.value[item.id] || 1
  
  try {
    await shopStore.purchaseItem(player.value.id, currentShop.value.id, item.id, quantity)
    
    // Refresh player resources
    await playerStore.fetchResources(player.value.id)
    
    console.log(`Mua thành công ${item.displayName} x${quantity}`)
  } catch (err) {
    console.error('Lỗi mua hàng:', err)
  }
}

const handleLogout = () => {
  authStore.logout()
  playerStore.reset()
  shopStore.reset()
}

// Initialize on mount
onMounted(async () => {
  authStore.initializeAuth()
  
  if (isAuthenticated.value && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await shopStore.fetchShops()
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await shopStore.fetchShops()
  } else {
    shopStore.reset()
  }
})
</script>
