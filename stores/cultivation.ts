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
  REALMS,
  FLOORS,
  FAIL_RATES,
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

  // New cultivation system state
  const currentRealm = ref(1) // 1-7
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

  const currentRealmDisplay = computed(() => {
    return `${getRealmName(currentRealm.value)} Tầng ${currentFloor.value}`
  })

  const expToNextFloorValue = computed(() => {
    return expToNextFloor(currentRealm.value, currentFloor.value)
  })

  const canBreakthroughFloor = computed(() => {
    return currentExp.value >= expToNextFloorValue.value
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
      'Luyện Khí': '#3b82f6',
      'Trúc Cơ': '#10b981',
      'Kim Đan': '#f59e0b',
      'Nguyên Anh': '#ef4444',
      'Hóa Thần': '#8b5cf6',
      'Hợp Thể': '#f97316',
      'Đại Thừa': '#8b5cf6'
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

  const breakthroughRealm = () => {
    if (!canBreakthroughRealm.value) return false
    
    currentExp.value -= expToNextRealm(currentRealm.value)
    currentRealm.value += 1
    currentFloor.value = 1
    
    return true
  }

  const attemptBreakthroughFloor = () => {
    const successRate = currentFloorSuccessRate.value
    const isSuccess = Math.random() < successRate
    
    if (isSuccess) {
      return breakthroughFloor()
    }
    
    return false
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
    getCultivationStats,
    resetCultivation,
    reset
  }
})
