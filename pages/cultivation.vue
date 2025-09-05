<template>
  <div v-if="!isAuthenticated" class="min-h-screen">
    <LoginForm />
  </div>
  
  <div v-else class="min-h-screen text-white">
    <!-- Level Up Notification -->
    <LevelUpNotification 
      :show="showLevelUpNotification"
      :level-gain="levelUpData.levelGain"
      :new-level="levelUpData.newLevel"
      @hide="hideLevelUpNotification"
    />
    <!-- Header với thông tin người chơi -->
    <header class="bg-game-gray/80 backdrop-blur-sm border-b border-white/10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Thông tin nhân vật -->
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <span class="text-lg font-bold">{{ player?.name?.charAt(0) || 'V' }}</span>
            </div>
            <div>
              <h2 class="text-lg font-semibold">{{ player?.name || 'Viễn Cổ Đại Năng' }}</h2>
              <p class="text-sm text-game-text-secondary">Cấp {{ player?.level || 138 }} | Chuyển: {{ player?.realm || 'Phàm cảnh' }}</p>
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

    <!-- Navigation Menu -->
    <nav class="bg-game-gray/60 backdrop-blur-sm border-b border-white/10">
      <div class="container mx-auto px-4 py-2">
        <!-- Tabs -->
        <div class="flex space-x-1 mb-4">
          <NuxtLink to="/character" class="px-4 py-2 text-game-text-secondary hover:text-white transition-colors">
            Nhân vật
          </NuxtLink>
          <button class="px-4 py-2 bg-game-light rounded-lg text-white font-medium">
            Tu Luyện
          </button>
        </div>

        <!-- Menu Icons -->
        <div class="grid grid-cols-7 gap-4">
          <div v-for="menuItem in menuItems" :key="menuItem.name" 
               @click="handleMenuClick(menuItem)"
               class="flex flex-col items-center p-3 rounded-lg hover:bg-game-light/50 transition-colors cursor-pointer"
               :class="{ 'bg-game-accent/20 border border-game-accent': menuItem.active }">
            <div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center mb-2">
              <span class="text-2xl">{{ menuItem.icon }}</span>
            </div>
            <span class="text-xs text-center">{{ menuItem.name }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4">🧘 Tu Luyện</h1>
        <p class="text-game-text-secondary">Nâng cao cấp độ và cảnh giới của bạn</p>
      </div>

      <!-- Character và companions -->
      <div class="flex items-center justify-center space-x-8 mb-8">
        <!-- Companion trái -->
        <div class="text-center">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center mb-2 mx-auto">
            <span class="text-2xl">🌸</span>
          </div>
          <p class="text-sm">Thiên Hoa Tiên Cơ</p>
          <span class="text-xs text-game-accent">+60</span>
        </div>

        <!-- Nhân vật chính -->
        <div class="text-center">
          <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mb-4 mx-auto">
            <div class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <span class="text-4xl">☯</span>
            </div>
          </div>
        </div>

        <!-- Companion phải -->
        <div class="text-center">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center mb-2 mx-auto">
            <span class="text-2xl">🐉</span>
          </div>
          <p class="text-sm">Ngân Long</p>
          <span class="text-xs text-game-accent">+100</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="max-w-2xl mx-auto mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-game-text-secondary">Kinh Nghiệm</span>
          <span class="text-sm text-game-text-secondary">
            {{ Math.round(cultivationStore.progressPercentage) }}%
          </span>
        </div>
        <div class="w-full bg-game-light rounded-full h-4">
          <div 
            class="progress-bar h-4 rounded-full transition-all duration-500"
            :style="{ width: `${cultivationStore.progressPercentage}%` }"
          ></div>
        </div>
        <div class="flex justify-between items-center mt-1">
          <span class="text-sm">
            {{ cultivationStore.cultivationStatus?.cultivation?.currentExp?.toLocaleString() || '0' }}
          </span>
          <span class="text-sm">
            {{ cultivationStore.cultivationStatus?.cultivation?.nextLevelExp?.toLocaleString() || '0' }}
          </span>
        </div>
      </div>

      <!-- Status Text -->
      <div class="max-w-2xl mx-auto mb-8">
        <p class="text-lg font-semibold text-orange-400 mb-2">
          {{ autoCultivation ? 'Tự động tu luyện đang chạy...' : (cultivationStatus?.isCultivating ? 'Đang tu luyện...' : 'Đang nhập định, vận chuyển huyền công theo chu thiên...') }}
        </p>
        <p class="text-sm text-game-text-secondary italic">
          "Linh khí hội tụ, nguyên thần an định, thiên địa cảm ứng, đạo vận luân hồi."
        </p>
        <div v-if="autoCultivation" class="mt-2 text-xs text-green-400">
          ⚡ Tự động tu luyện mỗi 3 giây - Nhấn nút để dừng
        </div>
      </div>

      <!-- Cultivation Controls -->
      <div class="max-w-2xl mx-auto mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Tu luyện cơ bản -->
          <button
            @click="handleCultivation('basic')"
            :disabled="!canCultivate || loading"
            class="game-button py-3 px-6 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <div class="flex items-center justify-center space-x-2">
              <span class="text-xl">🧘</span>
                              <div class="text-left">
                  <div class="text-sm">Tu Luyện Cơ Bản</div>
                  <div class="text-xs opacity-80">100 Sức Mạnh Chiến Đấu</div>
                </div>
            </div>
          </button>

          <!-- Tu luyện nâng cao -->
          <button
            @click="handleCultivation('advanced')"
            :disabled="!canCultivate || loading"
            class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 px-6 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <div class="flex items-center justify-center space-x-2">
              <span class="text-xl">⚡</span>
                              <div class="text-left">
                  <div class="text-sm">Tu Luyện Nâng Cao</div>
                  <div class="text-xs opacity-80">500 Sức Mạnh Chiến Đấu</div>
                </div>
            </div>
          </button>

          <!-- Đột phá -->
          <button
            @click="handleBreakthrough"
            :disabled="!canBreakthrough || loading"
            class="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 py-3 px-6 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <div class="flex items-center justify-center space-x-2">
              <span class="text-xl">💥</span>
                              <div class="text-left">
                  <div class="text-sm">Đột Phá</div>
                  <div class="text-xs opacity-80">1000+ Sức Mạnh Chiến Đấu</div>
                </div>
            </div>
          </button>
        </div>

        <!-- Auto Cultivation Controls -->
        <div class="mt-6 p-4 bg-game-light/30 rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Tự Động Tu Luyện</h3>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-game-text-secondary">Trạng thái:</span>
              <span 
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="autoCultivation ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
              >
                {{ autoCultivation ? 'Đang chạy' : 'Tạm dừng' }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="toggleAutoCultivation('basic')"
              :disabled="!canCultivate || loading"
              class="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <div class="flex items-center justify-center space-x-2">
                <span class="text-lg">{{ autoCultivation ? '⏸️' : '▶️' }}</span>
                <span>{{ autoCultivation ? 'Dừng' : 'Bắt đầu' }} Tự Động</span>
              </div>
            </button>
            
            <button
              @click="toggleAutoCultivation('advanced')"
              :disabled="!canCultivate || loading"
              class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <div class="flex items-center justify-center space-x-2">
                <span class="text-lg">{{ autoCultivation ? '⏸️' : '⚡' }}</span>
                <span>{{ autoCultivation ? 'Dừng' : 'Bắt đầu' }} Nâng Cao</span>
              </div>
            </button>
          </div>
          
          <div class="mt-3 text-xs text-game-text-secondary">
            <p>• Tự động tu luyện mỗi 6 giây, mỗi lần +1000 EXP</p>
            <p>• Tự động level up khi đủ kinh nghiệm</p>
            <p>• Có thể dừng bất kỳ lúc nào</p>
          </div>
        </div>
      </div>

      <!-- Cultivation Info -->
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Thông tin cấp độ -->
          <div class="game-card p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-4 text-center">Thông Tin Tu Luyện</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-game-text-secondary">Cấp Độ:</span>
                <span class="text-xl font-bold" :style="{ color: realmColor }">
                  {{ cultivationStatus?.cultivation?.currentLevel || player?.level || 1 }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-game-text-secondary">Cảnh Giới:</span>
                <span class="text-lg font-semibold" :style="{ color: realmColor }">
                  {{ cultivationStatus?.cultivation?.realm || player?.realm || 'Phàm cảnh' }}
                </span>
              </div>
                              <div class="flex justify-between items-center">
                  <span class="text-game-text-secondary">Sức Mạnh Chiến Đấu:</span>
                  <span class="text-lg font-semibold text-purple-400">
                    {{ characterStore.combatPower?.toLocaleString() || '0' }}
                  </span>
                </div>
              <div class="flex justify-between items-center">
                <span class="text-game-text-secondary">Trạng thái:</span>
                <span class="text-sm" :class="canCultivate ? 'text-green-400' : 'text-red-400'">
                  {{ canCultivate ? 'Có thể tu luyện' : 'Không đủ tài nguyên' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Thông tin cảnh giới -->
          <div class="game-card p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-4 text-center">Tiến Độ Cảnh Giới</h3>
            <div v-if="realmProgress" class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-game-text-secondary">Cảnh giới hiện tại:</span>
                <span class="text-lg font-semibold" :style="{ color: realmColor }">
                  {{ cultivationStatus?.cultivation?.realm || 'Phàm cảnh' }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-game-text-secondary">Tiến độ:</span>
                <span class="text-lg font-semibold">
                  {{ realmProgress.current }}/{{ realmProgress.max }}
                </span>
              </div>
              <div class="w-full bg-game-light rounded-full h-3">
                <div 
                  class="h-3 rounded-full transition-all duration-500"
                  :style="{ 
                    width: `${realmProgress.percentage}%`,
                    background: `linear-gradient(90deg, ${realmColor} 0%, ${nextRealmColor} 100%)`
                  }"
                ></div>
              </div>
              <div class="text-center text-sm text-game-text-secondary">
                Cần cấp {{ nextRealmLevel }} để lên {{ nextRealm }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Stores
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const cultivationStore = useCultivationStore()
const characterStore = useCharacterStore()

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const resources = computed(() => playerStore.resources)
const cultivationStatus = computed(() => cultivationStore.cultivationStatus)
const loading = computed(() => cultivationStore.loading)
const canCultivate = computed(() => cultivationStore.canCultivate)
const canBreakthrough = computed(() => cultivationStore.canBreakthrough)
const autoCultivation = computed(() => cultivationStore.autoCultivation)

// Level up notification
const showLevelUpNotification = ref(false)
const levelUpData = ref({
  levelGain: 0,
  newLevel: 0
})

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount).toLocaleString() : '0'
}

const handleLogout = () => {
  authStore.logout()
  playerStore.reset()
  cultivationStore.reset()
}

const handleMenuClick = (menuItem) => {
  if (menuItem.route) {
    navigateTo(menuItem.route)
  } else {
    console.log(`${menuItem.name} chưa được phát triển`)
  }
}

// Cultivation methods
const realmColor = computed(() => {
  const realm = cultivationStatus.value?.cultivation?.realm || player.value?.realm || 'Phàm cảnh'
  return cultivationStore.getRealmColor(realm)
})

const realmProgress = computed(() => {
  return cultivationStatus.value?.cultivation?.realmProgress
})

const cultivationInfo = computed(() => {
  const level = cultivationStatus.value?.cultivation?.currentLevel || player.value?.level || 1
  return cultivationStore.getCultivationInfo(level)
})

const nextRealm = computed(() => cultivationInfo.value.nextRealm.name)
const nextRealmColor = computed(() => cultivationInfo.value.nextRealm.color)
const nextRealmLevel = computed(() => cultivationInfo.value.nextRealm.min)

const handleCultivation = async (type) => {
  try {
    const result = await cultivationStore.startCultivation(player.value.id, type)
    
    // Cập nhật tài nguyên trong player store
    await playerStore.fetchResources(player.value.id)
    
    // Hiển thị thông báo thành công
    if (result?.data) {
      console.log(`Tu luyện thành công! Nhận được ${result.data.experienceGain} kinh nghiệm`)
    }
  } catch (err) {
    console.error('Lỗi tu luyện:', err)
  }
}

const handleBreakthrough = async () => {
  try {
    const result = await cultivationStore.breakthrough(player.value.id)
    
    // Cập nhật tài nguyên trong player store
    await playerStore.fetchResources(player.value.id)
    
    // Hiển thị thông báo thành công
    if (result?.data?.breakthrough) {
      const { oldLevel, newLevel, oldRealm, newRealm, isRealmChange } = result.data.breakthrough
      console.log(`Đột phá thành công! Từ cấp ${oldLevel} lên cấp ${newLevel}`)
      if (isRealmChange) {
        console.log(`Chúc mừng! Đã lên cảnh giới mới: ${newRealm}`)
      }
    }
  } catch (err) {
    console.error('Lỗi đột phá:', err)
  }
}

const toggleAutoCultivation = (cultivationType) => {
  if (player.value?.id) {
    cultivationStore.toggleAutoCultivation(player.value.id, cultivationType)
  }
}

// Level up notification methods
const showLevelUp = (levelGain, newLevel) => {
  levelUpData.value = {
    levelGain,
    newLevel
  }
  showLevelUpNotification.value = true
}

const hideLevelUpNotification = () => {
  showLevelUpNotification.value = false
}

// Menu items data
const menuItems = [
  { name: 'Nhân vật', icon: '👤', active: false, route: '/character' },
  { name: 'Thiên Phú', icon: '⭐', active: false, route: '/talent' },
  { name: 'Cửa Hàng', icon: '🏠', active: false, route: '/shop' },
  { name: 'Túi', icon: '🎒', active: false, route: '/inventory' },
  { name: 'Tu Luyện', icon: '🧘', active: true },
  { name: 'Đạo Lô', icon: '🔥', active: false, route: '/furnace' },
  { name: 'Linh Thú', icon: '🐾', active: false, route: '/spirit-beast' },
  { name: 'Đạo Lữ', icon: '👥', active: false },
  { name: 'Pháp Bảo', icon: '⚔️', active: false },
  { name: 'Luyện Đan', icon: '⚗️', active: false },
  { name: 'Luyện Khí', icon: '🔨', active: false },
  { name: 'Trận pháp', icon: '🔮', active: false },
  { name: 'Xếp Hạng', icon: '🏆', active: false, route: '/ranking' },
  { name: 'Danh hiệu', icon: '👑', active: false },
  { name: 'Nhiệm Vụ', icon: '📋', active: false, route: '/quest' },
  { name: 'Nạp Thẻ', icon: '🏛️', active: false }
]

// Initialize on mount
onMounted(async () => {
  authStore.initializeAuth()
  
  if (isAuthenticated.value && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await cultivationStore.fetchCultivationStatus(authStore.user.player.id)
    
    // Tự động bắt đầu tu luyện cơ bản khi vào trang
    if (canCultivate.value) {
      cultivationStore.startAutoCultivation(authStore.user.player.id, 'basic')
    }
  }
  
  // Listen for level up events
  if (typeof window !== 'undefined') {
    window.addEventListener('levelUp', (event) => {
      const { levelGain, newLevel } = event.detail
      showLevelUp(levelGain, newLevel)
    })
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await cultivationStore.fetchCultivationStatus(authStore.user.player.id)
    
    // Tự động bắt đầu tu luyện cơ bản khi đăng nhập
    if (canCultivate.value) {
      cultivationStore.startAutoCultivation(authStore.user.player.id, 'basic')
    }
  } else {
    cultivationStore.reset()
  }
})

// Dừng auto-cultivation khi rời khỏi trang
onBeforeUnmount(() => {
  cultivationStore.stopAutoCultivation()
  
  // Cleanup event listener
  if (typeof window !== 'undefined') {
    window.removeEventListener('levelUp', () => {})
  }
})
</script>
