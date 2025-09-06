<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Header -->
    <header class="bg-black/50 backdrop-blur-sm border-b border-purple-500/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-2xl font-bold text-white">
              🎒 Túi Đồ
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
      <!-- Inventory Stats -->
      <div class="mb-8">
        <div class="game-card p-6 rounded-lg">
          <h2 class="text-2xl font-bold text-white mb-4">Thống Kê Túi Đồ</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">{{ getTotalItems }}</div>
              <div class="text-sm text-game-text-secondary">Tổng Items</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-400">{{ Object.keys(groupedInventory).length }}</div>
              <div class="text-sm text-game-text-secondary">Loại Items</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-400">{{ getEquipmentCount }}</div>
              <div class="text-sm text-game-text-secondary">Trang Bị</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-400">{{ getConsumableCount }}</div>
              <div class="text-sm text-game-text-secondary">Tiêu Hao</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Item Categories -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">Danh Mục Items</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="category in itemCategories"
            :key="category.type"
            @click="selectedCategory = category.type"
            :class="[
              'p-4 rounded-lg border-2 transition-all duration-300',
              selectedCategory === category.type
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-600 bg-gray-800/50 hover:border-purple-400'
            ]"
          >
            <div class="text-center">
              <div class="text-3xl mb-2">{{ category.icon }}</div>
              <div class="text-sm font-semibold text-white">{{ category.name }}</div>
              <div class="text-xs text-game-text-secondary">{{ getItemCount(category.type) }} items</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-white">Đang tải túi đồ...</div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-400">Lỗi: {{ error }}</div>
      </div>

      <!-- Empty Inventory -->
      <div v-else-if="filteredItems.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📦</div>
        <div class="text-xl text-white mb-2">Túi đồ trống</div>
        <div class="text-game-text-secondary">Hãy mua sắm tại cửa hàng để có items!</div>
        <NuxtLink to="/shop" class="inline-block mt-4 game-button px-6 py-2 rounded-lg text-white font-semibold">
          🏪 Đến Cửa Hàng
        </NuxtLink>
      </div>

      <!-- Items Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{{ getItemTypeIcon(item.itemType) }}</span>
              <div>
                <h4 class="text-lg font-semibold text-white">{{ item.name }}</h4>
                <div class="text-xs text-game-text-secondary">{{ getItemTypeName(item.itemType) }}</div>
              </div>
            </div>
          </div>

          <!-- Equipment Stats -->
          <div v-if="item.itemType === 'equipment'" class="mb-3">
            <div class="text-sm text-game-text-secondary mb-2">Thống kê trang bị:</div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div v-for="(value, stat) in item.stats" :key="stat" class="flex justify-between">
                <span class="text-game-text-secondary">{{ getStatDisplayName(stat) }}:</span>
                <span class="text-white font-semibold" :style="{ color: getStatColor(stat) }">
                  +{{ value }}
                </span>
              </div>
            </div>
            <div class="mt-2 text-xs text-game-text-secondary">
              Slot: {{ getSlotDisplayName(item.equipmentSlot) }} | Cấp: {{ item.level }}
            </div>
          </div>

          <!-- Item Info -->
          <div class="mb-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-game-text-secondary">Số lượng:</span>
              <span class="text-sm font-semibold text-white">{{ item.quantity }}</span>
            </div>
            <div v-if="item.stackable" class="flex items-center justify-between">
              <span class="text-sm text-game-text-secondary">Có thể xếp chồng:</span>
              <span class="text-sm text-green-400">✓</span>
            </div>
            <div v-if="item.itemType === 'equipment'" class="flex items-center justify-between">
              <span class="text-sm text-game-text-secondary">Độ bền:</span>
              <span class="text-sm text-white">{{ item.durability || 100 }}/{{ item.maxDurability || 100 }}</span>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="useItem(item)"
              :disabled="!canUseItem(item)"
              class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold text-white"
            >
              Sử Dụng
            </button>
            <button
              @click="dropItem(item)"
              class="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold text-white"
            >
              Vứt
            </button>
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
const characterStore = useCharacterStore()

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const resources = computed(() => playerStore.resources)
const inventory = computed(() => shopStore.inventory)
const groupedInventory = computed(() => shopStore.groupedInventory)
const loading = computed(() => shopStore.loading)
const error = computed(() => shopStore.error)
const getTotalItems = computed(() => shopStore.getTotalItems)

// State
const selectedCategory = ref('all')

// Item categories
const itemCategories = [
  { type: 'all', name: 'Tất Cả', icon: '📦' },
  { type: 'equipment', name: 'Trang Bị', icon: '⚔️' },
  { type: 'consumable', name: 'Tiêu Hao', icon: '🧪' },
  { type: 'material', name: 'Nguyên Liệu', icon: '💎' },
  { type: 'skill', name: 'Kỹ Năng', icon: '📜' },
  { type: 'talent', name: 'Thiên Phú', icon: '⭐' }
]

// Computed
const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return inventory.value
  }
  return inventory.value.filter(item => item.itemType === selectedCategory.value)
})

const getEquipmentCount = computed(() => {
  return inventory.value.filter(item => item.itemType === 'equipment').length
})

const getConsumableCount = computed(() => {
  return inventory.value.filter(item => item.itemType === 'consumable').length
})

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount).toLocaleString() : '0'
}

const getItemTypeIcon = (itemType) => shopStore.getItemTypeIcon(itemType)

const getStatDisplayName = (stat) => {
  const stats = {
    hp: 'HP',
    mp: 'MP',
    attack: 'Tấn Công',
    defense: 'Phòng Thủ',
    speed: 'Tốc Độ',
    luck: 'May Mắn',
    wisdom: 'Trí Tuệ',
    strength: 'Sức Mạnh',
    agility: 'Nhanh Nhẹn',
    vitality: 'Sinh Lực',
    spirit: 'Tinh Thần'
  }
  return stats[stat] || stat
}

const getStatColor = (stat) => characterStore.getStatColor(stat)

const getSlotDisplayName = (slot) => characterStore.getSlotDisplayName(slot)

const getItemTypeName = (itemType) => {
  const types = {
    equipment: 'Trang Bị',
    consumable: 'Tiêu Hao',
    material: 'Nguyên Liệu',
    skill: 'Kỹ Năng',
    talent: 'Thiên Phú'
  }
  return types[itemType] || itemType
}

const getItemCount = (itemType) => {
  if (itemType === 'all') {
    return inventory.value.length
  }
  return inventory.value.filter(item => item.itemType === itemType).length
}

const canUseItem = (item) => {
  if (item.itemType === 'consumable') {
    return true
  }
  
  if (item.itemType === 'equipment') {
    const equipCheck = characterStore.canEquipItem(item, player.value?.level || 0)
    return equipCheck.canEquip
  }
  
  return false
}

const getUseItemReason = (item) => {
  if (item.itemType === 'equipment') {
    const equipCheck = characterStore.canEquipItem(item, player.value?.level || 0)
    return equipCheck.reason
  }
  return ''
}

const useItem = async (item) => {
  if (!canUseItem(item)) return
  
  try {
    if (item.itemType === 'equipment') {
      // Trang bị item
      await characterStore.equipItem(player.value.id, item.id)
      console.log(`Trang bị ${item.name}`)
    } else if (item.itemType === 'consumable') {
      // Sử dụng consumable
      console.log(`Sử dụng ${item.name}`)
      // TODO: Implement consumable logic
    }
    
    // Refresh inventory and character data
    if (player.value?.id) {
      await shopStore.fetchInventory(player.value.id)
      await characterStore.fetchCharacterData(player.value.id)
    }
  } catch (err) {
    console.error('Lỗi sử dụng item:', err)
  }
}

const dropItem = async (item) => {
  if (!confirm(`Bạn có chắc muốn vứt ${item.name}?`)) return
  
  try {
    // Logic vứt item
    console.log(`Vứt ${item.name}`)
    
    // Refresh inventory
    if (player.value?.id) {
      await shopStore.fetchInventory(player.value.id)
    }
  } catch (err) {
    console.error('Lỗi vứt item:', err)
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
    await shopStore.fetchInventory(authStore.user.player.id)
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await shopStore.fetchInventory(authStore.user.player.id)
  } else {
    shopStore.reset()
  }
})
</script>
