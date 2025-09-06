<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-white mb-4">🔧 Admin Panel</h1>
          <p class="text-xl text-gray-300">Quản lý database và dữ liệu game</p>
        </div>

        <!-- Database Status -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">📊 Database Status</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <p class="text-green-200 font-semibold">Resources</p>
              <p class="text-2xl font-bold text-green-400">{{ status.resources || 0 }}</p>
            </div>
            <div class="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
              <p class="text-blue-200 font-semibold">Companions</p>
              <p class="text-2xl font-bold text-blue-400">{{ status.companions || 0 }}</p>
            </div>
            <div class="bg-purple-500/20 border border-purple-500 rounded-lg p-4">
              <p class="text-purple-200 font-semibold">Quests</p>
              <p class="text-2xl font-bold text-purple-400">{{ status.quests || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Initialize Database -->
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 class="text-xl font-bold text-white mb-4">🗄️ Initialize Database</h3>
            <p class="text-gray-300 mb-4">Khởi tạo database và seed dữ liệu cơ bản</p>
            <button 
              @click="initializeDatabase"
              :disabled="loading"
              class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {{ loading ? 'Đang khởi tạo...' : 'Khởi tạo Database' }}
            </button>
          </div>

          <!-- Check Health -->
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 class="text-xl font-bold text-white mb-4">🏥 Check Health</h3>
            <p class="text-gray-300 mb-4">Kiểm tra trạng thái database và API</p>
            <button 
              @click="checkHealth"
              :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {{ loading ? 'Đang kiểm tra...' : 'Kiểm tra Health' }}
            </button>
          </div>
        </div>

        <!-- Results -->
        <div v-if="result" class="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 class="text-xl font-bold text-white mb-4">📋 Kết Quả</h3>
          <div class="bg-black/20 rounded-lg p-4">
            <pre class="text-green-400 text-sm">{{ JSON.stringify(result, null, 2) }}</pre>
          </div>
        </div>

        <!-- Navigation -->
        <div class="text-center mt-8">
          <NuxtLink to="/" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            ← Về Trang Chủ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)
const result = ref(null)
const status = ref({
  resources: 0,
  companions: 0,
  quests: 0
})

const initializeDatabase = async () => {
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/init-db', {
      method: 'POST'
    })
    
    result.value = response
    
    if (response.success) {
      // Update status
      status.value = response.data
    }
  } catch (error) {
    result.value = {
      success: false,
      error: error.message
    }
  } finally {
    loading.value = false
  }
}

const checkHealth = async () => {
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/health')
    result.value = response
  } catch (error) {
    result.value = {
      success: false,
      error: error.message
    }
  } finally {
    loading.value = false
  }
}

// Check initial status
onMounted(async () => {
  try {
    const response = await $fetch('/api/health')
    if (response.success && response.database) {
      status.value = {
        resources: response.database.resources || 0,
        companions: 0, // Will be updated after init
        quests: 0
      }
    }
  } catch (error) {
    console.log('Health check failed:', error)
  }
})
</script>
