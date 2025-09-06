<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-8">🧘 Tu Luyện Đơn Giản</h1>
        <p class="text-gray-300 mb-8">Phiên bản đơn giản của hệ thống tu luyện</p>
        
        <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 max-w-2xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-6">Trạng Thái Tu Luyện</h2>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Cấp độ hiện tại:</span>
              <span class="text-white font-semibold">1</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Kinh nghiệm:</span>
              <span class="text-white font-semibold">0 / 100</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Trạng thái:</span>
              <span class="text-green-400 font-semibold">Sẵn sàng tu luyện</span>
            </div>
          </div>
          
          <div class="mt-8">
            <button class="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold text-lg">
              🧘 Bắt Đầu Tu Luyện
            </button>
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
// Set page title
useHead({
  title: 'Tu Luyện Đơn Giản - Tiên Lộ Thán'
})
</script>
