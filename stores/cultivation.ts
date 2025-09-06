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

export const useCultivationStore = defineStore('cultivation', () => {
  // State - Chỉ hệ thống mới
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
  const currentRealmDisplay = computed(() => {
    return getRealmName(currentRealm.value)
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

  // New Xianxia system getters
  const currentQualityLevel = computed(() => {
    return currentQuality.value
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
    return isAtMaxRealm.value && isAtFloor15.value && !hasAscended.value
  })

  // Actions
  const addExp = (amount: number) => {
    currentExp.value += amount
    totalExpGained.value += amount
  }

  const breakthroughFloor = () => {
    if (currentFloor.value < FLOORS) {
      currentFloor.value++
      return true
    }
    return false
  }

  const breakthroughRealm = (quality: string = 'Hạ Phẩm') => {
    if (currentRealm.value < REALMS) {
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
      
      // Lên cảnh giới tiếp theo
      currentRealm.value++
      currentFloor.value = 1
      
      return true
    }
    return false
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

  const attemptBreakthroughRealm = () => {
    if (currentFloor.value >= FLOORS && currentExp.value >= expToNextRealm(currentRealm.value)) {
      return breakthroughRealm('Hạ Phẩm')
    }
    return false
  }

  // Đột phá cảnh giới từ tầng 10 (Hạ Phẩm)
  const breakthroughRealmFromFloor10 = () => {
    if (!canBreakthroughFromFloor10Value.value) return false
    return breakthroughRealm('Hạ Phẩm')
  }

  // Thử đột phá tầng cao (11-15)
  const attemptHighFloorBreakthrough = () => {
    if (!canAttemptHighFloorsValue.value) return false
    
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

  // Phi thăng (chỉ ở cảnh giới cuối)
  const ascend = () => {
    if (!canAscend.value) return false
    
    hasAscended.value = true
    return true
  }

  const getCultivationStats = () => {
    return {
      currentRealm: currentRealm.value,
      currentFloor: currentFloor.value,
      currentExp: currentExp.value,
      totalExpGained: totalExpGained.value,
      currentQuality: currentQuality.value,
      eternalTitles: eternalTitles.value,
      hasAscended: hasAscended.value,
      expToNextFloor: expToNextFloorValue.value,
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

  const reset = () => {
    resetCultivation()
  }

  return {
    // State
    currentRealm,
    currentFloor,
    currentExp,
    totalExpGained,
    currentQuality,
    eternalTitles,
    hasAscended,

    // Getters
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