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
        <h1 class="text-4xl font-bold mb-4">🧘 Tu Luyện Cơ Bản</h1>
        <p class="text-game-text-secondary">Hệ thống tu luyện với 7 cảnh giới và 15 tầng mỗi cảnh giới</p>
      </div>

      <!-- Cultivation Status -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto mb-8">
        <h2 class="text-2xl font-bold text-white mb-6 text-center">Trạng Thái Tu Luyện</h2>
        
        <!-- Current Level -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xl font-semibold text-white">{{ cultivationStore.currentRealmDisplay }}</h3>
            <span class="text-sm text-game-text-secondary">Tầng {{ cultivationStore.currentFloor }}/15</span>
          </div>
          
          <!-- Progress Bar -->
          <div class="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div 
              class="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(100, (cultivationStore.currentExp / cultivationStore.expToNextFloor) * 100)}%` }"
            ></div>
          </div>
          
          <div class="flex justify-between text-sm text-game-text-secondary">
            <span>{{ cultivationStore.currentExp.toLocaleString() }} / {{ cultivationStore.expToNextFloor.toLocaleString() }} EXP</span>
            <span>{{ Math.round((cultivationStore.currentExp / cultivationStore.expToNextFloor) * 100) }}%</span>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-800/50 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-white mb-1">EXP/ngày</h4>
            <p class="text-lg text-blue-400">{{ cultivationStore.expPerDayCurrent.toLocaleString() }}</p>
          </div>
          
          <div class="bg-gray-800/50 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-white mb-1">Tỷ lệ thành công</h4>
            <p class="text-lg text-green-400">{{ Math.round(cultivationStore.currentFloorSuccessRate * 100) }}%</p>
          </div>
          
          <div class="bg-gray-800/50 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-white mb-1">Trạng thái</h4>
            <p v-if="cultivationStore.canBreakthroughFloor" class="text-lg text-green-400 font-semibold">
              <span v-if="cultivationStore.currentFloor >= 15">Có thể thử đột phá cảnh giới!</span>
              <span v-else>Sẵn sàng lên tầng!</span>
            </p>
            <p v-else class="text-lg text-yellow-400">Cần thêm {{ (cultivationStore.expToNextFloor - cultivationStore.currentExp).toLocaleString() }} EXP</p>
            <p v-if="cultivationStore.currentFloor >= 15" class="text-xs text-blue-400 mt-1">💡 Thất bại ở tầng 15 sẽ tự động lên cảnh giới tiếp theo!</p>
          </div>
          
          <div class="bg-gray-800/50 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-white mb-1">Cảnh giới hiện tại</h4>
            <p class="text-lg text-purple-400">{{ cultivationStore.currentRealm }}/9</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4 justify-center">
          <!-- Tầng 1-9: Đột phá tầng bình thường -->
          <button
            v-if="cultivationStore.canBreakthroughFloor && cultivationStore.currentFloor < 10"
            @click="attemptBreakthroughFloor"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
          >
            🚀 Đột Phá Tầng
          </button>

          <!-- Tầng 10: Lựa chọn đột phá -->
          <div v-if="cultivationStore.isAtFloor10" class="flex flex-col gap-2">
            <button
              @click="breakthroughRealmFromFloor10"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
            >
              🌟 Đột Phá Cảnh Giới (Hạ Phẩm)
            </button>
            <button
              @click="attemptHighFloorBreakthrough"
              class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
            >
              ⚡ Thử Tầng 11-15 (Phẩm Chất Cao)
            </button>
          </div>

          <!-- Tầng 11-14: Thử đột phá tầng cao -->
          <button
            v-if="cultivationStore.canAttemptHighFloors && cultivationStore.currentFloor >= 11 && cultivationStore.currentFloor < 15"
            @click="attemptHighFloorBreakthrough"
            class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
          >
            ⚡ Thử Đột Phá Tầng {{ cultivationStore.currentFloor + 1 }}
          </button>

          <!-- Tầng 15: Thử đột phá cảnh giới hoặc phi thăng -->
          <button
            v-if="cultivationStore.isAtFloor15 && !cultivationStore.canAscend"
            @click="attemptHighFloorBreakthrough"
            class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
          >
            🌟 Thử Đột Phá Cảnh Giới
          </button>

          <button
            v-if="cultivationStore.canAscend"
            @click="ascend"
            class="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg text-white font-bold text-lg"
          >
            🎉 PHI THĂNG!
          </button>
        </div>
      </div>

      <!-- Eternal Titles Display -->
      <div v-if="cultivationStore.eternalTitles.length > 0" class="mb-8">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30 max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6 text-center">🏆 Danh Hiệu Vĩnh Cửu</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="title in cultivationStore.eternalTitles"
              :key="`${title.realm}-${title.floor}`"
              class="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-4 rounded-lg border border-yellow-500/30"
            >
              <h3 class="text-lg font-bold text-yellow-400 mb-2">{{ title.name }}</h3>
              <p class="text-sm text-gray-300 mb-1">{{ title.description }}</p>
              <p class="text-xs text-gray-400">{{ getRealmName(title.realm) }} - Tầng {{ title.floor }}</p>
            </div>
          </div>
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

const attemptBreakthroughFloor = () => {
  const success = cultivationStore.attemptBreakthroughFloor()
  if (success) {
    console.log('Đột phá tầng thành công!')
  } else {
    console.log('Đột phá tầng thất bại!')
  }
}

const attemptBreakthroughRealm = () => {
  const success = cultivationStore.attemptBreakthroughRealm()
  if (success) {
    console.log('Đột phá cảnh giới thành công!')
  }
}

const breakthroughRealmFromFloor10 = () => {
  const success = cultivationStore.breakthroughRealmFromFloor10()
  if (success) {
    console.log('Đột phá cảnh giới từ tầng 10 thành công! (Hạ Phẩm)')
  }
}

const attemptHighFloorBreakthrough = () => {
  const success = cultivationStore.attemptHighFloorBreakthrough()
  if (success) {
    console.log('Đột phá tầng cao thành công!')
  } else {
    console.log('Thất bại, nhưng đã lên cảnh giới tiếp theo!')
  }
}

const ascend = () => {
  const success = cultivationStore.ascend()
  if (success) {
    console.log('🎉 Chúc mừng! Bạn đã Phi Thăng thành công!')
  }
}

const getRealmName = (realmIndex) => {
  const realmNames = ['Luyện Khí', 'Trúc Cơ', 'Kim Đan', 'Nguyên Anh', 'Hóa Thần', 'Luyện Hư', 'Hợp Thể', 'Đại Thừa', 'Độ Kiếp']
  return realmNames[realmIndex - 1] || 'Unknown'
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