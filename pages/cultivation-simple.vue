<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-8">🧘 Tu Luyện Cơ Bản</h1>
        <p class="text-gray-300 mb-8">Hệ thống tu luyện với 7 cảnh giới và 15 tầng mỗi cảnh giới</p>
        
        <!-- Cultivation Status -->
        <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 max-w-4xl mx-auto mb-8">
          <h2 class="text-2xl font-bold text-white mb-6">Trạng Thái Tu Luyện</h2>
          
          <!-- Current Level -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-semibold text-white">{{ currentRealmDisplay }}</h3>
              <span class="text-sm text-gray-400">Tầng {{ currentFloor }}/15</span>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div 
                class="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                :style="{ width: `${Math.min(100, (currentExp / expToNextFloor) * 100)}%` }"
              ></div>
            </div>
            
            <div class="flex justify-between text-sm text-gray-400">
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
              <h4 class="text-sm font-semibold text-white mb-1">Trạng thái</h4>
              <p v-if="canBreakthroughFloor" class="text-lg text-green-400 font-semibold">Sẵn sàng lên tầng!</p>
              <p v-else class="text-lg text-yellow-400">Cần thêm {{ (expToNextFloor - currentExp).toLocaleString() }} EXP</p>
            </div>
            
            <div class="bg-gray-800/50 p-4 rounded-lg">
              <h4 class="text-sm font-semibold text-white mb-1">Tổng EXP cần</h4>
              <p class="text-lg text-red-400">{{ totalExpToMax().toLocaleString() }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4 justify-center">
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

        <!-- Realm Progress -->
        <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30 max-w-6xl mx-auto mb-8">
          <h2 class="text-2xl font-bold text-white mb-6">📈 Tiến Độ Cảnh Giới</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
              v-for="realmIndex in 7"
              :key="realmIndex"
              class="bg-gray-800/50 p-4 rounded-lg border-2"
              :class="[
                realmIndex === currentRealm ? 'border-purple-500 bg-purple-900/20' :
                realmIndex < currentRealm ? 'border-green-500 bg-green-900/20' :
                'border-gray-500 bg-gray-900/20'
              ]"
            >
              <h3 class="text-lg font-bold text-white mb-2">
                {{ getRealmName(realmIndex) }}
              </h3>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">Trạng thái:</span>
                  <span 
                    :class="[
                      realmIndex === currentRealm ? 'text-purple-400' :
                      realmIndex < currentRealm ? 'text-green-400' :
                      'text-gray-400'
                    ]"
                  >
                    {{
                      realmIndex === currentRealm ? 'Đang tu luyện' :
                      realmIndex < currentRealm ? 'Đã hoàn thành' :
                      'Chưa mở khóa'
                    }}
                  </span>
                </div>
                
                <div v-if="realmIndex === currentRealm" class="flex justify-between">
                  <span class="text-gray-400">Tầng hiện tại:</span>
                  <span class="text-white">{{ currentFloor }}/15</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-400">EXP/ngày:</span>
                  <span class="text-blue-400">{{ expPerDay(realmIndex).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-8">
          <NuxtLink to="/cultivation" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mr-4">
            🧘 Tu Luyện Đầy Đủ
          </NuxtLink>
          <NuxtLink to="/" class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            🏠 Trở Về Trang Chủ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Stores
const cultivationStore = useCultivationStore()

// Computed
const currentRealmDisplay = computed(() => cultivationStore.currentRealmDisplay)
const currentRealm = computed(() => cultivationStore.currentRealm)
const currentFloor = computed(() => cultivationStore.currentFloor)
const currentExp = computed(() => cultivationStore.currentExp)
const expToNextFloor = computed(() => cultivationStore.expToNextFloor)
const canBreakthroughFloor = computed(() => cultivationStore.canBreakthroughFloor)
const canBreakthroughRealm = computed(() => cultivationStore.canBreakthroughRealm)
const currentFloorSuccessRate = computed(() => cultivationStore.currentFloorSuccessRate)
const isMaxLevel = computed(() => cultivationStore.isMaxLevel)
const expPerDayCurrent = computed(() => cultivationStore.expPerDayCurrent)

// Methods
const getRealmName = (realmIndex) => {
  const realmNames = ['Luyện Khí', 'Trúc Cơ', 'Kim Đan', 'Nguyên Anh', 'Hóa Thần', 'Hợp Thể', 'Đại Thừa']
  return realmNames[realmIndex - 1] || 'Unknown'
}

const expPerDay = (realmIndex) => {
  const BASE_EXP_PER_DAY = 2400000
  const REALM_GROWTH = 0.05
  return BASE_EXP_PER_DAY * Math.pow(1 + REALM_GROWTH, realmIndex - 1)
}

const totalExpToMax = () => {
  // Simplified calculation for display
  return 500000000 // Approximate total
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

// Set page title
useHead({
  title: 'Tu Luyện Cơ Bản - Tiên Lộ Thán'
})
</script>
