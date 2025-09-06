<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-8">🧪 Test Page</h1>
        <p class="text-gray-300 mb-8">Trang test các tính năng</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <h3 class="text-xl font-bold text-white mb-2">Test API</h3>
            <p class="text-gray-300 mb-4">Kiểm tra các API endpoints</p>
            <button @click="testAPI" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold">
              Test
            </button>
          </div>
          
          <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <h3 class="text-xl font-bold text-white mb-2">Test Database</h3>
            <p class="text-gray-300 mb-4">Kiểm tra kết nối database</p>
            <button @click="testDatabase" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold">
              Test
            </button>
          </div>
          
          <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <h3 class="text-xl font-bold text-white mb-2">Test Stores</h3>
            <p class="text-gray-300 mb-4">Kiểm tra Pinia stores</p>
            <button @click="testStores" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold">
              Test
            </button>
          </div>
        </div>
        
        <div class="mt-8">
          <NuxtLink to="/" class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            🏠 Trở Về Trang Chủ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set page title
useHead({
  title: 'Test Page - Tiên Lộ Thán'
})

const testAPI = async () => {
  try {
    const response = await $fetch('/api/health')
    console.log('API Test Result:', response)
    alert('API Test: ' + JSON.stringify(response))
  } catch (error) {
    console.error('API Test Error:', error)
    alert('API Test Error: ' + error.message)
  }
}

const testDatabase = async () => {
  try {
    const response = await $fetch('/api/player/resources')
    console.log('Database Test Result:', response)
    alert('Database Test: ' + JSON.stringify(response))
  } catch (error) {
    console.error('Database Test Error:', error)
    alert('Database Test Error: ' + error.message)
  }
}

const testStores = () => {
  const authStore = useAuthStore()
  const playerStore = usePlayerStore()
  
  console.log('Auth Store:', authStore)
  console.log('Player Store:', playerStore)
  
  alert('Stores Test: Check console for details')
}
</script>
