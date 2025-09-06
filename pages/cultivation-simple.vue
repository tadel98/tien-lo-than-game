<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <!-- Header -->
    <header class="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span class="text-2xl">⚡</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Tu Luyện Đơn Giản</h1>
              <p class="text-sm text-gray-300">Test Auto Cultivation</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              ← Về Trang Chủ
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Player Info -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 class="text-2xl font-bold text-white mb-4">📊 Thông Tin Người Chơi</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
              <p class="text-blue-200 font-semibold">Level</p>
              <p class="text-2xl font-bold text-blue-400">{{ playerData.level || 1 }}</p>
            </div>
            <div class="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <p class="text-green-200 font-semibold">Experience</p>
              <p class="text-2xl font-bold text-green-400">{{ playerData.experience || 0 }}</p>
            </div>
            <div class="bg-purple-500/20 border border-purple-500 rounded-lg p-4">
              <p class="text-purple-200 font-semibold">Combat Power</p>
              <p class="text-2xl font-bold text-purple-400">{{ playerData.combatPower || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto Cultivation Controls -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 class="text-2xl font-bold text-white mb-4">🧘 Auto Cultivation</h2>
          
          <!-- Status -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <span class="text-lg text-gray-300">Trạng thái:</span>
              <span 
                class="px-4 py-2 rounded-full text-sm font-semibold"
                :class="isAutoCultivating ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
              >
                {{ isAutoCultivating ? 'Đang chạy' : 'Tạm dừng' }}
              </span>
            </div>
            <div class="text-sm text-gray-400">
              Interval: {{ intervalTime }}s
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center space-x-4 mb-6">
            <button
              @click="startAutoCultivation"
              :disabled="isAutoCultivating || loading"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {{ loading ? 'Đang khởi động...' : 'Bắt Đầu Auto' }}
            </button>
            
            <button
              @click="stopAutoCultivation"
              :disabled="!isAutoCultivating"
              class="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Dừng Auto
            </button>

            <button
              @click="manualCultivate"
              :disabled="loading"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {{ loading ? 'Đang tu luyện...' : 'Tu Luyện Thủ Công' }}
            </button>
          </div>

          <!-- Progress -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-300">Tiến độ tu luyện</span>
              <span class="text-sm text-gray-300">{{ progressPercentage }}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-4">
              <div 
                class="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Logs -->
          <div class="bg-black/20 rounded-lg p-4 max-h-64 overflow-y-auto">
            <h3 class="text-lg font-semibold text-white mb-2">📝 Logs</h3>
            <div class="space-y-1">
              <div 
                v-for="(log, index) in logs" 
                :key="index"
                class="text-sm"
                :class="log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-gray-300'"
              >
                [{{ log.time }}] {{ log.message }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Test Database -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 class="text-2xl font-bold text-white mb-4">🔧 Test Database</h2>
          <div class="flex items-center space-x-4">
            <button
              @click="testDatabase"
              :disabled="loading"
              class="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {{ loading ? 'Đang test...' : 'Test Database' }}
            </button>
            
            <button
              @click="createTestPlayer"
              :disabled="loading"
              class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {{ loading ? 'Đang tạo...' : 'Tạo Test Player' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const loading = ref(false)
const isAutoCultivating = ref(false)
const intervalTime = ref(3)
const autoCultivationInterval = ref(null)
const playerData = ref({
  level: 1,
  experience: 0,
  combatPower: 0
})

const progressPercentage = ref(0)
const logs = ref([])

const addLog = (message, type = 'info') => {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift({ time, message, type })
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

const startAutoCultivation = () => {
  if (isAutoCultivating.value) return
  
  isAutoCultivating.value = true
  addLog('🚀 Bắt đầu auto cultivation...', 'success')
  
  autoCultivationInterval.value = setInterval(async () => {
    if (!isAutoCultivating.value) return
    
    try {
      await manualCultivate()
    } catch (error) {
      addLog(`❌ Lỗi auto cultivation: ${error.message}`, 'error')
    }
  }, intervalTime.value * 1000)
}

const stopAutoCultivation = () => {
  isAutoCultivating.value = false
  if (autoCultivationInterval.value) {
    clearInterval(autoCultivationInterval.value)
    autoCultivationInterval.value = null
  }
  addLog('⏹️ Dừng auto cultivation', 'info')
}

const manualCultivate = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    // Tạo test player nếu chưa có
    if (!playerData.value.id) {
      await createTestPlayer()
    }
    
    const response = await $fetch('/api/cultivation/auto-cultivate', {
      method: 'POST',
      body: {
        playerId: playerData.value.id,
        expGain: 1000
      }
    })
    
    if (response.success) {
      const { player, cultivation } = response.data
      playerData.value = {
        id: player.id,
        level: player.level,
        experience: player.experience,
        combatPower: player.combatPower || 0
      }
      
      // Tính progress percentage
      const currentLevel = player.level
      const requiredExp = Math.pow(currentLevel + 1, 2) * 1440
      const currentExp = player.experience
      const prevLevelExp = Math.pow(currentLevel, 2) * 1440
      progressPercentage.value = Math.min(100, ((currentExp - prevLevelExp) / (requiredExp - prevLevelExp)) * 100)
      
      if (cultivation.levelUp) {
        addLog(`🎉 Level Up! +${cultivation.levelGain} level(s) - Level ${cultivation.newLevel}`, 'success')
      } else {
        addLog(`⚡ Tu luyện +${cultivation.expGained} EXP - Level ${player.level}`, 'info')
      }
    }
  } catch (error) {
    addLog(`❌ Lỗi tu luyện: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const testDatabase = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/health')
    if (response.success) {
      addLog('✅ Database kết nối thành công!', 'success')
    } else {
      addLog('❌ Database kết nối thất bại!', 'error')
    }
  } catch (error) {
    addLog(`❌ Lỗi test database: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

const createTestPlayer = async () => {
  loading.value = true
  try {
    // Tạo test player đơn giản
    const testPlayer = {
      name: 'Test Player',
      level: 1,
      experience: 0,
      realm: 'Phàm cảnh',
      combatPower: 100
    }
    
    // Lưu vào localStorage để test
    localStorage.setItem('testPlayer', JSON.stringify(testPlayer))
    playerData.value = { ...testPlayer, id: 'test-player-' + Date.now() }
    
    addLog('✅ Tạo test player thành công!', 'success')
  } catch (error) {
    addLog(`❌ Lỗi tạo test player: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// Cleanup on unmount
onBeforeUnmount(() => {
  stopAutoCultivation()
})

// Load test player on mount
onMounted(() => {
  const savedPlayer = localStorage.getItem('testPlayer')
  if (savedPlayer) {
    const player = JSON.parse(savedPlayer)
    playerData.value = { ...player, id: 'test-player-' + Date.now() }
  }
  
  addLog('🎮 Trang cultivation đã sẵn sàng!', 'info')
})
</script>
