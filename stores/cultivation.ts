import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCultivationStore = defineStore('cultivation', () => {
  // State
  const cultivationStatus = ref<any>(null)
  const isCultivating = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const autoCultivation = ref(false)
  const autoCultivationInterval = ref<any>(null)

  // Getters
  const canCultivate = computed(() => {
    return cultivationStatus.value?.canCultivate || false
  })

  const canBreakthrough = computed(() => {
    if (!cultivationStatus.value) return false
    const { currentExp, nextLevelExp } = cultivationStatus.value.cultivation
    return currentExp >= nextLevelExp
  })

  const progressPercentage = computed(() => {
    return cultivationStatus.value?.cultivation?.progressPercentage || 0
  })

  const currentRealm = computed(() => {
    return cultivationStatus.value?.cultivation?.realm || 'Phàm cảnh'
  })

  // Actions
  const fetchCultivationStatus = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch(`/api/cultivation/status?playerId=${playerId}`)
      cultivationStatus.value = response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching cultivation status:', err)
    } finally {
      loading.value = false
    }
  }

  const startCultivation = async (playerId: string, cultivationType: string = 'basic') => {
    try {
      loading.value = true
      error.value = null
      isCultivating.value = true

      const response: any = await $fetch('/api/cultivation/start', {
        method: 'POST',
        body: {
          playerId,
          cultivationType
        }
      })

      // Cập nhật trạng thái tu luyện
      await fetchCultivationStatus(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error starting cultivation:', err)
      throw err
    } finally {
      loading.value = false
      isCultivating.value = false
    }
  }

  const breakthrough = async (playerId: string) => {
    try {
      loading.value = true
      error.value = null

      const response: any = await $fetch('/api/cultivation/breakthrough', {
        method: 'POST',
        body: {
          playerId
        }
      })

      // Cập nhật trạng thái tu luyện
      await fetchCultivationStatus(playerId)

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error breakthrough:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCultivationInfo = (level: number) => {
    const realms = [
      { name: 'Phàm cảnh', min: 1, max: 9, color: '#6b7280' },
      { name: 'Luyện Khí cảnh', min: 10, max: 49, color: '#3b82f6' },
      { name: 'Trúc Cơ cảnh', min: 50, max: 99, color: '#10b981' },
      { name: 'Kim Đan cảnh', min: 100, max: 199, color: '#f59e0b' },
      { name: 'Nguyên Anh cảnh', min: 200, max: 499, color: '#ef4444' },
      { name: 'Hóa Thần cảnh', min: 500, max: 999, color: '#8b5cf6' },
      { name: 'Hợp Thể cảnh', min: 1000, max: 1000, color: '#f97316' } // Cảnh giới cao nhất
    ]

    const currentRealm = realms.find(realm => level >= realm.min && level <= realm.max) || realms[0]
    const nextRealm = realms.find(realm => realm.min > level) || realms[realms.length - 1]

    return {
      currentRealm,
      nextRealm,
      isMaxLevel: level >= 1000 // Cảnh giới cao nhất là level 1000
    }
  }

  const getRealmColor = (realm: string) => {
    const realmColors = {
      'Phàm cảnh': '#6b7280',
      'Luyện Khí cảnh': '#3b82f6',
      'Trúc Cơ cảnh': '#10b981',
      'Kim Đan cảnh': '#f59e0b',
      'Nguyên Anh cảnh': '#ef4444',
      'Hóa Thần cảnh': '#8b5cf6',
      'Hợp Thể cảnh': '#f97316'
    }
    return realmColors[realm] || '#6b7280'
  }

  // Auto cultivation methods
  const startAutoCultivation = (playerId: string, cultivationType: string = 'basic') => {
    if (autoCultivationInterval.value) {
      clearInterval(autoCultivationInterval.value)
    }
    
    autoCultivation.value = true
    
    autoCultivationInterval.value = setInterval(async () => {
      if (!autoCultivation.value) {
        stopAutoCultivation()
        return
      }
      
      try {
        // Gọi API tu luyện tự động
        const response: any = await $fetch('/api/cultivation/auto-cultivate', {
          method: 'POST',
          body: {
            playerId,
            expGain: 1000
          }
        })
        
        // Cập nhật trạng thái tu luyện
        await fetchCultivationStatus(playerId)
        
        // Hiển thị thông báo level up nếu có
        if (response.data.cultivation.levelUp) {
          console.log(`🎉 Level Up! +${response.data.cultivation.levelGain} level(s)`)
          // Emit event để component có thể bắt được
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('levelUp', {
              detail: {
                levelGain: response.data.cultivation.levelGain,
                newLevel: response.data.cultivation.newLevel
              }
            }))
          }
        }
        
      } catch (err) {
        console.error('Auto cultivation error:', err)
        stopAutoCultivation()
      }
    }, 6000) // Tu luyện mỗi 6 giây
  }

  const stopAutoCultivation = () => {
    autoCultivation.value = false
    if (autoCultivationInterval.value) {
      clearInterval(autoCultivationInterval.value)
      autoCultivationInterval.value = null
    }
  }

  const toggleAutoCultivation = (playerId: string, cultivationType: string = 'basic') => {
    if (autoCultivation.value) {
      stopAutoCultivation()
    } else {
      startAutoCultivation(playerId, cultivationType)
    }
  }

  // Reset store
  const reset = () => {
    stopAutoCultivation()
    cultivationStatus.value = null
    isCultivating.value = false
    loading.value = false
    error.value = null
  }

  return {
    // State
    cultivationStatus,
    isCultivating,
    loading,
    error,
    autoCultivation,

    // Getters
    canCultivate,
    canBreakthrough,
    progressPercentage,
    currentRealm,

    // Actions
    fetchCultivationStatus,
    startCultivation,
    breakthrough,
    getCultivationInfo,
    getRealmColor,
    startAutoCultivation,
    stopAutoCultivation,
    toggleAutoCultivation,
    reset
  }
})
