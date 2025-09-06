<template>
  <div v-if="!isAuthenticated" class="min-h-screen">
    <LoginForm />
  </div>
  
  <div v-else class="min-h-screen text-white">
    <!-- Header -->
    <div class="bg-black/20 backdrop-blur-sm border-b border-purple-500/30">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              📋 Nhiệm Vụ
            </h1>
            <div class="text-sm text-gray-400">
              Hoàn thành nhiệm vụ để nhận EXP và tài nguyên
            </div>
          </div>
          <button 
            @click="refreshQuests"
            :disabled="loading"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {{ loading ? 'Đang tải...' : '🔄 Làm mới' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quest Tabs -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex space-x-2 mb-8">
        <button
          v-for="tab in questTabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-all duration-300',
            activeTab === tab.value
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
          ]"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- Quest List -->
      <div class="grid gap-6">
        <!-- Available Quests -->
        <div v-if="activeTab === 'available' && availableQuests.length > 0" class="space-y-4">
          <h2 class="text-xl font-bold text-white mb-4">Nhiệm Vụ Có Thể Nhận</h2>
          <div 
            v-for="quest in availableQuests" 
            :key="quest.id"
            class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <h3 class="text-lg font-bold text-white">{{ quest.displayName }}</h3>
                  <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    {{ getDifficultyText(quest.difficulty) }}
                  </span>
                  <span v-if="quest.isRepeatable" class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    🔄 {{ quest.repeatInterval }}p
                  </span>
                </div>
                <p class="text-gray-300 mb-4">{{ quest.description }}</p>
                
                <!-- Rewards -->
                <div class="mb-4">
                  <h4 class="text-sm font-semibold text-yellow-400 mb-2">Phần Thưởng:</h4>
                  <div class="flex flex-wrap gap-2">
                    <span v-if="quest.rewards" class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      +{{ JSON.parse(quest.rewards).experience || 0 }} EXP
                    </span>
                    <span 
                      v-for="(amount, resource) in JSON.parse(quest.rewards || '{}').resources || {}" 
                      :key="resource"
                      class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                    >
                      +{{ amount }} {{ resource }}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                @click="startQuest(quest.id)"
                :disabled="loading || player?.level < quest.level"
                class="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all duration-300"
              >
                Nhận Nhiệm Vụ
              </button>
            </div>
          </div>
        </div>

        <!-- In Progress Quests -->
        <div v-if="activeTab === 'in_progress' && inProgressQuests.length > 0" class="space-y-4">
          <h2 class="text-xl font-bold text-white mb-4">Nhiệm Vụ Đang Thực Hiện</h2>
          <div 
            v-for="quest in inProgressQuests" 
            :key="quest.id"
            class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6 hover:border-orange-500/40 transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <h3 class="text-lg font-bold text-white">{{ quest.displayName }}</h3>
                  <span class="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                    Đang thực hiện
                  </span>
                </div>
                <p class="text-gray-300 mb-4">{{ quest.description }}</p>
                
                <!-- Progress -->
                <div class="mb-4">
                  <div class="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Tiến độ</span>
                    <span>100%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style="width: 100%"></div>
                  </div>
                </div>

                <!-- Rewards -->
                <div class="mb-4">
                  <h4 class="text-sm font-semibold text-yellow-400 mb-2">Phần Thưởng:</h4>
                  <div class="flex flex-wrap gap-2">
                    <span v-if="quest.rewards" class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      +{{ JSON.parse(quest.rewards).experience || 0 }} EXP
                    </span>
                    <span 
                      v-for="(amount, resource) in JSON.parse(quest.rewards || '{}').resources || {}" 
                      :key="resource"
                      class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                    >
                      +{{ amount }} {{ resource }}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                @click="completeQuest(quest.id)"
                :disabled="loading"
                class="ml-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all duration-300"
              >
                Hoàn Thành
              </button>
            </div>
          </div>
        </div>

        <!-- Repeatable Quests -->
        <div v-if="activeTab === 'repeatable' && repeatableQuests.length > 0" class="space-y-4">
          <h2 class="text-xl font-bold text-white mb-4">Nhiệm Vụ Lặp Lại</h2>
          <div 
            v-for="quest in repeatableQuests" 
            :key="quest.id"
            class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <h3 class="text-lg font-bold text-white">{{ quest.displayName }}</h3>
                  <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    🔄 {{ quest.repeatInterval }}p
                  </span>
                </div>
                <p class="text-gray-300 mb-4">{{ quest.description }}</p>
                
                <!-- Rewards -->
                <div class="mb-4">
                  <h4 class="text-sm font-semibold text-yellow-400 mb-2">Phần Thưởng:</h4>
                  <div class="flex flex-wrap gap-2">
                    <span v-if="quest.rewards" class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      +{{ JSON.parse(quest.rewards).experience || 0 }} EXP
                    </span>
                    <span 
                      v-for="(amount, resource) in JSON.parse(quest.rewards || '{}').resources || {}" 
                      :key="resource"
                      class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                    >
                      +{{ amount }} {{ resource }}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                @click="startQuest(quest.id)"
                :disabled="loading"
                class="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all duration-300"
              >
                Nhận Nhiệm Vụ
              </button>
            </div>
          </div>
        </div>

        <!-- Cooldown Quests -->
        <div v-if="activeTab === 'cooldown' && cooldownQuests.length > 0" class="space-y-4">
          <h2 class="text-xl font-bold text-white mb-4">Nhiệm Vụ Đang Chờ Làm Mới</h2>
          <div 
            v-for="quest in cooldownQuests" 
            :key="quest.id"
            class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6 hover:border-orange-500/40 transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <h3 class="text-lg font-bold text-white">{{ quest.displayName }}</h3>
                  <span class="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                    ⏰ {{ quest.playerStatus.cooldownRemaining }}s
                  </span>
                </div>
                <p class="text-gray-300 mb-4">{{ quest.description }}</p>
                
                <!-- Cooldown Info -->
                <div class="mb-4">
                  <div class="text-sm text-gray-400">
                    Hoàn thành lần cuối: {{ formatDate(quest.playerStatus.lastCompletedAt) }}
                  </div>
                  <div class="text-sm text-orange-400">
                    Có thể nhận lại sau: {{ formatTime(quest.playerStatus.cooldownRemaining) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completed Quests -->
        <div v-if="activeTab === 'completed' && completedQuests.length > 0" class="space-y-4">
          <h2 class="text-xl font-bold text-white mb-4">Nhiệm Vụ Đã Hoàn Thành</h2>
          <div 
            v-for="quest in completedQuests" 
            :key="quest.id"
            class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <h3 class="text-lg font-bold text-white">{{ quest.displayName }}</h3>
                  <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    Đã hoàn thành
                  </span>
                </div>
                <p class="text-gray-300 mb-4">{{ quest.description }}</p>
                
                <!-- Completion Date -->
                <div class="text-sm text-gray-400">
                  Hoàn thành: {{ formatDate(quest.playerStatus.completedAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="getCurrentQuests.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📋</div>
          <div class="text-xl text-gray-400 mb-2">
            {{ activeTab === 'available' ? 'Không có nhiệm vụ nào' : 
              activeTab === 'in_progress' ? 'Không có nhiệm vụ đang thực hiện' : 
              'Chưa hoàn thành nhiệm vụ nào' }}
          </div>
          <div class="text-sm text-gray-500">
            {{ activeTab === 'available' ? 'Hãy nâng cấp level để mở khóa nhiệm vụ mới' : 
              activeTab === 'in_progress' ? 'Hãy nhận nhiệm vụ để bắt đầu' : 
              'Hãy hoàn thành nhiệm vụ để xem lịch sử' }}
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div class="text-gray-400">Đang tải nhiệm vụ...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuestStore } from '~/stores/quest'
import { useAuthStore } from '~/stores/auth'
import { usePlayerStore } from '~/stores/player'

// Stores
const questStore = useQuestStore()
const authStore = useAuthStore()
const playerStore = usePlayerStore()

// Reactive data
const activeTab = ref('available')

const questTabs = ref([
  { value: 'available', label: 'Có Thể Nhận', icon: '📋' },
  { value: 'in_progress', label: 'Đang Thực Hiện', icon: '⏳' },
  { value: 'completed', label: 'Đã Hoàn Thành', icon: '✅' },
  { value: 'repeatable', label: 'Lặp Lại', icon: '🔄' },
  { value: 'cooldown', label: 'Chờ Làm Mới', icon: '⏰' }
])

// Computed
const isAuthenticated = computed(() => authStore.isLoggedIn)
const player = computed(() => playerStore.player)
const loading = computed(() => questStore.loading)
const availableQuests = computed(() => questStore.availableQuests)
const inProgressQuests = computed(() => questStore.inProgressQuests)
const completedQuests = computed(() => questStore.completedQuests)
const repeatableQuests = computed(() => questStore.quests.filter(quest => quest.isRepeatable && quest.playerStatus.status === 'available'))
const cooldownQuests = computed(() => questStore.quests.filter(quest => quest.playerStatus.status === 'cooldown'))

const getCurrentQuests = computed(() => {
  switch (activeTab.value) {
    case 'available':
      return availableQuests.value
    case 'in_progress':
      return inProgressQuests.value
    case 'completed':
      return completedQuests.value
    case 'repeatable':
      return repeatableQuests.value
    case 'cooldown':
      return cooldownQuests.value
    default:
      return []
  }
})

// Methods
const refreshQuests = async () => {
  if (player.value?.id) {
    await questStore.fetchQuests(player.value.id)
  }
}

const startQuest = async (questId) => {
  try {
    console.log('Starting quest with:', { playerId: player.value?.id, questId })
    
    if (!player.value?.id) {
      console.error('Player ID not found!')
      alert('Lỗi: Không tìm thấy thông tin người chơi. Vui lòng đăng nhập lại.')
      return
    }
    
    const result = await questStore.startQuest(player.value.id, questId)
    console.log('Nhiệm vụ đã được nhận:', result.quest.displayName)
    
    // Refresh quest list and player data
    await questStore.fetchQuests(player.value.id)
    await playerStore.fetchResources(player.value.id)
    
    alert(`✅ Đã nhận nhiệm vụ: ${result.quest.displayName}`)
  } catch (err) {
    console.error('Lỗi nhận nhiệm vụ:', err)
    
    // Hiển thị thông báo lỗi cụ thể
    let errorMessage = 'Có lỗi xảy ra khi nhận nhiệm vụ'
    
    if (err.data?.statusMessage) {
      errorMessage = err.data.statusMessage
    } else if (err.message) {
      errorMessage = err.message
    }
    
    alert(`❌ ${errorMessage}`)
  }
}

const completeQuest = async (questId) => {
  try {
    const result = await questStore.completeQuest(player.value.id, questId)
    console.log('Nhiệm vụ đã hoàn thành:', result.quest.displayName)
    console.log('Phần thưởng:', result.rewards)
    
    if (result.levelUp) {
      console.log(`🎉 Level Up! Level ${result.newLevel}`)
    }
    
    // Refresh player data
    await playerStore.fetchResources(player.value.id)
  } catch (err) {
    console.error('Lỗi hoàn thành nhiệm vụ:', err)
  }
}

const formatDate = (date) => {
  if (!date) return 'Chưa xác định'
  return new Date(date).toLocaleString('vi-VN')
}

const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    'easy': 'Dễ',
    'medium': 'Trung Bình',
    'hard': 'Khó',
    'expert': 'Chuyên Gia'
  }
  return difficultyMap[difficulty] || difficulty
}

const formatTime = (seconds) => {
  if (!seconds) return '0s'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

// Initialize
onMounted(async () => {
  authStore.initializeAuth()
  
  if (isAuthenticated.value && player.value?.id) {
    await questStore.fetchQuests(player.value.id)
  }
})
</script>
