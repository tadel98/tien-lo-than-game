<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
      <h1 class="text-4xl font-bold text-white mb-4">🎮 Tiên Lộ Thần</h1>
      <p class="text-xl text-gray-200 mb-6">Game Tu Luyện - Test Page</p>
      <div class="space-y-4">
        <div class="bg-green-500/20 border border-green-500 rounded-lg p-4">
          <p class="text-green-200">✅ Ứng dụng đang hoạt động!</p>
        </div>
        <div class="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
          <p class="text-blue-200">🔧 Vercel deployment thành công!</p>
        </div>
        <NuxtLink to="/" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Về Trang Chủ
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Test page để kiểm tra deployment
</script>
