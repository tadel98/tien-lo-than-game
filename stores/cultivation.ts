import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  expPerDay, 
  expForRealm,
  expToNextFloor, 
  expToNextRealm,
  expToCurrentLevel,
  getSuccessRate,
  getRealmName,
  getQualityLevel,
  getEternalTitle,
  calculatePowerMultiplier,
  getQualityColor,
  canBreakthroughFromFloor10,
  canAttemptHighFloors,
  REALMS,
  FLOORS,
  FAIL_RATES,
  REALM_NAMES,
  QUALITY_LEVELS,
  ETERNAL_TITLES
} from '../utils/expCalc'

// Declare $fetch as global
declare const $fetch: any

export const useCultivationStore = defineStore('cultivation', () => {
  // State
  const cultivationStatus = ref<any>(null)
  const isCultivating = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // New cultivation system state
  const currentRealm = ref(1) // 1-9
  const currentFloor = ref(1) // 1-15
  const currentExp = ref(0)
  const totalExpGained = ref(0)
  const currentQuality = ref('Hạ Phẩm') // Phẩm chất hiện tại
  const eternalTitles = ref<Array<{
    name: string
    description: string
    floor: number
    realm: number
  }>>([]) // Danh sách danh hiệu vĩnh cửu
  const hasAscended = ref(false) // Đã phi thăng chưa


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

  const currentRealmDisplay = computed(() => {
    return `${getRealmName(currentRealm.value)} Tầng ${currentFloor.value}`
  })

  const expToNextFloorValue = computed(() => {
    return expToNextFloor(currentRealm.value, currentFloor.value)
  })

  const canBreakthroughFloor = computed(() => {
    // Tầng 1-9: Cần đủ EXP
    if (currentFloor.value < 10) {
      return currentExp.value >= expToNextFloorValue.value
    }
    // Tầng 10: Luôn có thể thử (có 2 lựa chọn)
    if (currentFloor.value === 10) {
      return true
    }
    // Tầng 11-15: Luôn có thể thử (thất bại sẽ lên cảnh giới tiếp theo)
    if (currentFloor.value >= 11) {
      return true
    }
    return false
  })

  const canBreakthroughRealm = computed(() => {
    return currentFloor.value >= FLOORS && currentExp.value >= expToNextRealm(currentRealm.value)
  })

  const currentFloorSuccessRate = computed(() => {
    return getSuccessRate(currentFloor.value)
  })

  const isMaxLevel = computed(() => {
    return currentRealm.value >= REALMS && currentFloor.value >= FLOORS
  })

  const expPerDayCurrent = computed(() => {
    return expPerDay(currentRealm.value)
  })

  // New quality and title system
  const currentQualityLevel = computed(() => {
    return getQualityLevel(currentFloor.value)
  })

  const currentQualityColor = computed(() => {
    return getQualityColor(currentQuality.value)
  })

  const powerMultiplier = computed(() => {
    return calculatePowerMultiplier(currentQuality.value)
  })

  const canBreakthroughFromFloor10Value = computed(() => {
    return canBreakthroughFromFloor10(currentFloor.value)
  })

  const canAttemptHighFloorsValue = computed(() => {
    return canAttemptHighFloors(currentFloor.value)
  })

  const isAtFloor10 = computed(() => {
    return currentFloor.value === 10
  })

  const isAtFloor15 = computed(() => {
    return currentFloor.value === 15
  })

  const isAtMaxRealm = computed(() => {
    return currentRealm.value >= REALMS
  })

  const canAscend = computed(() => {
    return isAtMaxRealm.value && isAtFloor15.value
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
      'Luyện Khí': '#3b82f6',      // Blue
      'Trúc Cơ': '#10b981',         // Green
      'Kim Đan': '#f59e0b',         // Yellow
      'Nguyên Anh': '#ef4444',      // Red
      'Hóa Thần': '#8b5cf6',        // Purple
      'Luyện Hư': '#06b6d4',        // Cyan
      'Hợp Thể': '#f97316',         // Orange
      'Đại Thừa': '#ec4899',        // Pink
      'Độ Kiếp': '#fbbf24'          // Gold
    }
    return realmColors[realm] || '#6b7280'
  }

  // New cultivation system actions
  const addExp = (amount: number) => {
    currentExp.value += amount
    totalExpGained.value += amount
  }

  const breakthroughFloor = () => {
    if (!canBreakthroughFloor.value) return false
    
    currentExp.value -= expToNextFloorValue.value
    currentFloor.value += 1
    
    return true
  }

  const breakthroughRealm = (quality = 'Hạ Phẩm') => {
    if (!canBreakthroughRealm.value && !canBreakthroughFromFloor10Value.value) return false
    
    // Cập nhật phẩm chất
    currentQuality.value = quality
    
    // Thêm danh hiệu vĩnh cửu nếu có
    const title = getEternalTitle(currentFloor.value)
    if (title && !eternalTitles.value.find((t: any) => t.floor === currentFloor.value)) {
      eternalTitles.value.push({
        ...title,
        floor: currentFloor.value,
        realm: currentRealm.value
      })
    }
    
    // Trừ EXP nếu cần
    if (currentExp.value >= expToNextRealm(currentRealm.value)) {
      currentExp.value -= expToNextRealm(currentRealm.value)
    }
    
    currentRealm.value += 1
    currentFloor.value = 1
    
    return true
  }

  const attemptBreakthroughFloor = () => {
    // Tầng 1-9: Đột phá bình thường
    if (currentFloor.value < 10) {
      if (currentExp.value >= expToNextFloorValue.value) {
        return breakthroughFloor()
      }
      return false
    }
    
    // Tầng 10: Không nên gọi function này, nên dùng các function chuyên biệt
    if (currentFloor.value === 10) {
      return false
    }
    
    // Tầng 11-15: Thử đột phá với rủi ro
    if (currentFloor.value >= 11) {
      const successRate = currentFloorSuccessRate.value
      const isSuccess = Math.random() < successRate
      
      if (isSuccess) {
        return breakthroughFloor()
      } else {
        // Thất bại: Lên cảnh giới tiếp theo với phẩm chất tương ứng
        const quality = getQualityLevel(currentFloor.value)
        return breakthroughRealm(quality)
      }
    }
    
    return false
  }

  // Đột phá cảnh giới từ tầng 10 (Hạ Phẩm)
  const breakthroughRealmFromFloor10 = () => {
    if (!canBreakthroughFromFloor10Value.value) return false
    return breakthroughRealm('Hạ Phẩm')
  }

  // Thử đột phá tầng 11-15 (có phẩm chất cao)
  const attemptHighFloorBreakthrough = () => {
    if (!canAttemptHighFloorsValue.value) return false
    return attemptBreakthroughFloor()
  }

  // Phi thăng (kết thúc game)
  const ascend = () => {
    if (!canAscend.value) return false
    
    hasAscended.value = true
    console.log('🎉 Chúc mừng! Bạn đã Phi Thăng thành công!')
    return true
  }

  const attemptBreakthroughRealm = () => {
    if (canBreakthroughRealm.value) {
      return breakthroughRealm()
    }
    return false
  }

  const getCultivationStats = () => {
    return {
      currentRealm: currentRealm.value,
      currentFloor: currentFloor.value,
      currentExp: currentExp.value,
      expToNextFloor: expToNextFloorValue.value,
      expToNextRealm: expToNextRealm(currentRealm.value),
      canBreakthroughFloor: canBreakthroughFloor.value,
      canBreakthroughRealm: canBreakthroughRealm.value,
      successRate: currentFloorSuccessRate.value,
      isMaxLevel: isMaxLevel.value,
      expPerDay: expPerDayCurrent.value
    }
  }

  const resetCultivation = () => {
    currentRealm.value = 1
    currentFloor.value = 1
    currentExp.value = 0
    totalExpGained.value = 0
    currentQuality.value = 'Hạ Phẩm'
    eternalTitles.value = []
    hasAscended.value = false
  }



  // Reset store
  const reset = () => {
    cultivationStatus.value = null
    isCultivating.value = false
    loading.value = false
    error.value = null
    resetCultivation()
  }

  return {
    // State
    cultivationStatus,
    isCultivating,
    loading,
    error,
    currentRealm,
    currentFloor,
    currentExp,
    totalExpGained,
    currentQuality,
    eternalTitles,
    hasAscended,

    // Getters
    canCultivate,
    canBreakthrough,
    progressPercentage,
    currentRealmDisplay,
    expToNextFloor: expToNextFloorValue,
    canBreakthroughFloor,
    canBreakthroughRealm,
    currentFloorSuccessRate,
    isMaxLevel,
    expPerDayCurrent,
    currentQualityLevel,
    currentQualityColor,
    powerMultiplier,
    canBreakthroughFromFloor10: canBreakthroughFromFloor10Value,
    canAttemptHighFloors: canAttemptHighFloorsValue,
    isAtFloor10,
    isAtFloor15,
    isAtMaxRealm,
    canAscend,

    // Actions
    fetchCultivationStatus,
    startCultivation,
    breakthrough,
    getCultivationInfo,
    getRealmColor,
    addExp,
    breakthroughFloor,
    breakthroughRealm,
    attemptBreakthroughFloor,
    attemptBreakthroughRealm,
    breakthroughRealmFromFloor10,
    attemptHighFloorBreakthrough,
    ascend,
    getCultivationStats,
    resetCultivation,
    reset
  }
})
