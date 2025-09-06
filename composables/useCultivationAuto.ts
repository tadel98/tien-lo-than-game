import { useCultivationStore } from '~/stores/cultivation'

export const useCultivationAuto = () => {
  const cultivationStore = useCultivationStore()
  let autoExpInterval: NodeJS.Timeout | null = null
  
  const addDailyExp = async (playerId: string) => {
    if (!playerId) return
    
    const expPerDay = cultivationStore.expPerDayCurrent
    await cultivationStore.addExp(expPerDay, playerId)
    
    console.log(`Đã nhận ${expPerDay.toLocaleString()} EXP từ tu luyện hàng ngày!`)
  }
  
  const checkAndAddDailyExp = async (playerId: string) => {
    if (!playerId) return
    
    // Kiểm tra xem đã nhận EXP hôm nay chưa
    const lastExpDate = localStorage.getItem(`cultivation_last_exp_${playerId}`)
    const today = new Date().toDateString()
    
    if (lastExpDate !== today) {
      await addDailyExp(playerId)
      localStorage.setItem(`cultivation_last_exp_${playerId}`, today)
    }
  }
  
  const startAutoExp = (playerId: string) => {
    if (!playerId) return
    
    // Dừng interval cũ nếu có
    if (autoExpInterval) {
      clearInterval(autoExpInterval)
    }
    
    // Bắt đầu interval mới - cộng 1000 EXP mỗi giây
    autoExpInterval = setInterval(async () => {
      await cultivationStore.addExp(1000, playerId)
      console.log('⚡ +1000 EXP từ tu luyện tự động!')
    }, 1000) // 1000ms = 1 giây
    
    console.log('🚀 Bắt đầu tu luyện tự động - +1000 EXP/giây!')
  }
  
  const stopAutoExp = () => {
    if (autoExpInterval) {
      clearInterval(autoExpInterval)
      autoExpInterval = null
      console.log('⏹️ Dừng tu luyện tự động!')
    }
  }
  
  const isAutoExpRunning = () => {
    return autoExpInterval !== null
  }
  
  return {
    addDailyExp,
    checkAndAddDailyExp,
    startAutoExp,
    stopAutoExp,
    isAutoExpRunning
  }
}
