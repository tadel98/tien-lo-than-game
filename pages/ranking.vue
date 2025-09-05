<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
    <!-- Header -->
    <div class="bg-black/20 backdrop-blur-sm border-b border-purple-500/30">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              🏆 Bảng Xếp Hạng
            </h1>
            <div class="text-sm text-gray-400">
              Cập nhật: {{ formatTime(lastUpdated) }}
            </div>
          </div>
          <button 
            @click="refreshRanking"
            :disabled="loading"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {{ loading ? 'Đang tải...' : '🔄 Làm mới' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex space-x-2 mb-8">
        <button
          v-for="type in rankingTypes"
          :key="type.value"
          @click="changeRankingType(type.value)"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-all duration-300',
            currentType === type.value
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
          ]"
        >
          {{ type.icon }} {{ type.label }}
        </button>
      </div>

      <!-- Ranking List -->
      <div class="grid gap-6">
        <!-- Top 3 Podium -->
        <div v-if="topPlayers.length >= 3" class="flex justify-center items-end space-x-8 mb-8">
          <!-- 2nd Place -->
          <div class="text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2">
              2
            </div>
            <div class="bg-gray-800/80 rounded-lg p-4 min-w-[200px]">
              <div class="text-lg font-bold text-gray-300">{{ topPlayers[1]?.name }}</div>
              <div class="text-sm text-gray-400">Cấp {{ topPlayers[1]?.level }}</div>
              <div class="text-yellow-400 font-bold">{{ formatNumber(topPlayers[1]?.combatPower) }} SMCĐ</div>
            </div>
          </div>

          <!-- 1st Place -->
          <div class="text-center">
            <div class="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold mb-2 shadow-2xl">
              👑
            </div>
            <div class="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-6 min-w-[250px] border border-yellow-500/30">
              <div class="text-xl font-bold text-yellow-400">{{ topPlayers[0]?.name }}</div>
              <div class="text-sm text-yellow-300">Cấp {{ topPlayers[0]?.level }} - {{ topPlayers[0]?.realm }}</div>
              <div class="text-yellow-200 font-bold text-lg">{{ formatNumber(topPlayers[0]?.combatPower) }} SMCĐ</div>
            </div>
          </div>

          <!-- 3rd Place -->
          <div class="text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2">
              3
            </div>
            <div class="bg-gray-800/80 rounded-lg p-4 min-w-[200px]">
              <div class="text-lg font-bold text-gray-300">{{ topPlayers[2]?.name }}</div>
              <div class="text-sm text-gray-400">Cấp {{ topPlayers[2]?.level }}</div>
              <div class="text-yellow-400 font-bold">{{ formatNumber(topPlayers[2]?.combatPower) }} SMCĐ</div>
            </div>
          </div>
        </div>

        <!-- Ranking Table -->
        <div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-purple-900/30">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Hạng</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Tên</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Cấp</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Cảnh Giới</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-purple-300">SMCĐ</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Kinh Nghiệm</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-purple-300">Tài Nguyên</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700/50">
                <tr 
                  v-for="(player, index) in topPlayers" 
                  :key="player.id"
                  :class="[
                    'hover:bg-gray-800/30 transition-colors',
                    index < 3 ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20' : ''
                  ]"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <span 
                        :class="[
                          'text-lg font-bold',
                          index === 0 ? 'text-yellow-400' : 
                          index === 1 ? 'text-gray-300' : 
                          index === 2 ? 'text-orange-400' : 'text-gray-400'
                        ]"
                      >
                        {{ getRankIcon(index + 1) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {{ player.name.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="font-medium text-white">{{ player.name }}</div>
                        <div class="text-xs text-gray-400">{{ player.equipmentCount }} trang bị</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-lg font-bold text-blue-400">{{ player.level }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-purple-300">{{ player.realm }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-lg font-bold text-yellow-400">{{ formatNumber(player.combatPower) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-green-400">{{ formatNumber(player.experience) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-xs space-y-1">
                      <div class="text-yellow-300">⚡ {{ formatNumber(player.resources.huyenLuc) }}</div>
                      <div class="text-blue-300">💎 {{ formatNumber(player.resources.linhThach) }}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div class="text-gray-400">Đang tải bảng xếp hạng...</div>
        </div>

        <!-- Empty State -->
        <div v-else-if="topPlayers.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🏆</div>
          <div class="text-xl text-gray-400 mb-2">Chưa có dữ liệu xếp hạng</div>
          <div class="text-sm text-gray-500">Hãy thử lại sau hoặc kiểm tra kết nối</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRankingStore } from '~/stores/ranking'
import { useAuthStore } from '~/stores/auth'

// Stores
const rankingStore = useRankingStore()
const authStore = useAuthStore()

// Reactive data
const rankingTypes = ref([
  { value: 'level', label: 'Cấp Độ', icon: '📈' },
  { value: 'combat_power', label: 'Sức Mạnh', icon: '⚔️' },
  { value: 'experience', label: 'Kinh Nghiệm', icon: '⭐' }
])

// Computed
const topPlayers = computed(() => rankingStore.topPlayers)
const currentType = computed(() => rankingStore.currentType)
const loading = computed(() => rankingStore.loading)
const lastUpdated = computed(() => rankingStore.lastUpdated)

// Methods
const changeRankingType = async (type) => {
  await rankingStore.fetchRanking(type, 20)
}

const refreshRanking = async () => {
  await rankingStore.refreshRanking()
}

const getRankIcon = (rank) => {
  if (rank === 1) return '👑'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return rank
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('vi-VN').format(num)
}

const formatTime = (time) => {
  if (!time) return 'Chưa cập nhật'
  return new Date(time).toLocaleString('vi-VN')
}

// Initialize
onMounted(async () => {
  authStore.initializeAuth()
  await rankingStore.fetchRanking('level', 20)
})
</script>
