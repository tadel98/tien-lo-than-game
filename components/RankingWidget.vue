<template>
  <div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-white flex items-center">
        🏆 Top 3 Người Chơi
      </h3>
      <NuxtLink 
        to="/ranking" 
        class="text-sm text-purple-400 hover:text-purple-300 transition-colors"
      >
        Xem tất cả →
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
    </div>

    <div v-else-if="topPlayers.length === 0" class="text-center py-4 text-gray-400">
      Chưa có dữ liệu
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="(player, index) in topPlayers.slice(0, 3)" 
        :key="player.id"
        :class="[
          'flex items-center justify-between p-3 rounded-lg transition-colors',
          index === 0 ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30' :
          index === 1 ? 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30' :
          'bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30'
        ]"
      >
        <div class="flex items-center space-x-3">
          <div 
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' :
              index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
              'bg-gradient-to-br from-orange-600 to-red-600 text-white'
            ]"
          >
            {{ getRankIcon(index + 1) }}
          </div>
          <div>
            <div class="font-medium text-white">{{ player.name }}</div>
            <div class="text-xs text-gray-400">Cấp {{ player.level }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-yellow-400">{{ formatNumber(player.combatPower) }}</div>
          <div class="text-xs text-gray-400">SMCĐ</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRankingStore } from '~/stores/ranking'

// Store
const rankingStore = useRankingStore()

// Reactive data
const loading = ref(false)

// Computed
const topPlayers = computed(() => rankingStore.topPlayers)

// Methods
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

const loadTopPlayers = async () => {
  loading.value = true
  try {
    await rankingStore.fetchRanking('level', 3)
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  loadTopPlayers()
})
</script>
