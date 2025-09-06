<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Header -->
    <header class="bg-black/50 backdrop-blur-sm border-b border-purple-500/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-2xl font-bold text-white">
              🧘 Tu Luyện Nâng Cao
            </NuxtLink>
          </div>

          <!-- Player Info -->
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <p class="text-sm text-game-text-secondary">Cảnh Giới</p>
              <p class="text-lg font-semibold text-purple-400">{{ currentRealmDisplay }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-game-text-secondary">EXP</p>
              <p class="text-lg font-semibold text-blue-400">{{ currentExp.toLocaleString() }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-game-text-secondary">Tỷ Lệ Thành Công</p>
              <p class="text-lg font-semibold text-green-400">{{ Math.round(currentFloorSuccessRate * 100) }}%</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <NuxtLink to="/cultivation" class="game-button px-6 py-2 rounded-lg text-white font-semibold">
              🧘 Tu Luyện Cơ Bản
            </NuxtLink>
            <NuxtLink to="/" class="game-button px-6 py-2 rounded-lg text-white font-semibold">
              🏠 Trang Chủ
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Cultivation Status -->
      <div class="mb-8">
        <div class="game-card p-6 rounded-lg border-2 border-purple-500">
          <h2 class="text-2xl font-bold text-white mb-4">🧘 Trạng Thái Tu Luyện</h2>
          
          <!-- Current Level -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-semibold text-white">{{ currentRealmDisplay }}</h3>
              <span class="text-sm text-game-text-secondary">Tầng {{ currentFloor }}/{{ FLOORS }}</span>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div 
                class="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                :style="{ width: `${Math.min(100, (currentExp / expToNextFloor) * 100)}%` }"
              ></div>
            </div>
            
            <div class="flex justify-between text-sm text-game-text-secondary">
              <span>{{ currentExp.toLocaleString() }} / {{ expToNextFloor.toLocaleString() }} EXP</span>
              <span>{{ Math.round((currentExp / expToNextFloor) * 100) }}%</span>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-gray-800/50 p-4 rounded-lg">
              <h4 class="text-sm font-semibold text-white mb-1">EXP/ngày</h4>
              <p class="text-lg text-blue-400">{{ expPerDayCurrent.toLocaleString() }}</p>
            </div>
            
            <div class="bg-gray-800/50 p-4 rounded-lg">
              <h4 class="text-sm font-semibold text-white mb-1">Tỷ lệ thành công</h4>
              <p class="text-lg text-green-400">{{ Math.round(currentFloorSuccessRate * 100) }}%</p>
            </div>
            
            <div class="bg-gray-800/50 p-4 rounded-lg">
              <h4 class="text-sm font-semibold text-white mb-1">Ngày đến tầng tiếp</h4>
              <p class="text-lg text-yellow-400">{{ daysToNextFloor }} ngày</p>
            </div>
            
            <div class="bg-gray-800/50 p-4 rounded-lg">
              <h4 class="text-sm font-semibold text-white mb-1">Ngày đến cảnh giới tiếp</h4>
              <p class="text-lg text-red-400">{{ daysToNextRealm }} ngày</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4">
            <button
              v-if="canBreakthroughFloor"
              @click="attemptBreakthroughFloor"
              class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
            >
              🚀 Đột Phá Tầng
            </button>
            
            <button
              v-if="canBreakthroughRealm"
              @click="attemptBreakthroughRealm"
              class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
            >
              🌟 Đột Phá Cảnh Giới
            </button>
            
            <button
              v-if="isMaxLevel"
              disabled
              class="px-6 py-3 bg-gray-600 rounded-lg text-white font-semibold cursor-not-allowed"
            >
              🏆 Đã Đạt Max Level
            </button>
          </div>
        </div>
      </div>

      <!-- Realm Progress -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">📈 Tiến Độ Cảnh Giới</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="realmIndex in REALMS"
            :key="realmIndex"
            class="game-card p-4 rounded-lg border-2"
            :class="[
              realmIndex === currentRealmIndex ? 'border-purple-500 bg-purple-900/20' :
              realmIndex < currentRealmIndex ? 'border-green-500 bg-green-900/20' :
              'border-gray-500 bg-gray-900/20'
            ]"
          >
            <h3 class="text-lg font-bold text-white mb-2">
              {{ getRealmName(realmIndex) }}
            </h3>
            
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-game-text-secondary">Trạng thái:</span>
                <span 
                  :class="[
                    realmIndex === currentRealmIndex ? 'text-purple-400' :
                    realmIndex < currentRealmIndex ? 'text-green-400' :
                    'text-gray-400'
                  ]"
                >
                  {{
                    realmIndex === currentRealmIndex ? 'Đang tu luyện' :
                    realmIndex < currentRealmIndex ? 'Đã hoàn thành' :
                    'Chưa mở khóa'
                  }}
                </span>
              </div>
              
              <div v-if="realmIndex === currentRealmIndex" class="flex justify-between">
                <span class="text-game-text-secondary">Tầng hiện tại:</span>
                <span class="text-white">{{ currentFloor }}/{{ FLOORS }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-game-text-secondary">EXP/ngày:</span>
                <span class="text-blue-400">{{ expPerDay(realmIndex).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cultivation Tips -->
      <div class="game-card p-6 rounded-lg border-2 border-blue-500">
        <h2 class="text-2xl font-bold text-white mb-4">💡 Mẹo Tu Luyện</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">🎯 Cách Tăng EXP</h3>
            <ul class="space-y-1 text-sm text-game-text-secondary">
              <li>• Săn quái để nhận EXP liên tục</li>
              <li>• Đánh boss để nhận EXP khủng</li>
              <li>• Hoàn thành nhiệm vụ hàng ngày</li>
              <li>• Sử dụng linh thạch để tăng tốc</li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">⚡ Đột Phá</h3>
            <ul class="space-y-1 text-sm text-game-text-secondary">
              <li>• Tầng 1-10: 100% thành công</li>
              <li>• Tầng 11-15: Có tỷ lệ thất bại</li>
              <li>• Tầng 15: Cần đột phá cảnh giới</li>
              <li>• Cảnh giới cao hơn = EXP/ngày nhiều hơn</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Stores
const cultivationStore = useCultivationStore()

// Computed
const currentRealmDisplay = computed(() => cultivationStore.currentRealmDisplay)
const currentFloor = computed(() => cultivationStore.currentFloor)
const currentExp = computed(() => cultivationStore.currentExp)
const expToNextFloor = computed(() => cultivationStore.expToNextFloor)
const canBreakthroughFloor = computed(() => cultivationStore.canBreakthroughFloor)
const canBreakthroughRealm = computed(() => cultivationStore.canBreakthroughRealm)
const currentFloorSuccessRate = computed(() => cultivationStore.currentFloorSuccessRate)
const isMaxLevel = computed(() => cultivationStore.isMaxLevel)
const expPerDayCurrent = computed(() => cultivationStore.expPerDayCurrent)
const daysToNextFloor = computed(() => cultivationStore.daysToNextFloor)
const daysToNextRealm = computed(() => cultivationStore.daysToNextRealm)

// Constants
const REALMS = 7
const FLOORS = 15

// Methods
const getRealmName = (realmIndex) => cultivationStore.getRealmName(realmIndex)
const expPerDay = (realmIndex) => cultivationStore.expPerDay(realmIndex)

const attemptBreakthroughFloor = () => {
  const success = cultivationStore.attemptBreakthrough()
  if (success) {
    // Show success message
    console.log('Đột phá tầng thành công!')
  } else {
    // Show failure message
    console.log('Đột phá tầng thất bại!')
  }
}

const attemptBreakthroughRealm = () => {
  const success = cultivationStore.breakthroughRealm()
  if (success) {
    // Show success message
    console.log('Đột phá cảnh giới thành công!')
  }
}

// Set page title
useHead({
  title: 'Tu Luyện Nâng Cao - Tiên Lộ Thán'
})
</script>
