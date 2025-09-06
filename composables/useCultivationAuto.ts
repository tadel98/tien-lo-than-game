import { useCultivationStore } from '~/stores/cultivation'

export const useCultivationAuto = () => {
  const cultivationStore = useCultivationStore()
  
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
  
  return {
    addDailyExp,
    checkAndAddDailyExp
  }
}
