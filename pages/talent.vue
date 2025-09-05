<template>
  <div v-if="!isAuthenticated" class="min-h-screen">
    <LoginForm />
  </div>
  
  <div v-else class="min-h-screen text-white">
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
          <NuxtLink to="/cultivation" class="px-4 py-2 text-game-text-secondary hover:text-white transition-colors">
            Tu Luyện
          </NuxtLink>
          <button class="px-4 py-2 bg-game-light rounded-lg text-white font-medium">
            Thiên Phú
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
        <h1 class="text-4xl font-bold mb-4">⭐ Thiên Phú</h1>
        <p class="text-game-text-secondary">Kích hoạt và nâng cấp tài năng đặc biệt của bạn</p>
      </div>

      <!-- Tổng hiệu ứng -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="game-card p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4 text-center">Tổng Hiệu Ứng Thiên Phú</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="(value, effect) in totalEffects" :key="effect" 
                 v-if="value !== 0 && value !== 1"
                 class="bg-game-light/30 p-3 rounded-lg text-center">
              <div class="text-sm text-game-text-secondary mb-1">{{ getEffectDisplayName(effect) }}</div>
              <div class="text-lg font-semibold" :style="{ color: getEffectColor(effect) }">
                {{ formatEffectValue(effect, value) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs cho các loại thiên phú -->
      <div class="max-w-6xl mx-auto mb-8">
        <div class="flex space-x-2 mb-6">
          <button 
            v-for="type in talentTypes" 
            :key="type.id"
            @click="selectedType = type.id"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="selectedType === type.id ? 'bg-game-accent text-white' : 'bg-game-light/30 text-game-text-secondary hover:bg-game-light/50'"
          >
            <span class="mr-2">{{ type.icon }}</span>
            {{ type.displayName }}
          </button>
        </div>

        <!-- Danh sách thiên phú -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="talent in filteredTalents" 
            :key="talent.id"
            class="game-card p-6 rounded-lg"
            :class="{ 'opacity-50': !talent.isUnlocked }"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-full bg-game-light flex items-center justify-center">
                  <span class="text-2xl">{{ talent.icon }}</span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white">{{ talent.displayName }}</h4>
                  <div class="flex items-center space-x-2">
                    <span 
                      class="text-xs px-2 py-1 rounded"
                      :style="{ 
                        backgroundColor: getRarityColor(talent.rarity) + '20',
                        color: getRarityColor(talent.rarity)
                      }"
                    >
                      {{ talent.rarity?.toUpperCase() || 'COMMON' }}
                    </span>
                    <span 
                      class="text-xs px-2 py-1 rounded"
                      :style="{ 
                        backgroundColor: getTalentTypeColor(talent.type.name) + '20',
                        color: getTalentTypeColor(talent.type.name)
                      }"
                    >
                      {{ talent.type.displayName }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="talent.isUnlocked" class="flex items-center space-x-2">
                <button
                  @click="toggleTalent(player.id, talent.id, !talent.isActive)"
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  :class="talent.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'"
                >
                  {{ talent.isActive ? '✓' : '○' }}
                </button>
              </div>
            </div>

            <!-- Mô tả -->
            <p class="text-sm text-game-text-secondary mb-4">{{ talent.description }}</p>

            <!-- Level và hiệu ứng -->
            <div v-if="talent.isUnlocked" class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-game-text-secondary">Cấp độ:</span>
                <span class="text-sm font-semibold">{{ talent.level }}/{{ talent.maxLevel }}</span>
              </div>
              <div class="w-full bg-game-light rounded-full h-2 mb-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :style="{ 
                    width: `${(talent.level / talent.maxLevel) * 100}%`,
                    backgroundColor: getRarityColor(talent.rarity)
                  }"
                ></div>
              </div>
              <div class="text-xs text-game-text-secondary">
                Hiệu ứng: {{ formatTalentEffects(talent.effects, talent.level) }}
              </div>
            </div>

            <!-- Yêu cầu -->
            <div v-if="talent.requirements && !talent.isUnlocked" class="mb-4">
              <div class="text-xs text-game-text-secondary mb-2">Yêu cầu:</div>
              <div class="text-xs">
                <div v-if="talent.requirements.level">Cấp {{ talent.requirements.level }}</div>
                <div v-if="talent.requirements.realm">{{ talent.requirements.realm }}</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button
                v-if="!talent.isUnlocked"
                @click="unlockTalent(player.id, talent.id)"
                :disabled="!canUnlockTalent(talent, player.level, player.realm) || loading"
                class="flex-1 game-button py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mở Khóa ({{ talent.cost }} Tiên Ngọc)
              </button>
              <button
                v-else-if="canUpgradeTalent(talent)"
                @click="upgradeTalent(player.id, talent.id)"
                :disabled="loading"
                class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 px-4 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Nâng Cấp ({{ getTalentUpgradeCost(talent) }} Tiên Ngọc)
              </button>
              <button
                v-else
                disabled
                class="flex-1 bg-gray-500 py-2 px-4 rounded-lg text-white font-semibold cursor-not-allowed"
              >
                Đã Đạt Cấp Tối Đa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
// Stores
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const talentStore = useTalentStore()

// State
const selectedType = ref(null)

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const resources = computed(() => playerStore.resources)
const loading = computed(() => talentStore.loading)
const error = computed(() => talentStore.error)
const playerTalents = computed(() => talentStore.playerTalents)
const availableTalents = computed(() => talentStore.availableTalents)
const totalEffects = computed(() => talentStore.totalEffects)
const talentTypes = computed(() => talentStore.talentTypes)

// Filtered talents based on selected type
const filteredTalents = computed(() => {
  if (!selectedType.value) return playerTalents.value
  return playerTalents.value.filter(talent => talent.talent.type.id === selectedType.value)
})

// Methods
const getResourceAmount = (resourceName) => {
  const resource = playerStore.getResourceByName(resourceName)
  return resource ? Number(resource.amount).toLocaleString() : '0'
}

const handleLogout = () => {
  authStore.logout()
  playerStore.reset()
  talentStore.reset()
}

const handleMenuClick = (menuItem) => {
  if (menuItem.route) {
    navigateTo(menuItem.route)
  } else {
    console.log(`${menuItem.name} chưa được phát triển`)
  }
}

const getEffectDisplayName = (effect) => {
  const names = {
    attack: 'Tấn Công',
    defense: 'Phòng Thủ',
    speed: 'Tốc Độ',
    hp: 'Máu',
    mp: 'Pháp Lực',
    luck: 'May Mắn',
    wisdom: 'Trí Tuệ',
    strength: 'Sức Mạnh',
    agility: 'Nhanh Nhẹn',
    vitality: 'Sinh Lực',
    spirit: 'Tinh Thần',
    expMultiplier: 'Kinh Nghiệm',
    dropRate: 'Tỷ Lệ Rơi',
    critChance: 'Tỷ Lệ Chí Mạng',
    critDamage: 'Sát Thương Chí Mạng'
  }
  return names[effect] || effect
}

const getEffectColor = (effect) => {
  const colors = {
    attack: '#ef4444',
    defense: '#10b981',
    speed: '#8b5cf6',
    hp: '#ef4444',
    mp: '#3b82f6',
    luck: '#f59e0b',
    wisdom: '#06b6d4',
    strength: '#84cc16',
    agility: '#ec4899',
    vitality: '#14b8a6',
    spirit: '#6366f1',
    expMultiplier: '#8b5cf6',
    dropRate: '#f59e0b',
    critChance: '#ef4444',
    critDamage: '#dc2626'
  }
  return colors[effect] || '#6b7280'
}

const formatEffectValue = (effect, value) => {
  if (effect.includes('Multiplier') || effect.includes('Rate')) {
    return `+${((value - 1) * 100).toFixed(1)}%`
  }
  return `+${value}`
}

const formatTalentEffects = (effects, level) => {
  if (!effects) return 'Không có'
  
  const effectStrings = []
  for (const [effect, value] of Object.entries(effects)) {
    if (typeof value === 'number') {
      effectStrings.push(`${getEffectDisplayName(effect)}: +${value * level}`)
    } else if (typeof value === 'object' && value.scaling) {
      const totalValue = value.base + (value.scaling * level)
      effectStrings.push(`${getEffectDisplayName(effect)}: +${totalValue}`)
    }
  }
  return effectStrings.join(', ')
}

const unlockTalent = async (playerId, talentId) => {
  try {
    await talentStore.unlockTalent(playerId, talentId)
    // Cập nhật tài nguyên
    await playerStore.fetchResources(playerId)
  } catch (err) {
    console.error('Lỗi mở khóa thiên phú:', err)
  }
}

const upgradeTalent = async (playerId, talentId) => {
  try {
    await talentStore.upgradeTalent(playerId, talentId)
    // Cập nhật tài nguyên
    await playerStore.fetchResources(playerId)
  } catch (err) {
    console.error('Lỗi nâng cấp thiên phú:', err)
  }
}

const toggleTalent = async (playerId, talentId, isActive) => {
  try {
    await talentStore.toggleTalent(playerId, talentId, isActive)
  } catch (err) {
    console.error('Lỗi kích hoạt/tắt thiên phú:', err)
  }
}

const getRarityColor = (rarity) => talentStore.getRarityColor(rarity)
const getTalentTypeColor = (typeName) => talentStore.getTalentTypeColor(typeName)
const canUnlockTalent = (talent, playerLevel, playerRealm) => talentStore.canUnlockTalent(talent, playerLevel, playerRealm)
const canUpgradeTalent = (talent) => talentStore.canUpgradeTalent(talent)
const getTalentUpgradeCost = (talent) => talentStore.getTalentUpgradeCost(talent)

// Menu items data
const menuItems = [
  { name: 'Nhân vật', icon: '👤', active: false, route: '/character' },
  { name: 'Thiên Phú', icon: '⭐', active: true },
  { name: 'Cửa Hàng', icon: '🏠', active: false, route: '/shop' },
  { name: 'Túi', icon: '🎒', active: false, route: '/inventory' },
  { name: 'Tu Luyện', icon: '🧘', active: false, route: '/cultivation' },
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
    await talentStore.fetchTalentStatus(authStore.user.player.id)
    
    // Set first talent type as selected
    if (talentTypes.value.length > 0) {
      selectedType.value = talentTypes.value[0].id
    }
  }
})

// Watch for authentication changes
watch(isAuthenticated, async (newValue) => {
  if (newValue && authStore.user?.player) {
    await playerStore.initializePlayer(authStore.user.player.id)
    await talentStore.fetchTalentStatus(authStore.user.player.id)
  } else {
    talentStore.reset()
  }
})
</script>
