<template>
  <div v-if="!isAuthenticated" class="min-h-screen">
    <LoginForm />
  </div>
  
  <div v-else class="min-h-screen text-white">
    <!-- Header với thông tin người chơi -->
    <header class="bg-game-gray/80 backdrop-blur-sm border-b border-white/10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Thông tin nhân vật -->
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <span class="text-lg font-bold">{{ player?.name?.charAt(0) || 'V' }}</span>
            </div>
            <div>
              <h2 class="text-lg font-semibold">{{ player?.name || 'Viễn Cổ Đại Năng' }}</h2>
              <p class="text-sm text-game-text-secondary">Cấp {{ player?.level || 138 }} | Chuyển: {{ player?.realm || 'Phàm cảnh' }}</p>
            </div>
          </div>

          <!-- Tài nguyên -->
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

          <!-- Nút chức năng -->
          <div class="flex items-center space-x-2">
            <SaveButton />
            <NuxtLink to="/" class="game-button px-6 py-2 rounded-lg text-white font-semibold">
              🏠 Trang Chủ
            </NuxtLink>
            <button @click="handleLogout" class="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors">
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Menu -->
    <nav class="bg-game-gray/60 backdrop-blur-sm border-b border-white/10">
      <div class="container mx-auto px-4 py-2">
        <!-- Tabs -->
        <div class="flex space-x-1 mb-4">
          <button class="px-4 py-2 bg-game-light rounded-lg text-white font-medium">
            Nhân vật
          </button>
          <NuxtLink to="/cultivation" class="px-4 py-2 text-game-text-secondary hover:text-white transition-colors">
            Tu Luyện
          </NuxtLink>
        </div>

        <!-- Menu Icons -->
        <div class="grid grid-cols-7 gap-4">
          <div v-for="menuItem in menuItems" :key="menuItem.name" 
               @click="handleMenuClick(menuItem)"
               class="flex flex-col items-center p-3 rounded-lg hover:bg-game-light/50 transition-colors cursor-pointer"
               :class="{ 'bg-game-accent/20 border border-game-accent': menuItem.active }">
            <div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center mb-2">
              <span class="text-2xl">{{ menuItem.icon }}</span>
            </div>
            <span class="text-xs text-center">{{ menuItem.name }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4">👤 Thông Tin Nhân Vật</h1>
        <p class="text-game-text-secondary">Quản lý thuộc tính, trang bị và kỹ năng của bạn</p>
      </div>

      <!-- Character Panel -->
      <div class="max-w-6xl mx-auto">
        <CharacterPanel :player-id="player?.id" />
      </div>
    </main>
  </div>
</template>

<script setup>
// Stores
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const characterStore = useCharacterStore()

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const resources = computed(() => playerStore.resources)

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount).toLocaleString() : '0'
}

const handleLogout = () => {
  authStore.logout()
  playerStore.reset()
  characterStore.reset()
}

const handleMenuClick = (menuItem) => {
  if (menuItem.route) {
    navigateTo(menuItem.route)
  } else {
    console.log(`${menuItem.name} chưa được phát triển`)
  }
}

// Menu items data
const menuItems = [
  { name: 'Nhân vật', icon: '👤', active: true },
  { name: 'Thiên Phú', icon: '⭐', active: false, route: '/talent' },
  { name: 'Cửa Hàng', icon: '🏠', active: false, route: '/shop' },
  { name: 'Túi', icon: '🎒', active: false, route: '/inventory' },
  { name: 'Tu Luyện', icon: '🧘', active: false, route: '/cultivation' },
  { name: 'Đạo Lô', icon: '🔥', active: false, route: '/furnace' },
  { name: 'Linh Thú', icon: '🐾', active: false, route: '/spirit-beast' },
  { name: 'Đạo Lữ', icon: '👥', active: false },
  { name: 'Pháp Bảo', icon: '⚔️', active: false },
  { name: 'Luyện Đan', icon: '⚗️', active: false },
  { name: 'Luyện Khí', icon: '🔨', active: false },
  { name: 'Trận pháp', icon: '🔮', active: false },
  { name: 'Xếp Hạng', icon: '🏆', active: false, route: '/ranking' },
  { name: 'Danh hiệu', icon: '👑', active: false },
  { name: 'Nhiệm Vụ', icon: '📋', active: false, route: '/quest' },
  { name: 'Nạp Thẻ', icon: '🏛️', active: false }
]

// Initialize on mount
onMounted(async () => {
  authStore.initializeAuth()
  
  if (isAuthenticated.value && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await characterStore.fetchCharacterData(authStore.user.player.id)
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await characterStore.fetchCharacterData(authStore.user.player.id)
  } else {
    characterStore.reset()
  }
})
</script>
