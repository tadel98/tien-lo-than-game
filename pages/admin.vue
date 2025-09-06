<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white mb-8">🔧 Admin Panel</h1>
        <p class="text-gray-300 mb-8">Trang quản trị hệ thống</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
            <h3 class="text-xl font-bold text-white mb-2">Quản Lý Người Dùng</h3>
            <p class="text-gray-300 mb-4">Quản lý tài khoản người chơi</p>
            <button class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold">
              Mở
            </button>
          </div>
          
          <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
            <h3 class="text-xl font-bold text-white mb-2">Cấu Hình Game</h3>
            <p class="text-gray-300 mb-4">Thay đổi cài đặt game</p>
            <button class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold">
              Mở
            </button>
          </div>
          
          <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
            <h3 class="text-xl font-bold text-white mb-2">Thống Kê</h3>
            <p class="text-gray-300 mb-4">Xem thống kê hệ thống</p>
            <button class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold">
              Mở
            </button>
          </div>
        </div>
        
        <div class="mt-8">
          <NuxtLink to="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
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
  title: 'Admin Panel - Tiên Lộ Thán'
})
</script>
