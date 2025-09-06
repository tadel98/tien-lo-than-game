<template>
  <div v-if="!isAuthenticated" class="min-h-screen">
    <LoginForm />
  </div>
  
  <div v-else class="min-h-screen text-white">
    <!-- Header đơn giản -->
    <header class="bg-game-gray/80 backdrop-blur-sm border-b border-white/10">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Thông tin nhân vật -->
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <span class="text-lg font-bold">{{ player?.name?.charAt(0) || 'V' }}</span>
            </div>
            <div>
              <h2 class="text-lg font-semibold">{{ player?.name || 'Viễn Cổ Đại Năng' }}</h2>
              <p class="text-sm text-game-text-secondary">Cấp {{ player?.level || 1 }} | {{ player?.realm || 'Phàm cảnh' }}</p>
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

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4">⚔️ Nhiệm Vụ & Đánh Quái</h1>
        <p class="text-game-text-secondary">Hoàn thành nhiệm vụ và đánh quái để lên level</p>
      </div>

      <!-- Character chính -->
      <div class="flex justify-center mb-8">
        <div class="text-center">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mb-2 mx-auto">
            <span class="text-3xl">🧘</span>
          </div>
          <p class="text-lg font-semibold">{{ player?.name || 'Viễn Cổ Đại Năng' }}</p>
          <p class="text-sm text-game-text-secondary">Cấp {{ player?.level || 1 }} | {{ player?.realm || 'Phàm cảnh' }}</p>
        </div>
      </div>

      <!-- Grid layout đơn giản -->
      <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Quest & Combat Panel -->
        <div v-if="playerId">
          <QuestPanel :player-id="playerId" />
        </div>

        <!-- Character Stats Panel -->
        <div v-if="playerId">
          <CharacterPanel :player-id="playerId" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Stores
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const cultivationStore = useCultivationStore()

// State
const playerId = ref('')
const showLevelUpNotification = ref(false)
const levelUpData = ref({ levelGain: 0, newLevel: 0 })

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const player = computed(() => playerStore.player)

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount).toLocaleString() : '0'
}

const handleLogout = () => {
  authStore.logout()
  navigateTo('/')
}

const hideLevelUpNotification = () => {
  showLevelUpNotification.value = false
}

// Initialize
onMounted(async () => {
  if (isAuthenticated.value) {
    // Lấy playerId từ user.player.id
    playerId.value = authStore.user?.player?.id || authStore.user?.id
    
    if (playerId.value) {
      await playerStore.initializePlayer(playerId.value)
      await cultivationStore.fetchCultivationStatus(playerId.value)
    } else {
      console.error('Không tìm thấy playerId:', authStore.user)
    }
  }
})
</script>