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
  daysToNextFloor,
  daysToNextRealm,
  REALMS,
  FLOORS,
  REALM_NAMES
} from '../utils/expCalc'

// Declare $fetch as global
declare const $fetch: any

export const useCultivationStore = defineStore('cultivation', () => {
  // State
  const cultivationStatus = ref<any>(null)
  const isCultivating = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // Cultivation system state
  const currentRealmIndex = ref(1) // 1-7
  const currentFloor = ref(1) // 1-15
  const currentExp = ref(0)
  const totalExpGained = ref(0)

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
    return getRealmName(currentRealmIndex.value)
  })

  // New cultivation system getters
  const currentRealmDisplay = computed(() => {
    return `${getRealmName(currentRealmIndex.value)} Tầng ${currentFloor.value}`
  })

  const expToNextFloor = computed(() => {
    return expToNextFloor(currentRealmIndex.value, currentFloor.value)
  })

  const expToNextRealm = computed(() => {
    return expToNextRealm(currentRealmIndex.value)
  })

  const canBreakthroughFloor = computed(() => {
    return currentExp.value >= expToNextFloor.value
  })

  const canBreakthroughRealm = computed(() => {
    return currentFloor.value >= FLOORS && currentExp.value >= expToNextRealm.value
  })

  const currentFloorSuccessRate = computed(() => {
    return getSuccessRate(currentFloor.value)
  })

  const isMaxLevel = computed(() => {
    return currentRealmIndex.value >= REALMS && currentFloor.value >= FLOORS
  })

  const expPerDayCurrent = computed(() => {
    return expPerDay(currentRealmIndex.value)
  })

  const daysToNextFloor = computed(() => {
    if (isMaxLevel.value) return 0
    return Math.ceil(expToNextFloor.value / expPerDayCurrent.value)
  })

  const daysToNextRealm = computed(() => {
    if (isMaxLevel.value) return 0
    return Math.ceil(expToNextRealm.value / expPerDayCurrent.value)
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


  // New cultivation system actions
  const addExp = (amount: number) => {
    currentExp.value += amount
    totalExpGained.value += amount
  }

  const breakthroughFloor = () => {
    if (!canBreakthroughFloor.value) return false
    
    currentExp.value -= expToNextFloor.value
    currentFloor.value += 1
    
    return true
  }

  const breakthroughRealm = () => {
    if (!canBreakthroughRealm.value) return false
    
    currentExp.value -= expToNextRealm.value
    currentRealmIndex.value += 1
    currentFloor.value = 1
    
    return true
  }

  const attemptBreakthrough = () => {
    const successRate = currentFloorSuccessRate.value
    const isSuccess = Math.random() < successRate
    
    if (isSuccess) {
      if (currentFloor.value >= FLOORS) {
        return breakthroughRealm()
      } else {
        return breakthroughFloor()
      }
    }
    
    return false
  }

  const getCultivationStats = () => {
    return {
      currentRealm: currentRealm.value,
      currentRealmIndex: currentRealmIndex.value,
      currentFloor: currentFloor.value,
      currentExp: currentExp.value,
      expToNextFloor: expToNextFloor.value,
      expToNextRealm: expToNextRealm.value,
      canBreakthroughFloor: canBreakthroughFloor.value,
      canBreakthroughRealm: canBreakthroughRealm.value,
      successRate: currentFloorSuccessRate.value,
      isMaxLevel: isMaxLevel.value,
      expPerDay: expPerDayCurrent.value,
      daysToNextFloor: daysToNextFloor.value,
      daysToNextRealm: daysToNextRealm.value
    }
  }

  const resetCultivation = () => {
    currentRealmIndex.value = 1
    currentFloor.value = 1
    currentExp.value = 0
    totalExpGained.value = 0
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
    currentRealmIndex,
    currentFloor,
    currentExp,
    totalExpGained,

    // Getters
    canCultivate,
    canBreakthrough,
    progressPercentage,
    currentRealm,
    currentRealmDisplay,
    expToNextFloor,
    expToNextRealm,
    canBreakthroughFloor,
    canBreakthroughRealm,
    currentFloorSuccessRate,
    isMaxLevel,
    expPerDayCurrent,
    daysToNextFloor,
    daysToNextRealm,

    // Actions
    fetchCultivationStatus,
    startCultivation,
    breakthrough,
    getCultivationInfo,
    getRealmColor,
    addExp,
    breakthroughFloor,
    breakthroughRealm,
    attemptBreakthrough,
    getCultivationStats,
    resetCultivation,
    reset
  }
})
