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
              <h1 class="text-2xl font-bold text-white">Tiên Lộ Thần</h1>
              <p class="text-sm text-gray-300">Game Tu Luyện</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm text-gray-300">Tài nguyên</p>
              <p class="text-lg font-bold text-yellow-400">1000 💎</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-300">Cấp độ</p>
              <p class="text-lg font-bold text-blue-400">1</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Welcome Message -->
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold text-white mb-4">Chào mừng đến với Tiên Lộ Thần!</h2>
        <p class="text-xl text-gray-300">Bắt đầu hành trình tu luyện của bạn</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <NuxtLink to="/cultivation" class="group">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform group-hover:scale-105">
            <div class="text-4xl mb-4">🧘</div>
            <h3 class="text-xl font-bold text-white mb-2">Tu Luyện</h3>
            <p class="text-gray-300">Nâng cao tu vi và sức mạnh</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/character" class="group">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform group-hover:scale-105">
            <div class="text-4xl mb-4">⚔️</div>
            <h3 class="text-xl font-bold text-white mb-2">Nhân Vật</h3>
            <p class="text-gray-300">Quản lý thông tin nhân vật</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/shop" class="group">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform group-hover:scale-105">
            <div class="text-4xl mb-4">🛒</div>
            <h3 class="text-xl font-bold text-white mb-2">Cửa Hàng</h3>
            <p class="text-gray-300">Mua sắm trang bị và vật phẩm</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/quest" class="group">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform group-hover:scale-105">
            <div class="text-4xl mb-4">📜</div>
            <h3 class="text-xl font-bold text-white mb-2">Nhiệm Vụ</h3>
            <p class="text-gray-300">Thực hiện nhiệm vụ để nhận thưởng</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Additional Features -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <NuxtLink to="/inventory" class="group">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform group-hover:scale-105">
            <div class="text-4xl mb-4">🎒</div>
            <h3 class="text-xl font-bold text-white mb-2">Túi Đồ</h3>
            <p class="text-gray-300">Quản lý vật phẩm</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/furnace" class="group">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform group-hover:scale-105">
            <div class="text-4xl mb-4">🔥</div>
            <h3 class="text-xl font-bold text-white mb-2">Lò Rèn</h3>
            <p class="text-gray-300">Chế tạo trang bị</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/spirit-beast" class="group">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform group-hover:scale-105">
            <div class="text-4xl mb-4">🐉</div>
            <h3 class="text-xl font-bold text-white mb-2">Linh Thú</h3>
            <p class="text-gray-300">Nuôi dưỡng linh thú</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/ranking" class="group">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform group-hover:scale-105">
            <div class="text-4xl mb-4">🏆</div>
            <h3 class="text-xl font-bold text-white mb-2">Xếp Hạng</h3>
            <p class="text-gray-300">Bảng xếp hạng</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Test Link -->
      <div class="text-center">
        <NuxtLink to="/test" class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          🧪 Test Page
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup>
// Simple home page without complex store logic
</script>