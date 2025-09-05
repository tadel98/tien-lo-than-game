// Utility functions for cultivation system
// Công thức mới: 100 ngày online liên tục để lên cảnh giới cao nhất

/**
 * Tính EXP cần cho level tiếp theo
 * @param {number} level - Level hiện tại
 * @returns {number} - EXP cần cho level tiếp theo
 */
export function calculateNextLevelExp(level) {
  // Công thức: EXP cần = level^2 * 1440
  // Level 1000 cần: 1000^2 * 1440 = 1,440,000,000 EXP
  return Math.pow(level, 2) * 1440
}

/**
 * Tính level dựa trên EXP hiện có
 * @param {number} exp - EXP hiện có
 * @returns {number} - Level tương ứng
 */
export function calculateLevelFromExp(exp) {
  let level = 1
  for (let i = 1; i <= 1000; i++) {
    const requiredExp = Math.pow(i, 2) * 1440
    if (exp >= requiredExp) {
      level = i
    } else {
      break
    }
  }
  return level
}

/**
 * Tính cảnh giới dựa trên level
 * @param {number} level - Level hiện tại
 * @returns {string} - Tên cảnh giới
 */
export function calculateRealm(level) {
  if (level < 10) return 'Phàm cảnh'
  if (level < 50) return 'Luyện Khí cảnh'
  if (level < 100) return 'Trúc Cơ cảnh'
  if (level < 200) return 'Kim Đan cảnh'
  if (level < 500) return 'Nguyên Anh cảnh'
  if (level < 1000) return 'Hóa Thần cảnh'
  return 'Hợp Thể cảnh'
}

/**
 * Tính thời gian cần để lên level tiếp theo (với tu luyện cơ bản)
 * @param {number} currentLevel - Level hiện tại
 * @param {number} currentExp - EXP hiện có
 * @returns {object} - Thông tin thời gian
 */
export function calculateTimeToNextLevel(currentLevel, currentExp) {
  const nextLevelExp = calculateNextLevelExp(currentLevel)
  const expNeeded = nextLevelExp - currentExp
  
  // Tu luyện mỗi 6 giây, mỗi lần +1000 EXP
  const cultivationsNeeded = Math.ceil(expNeeded / 1000)
  const secondsNeeded = cultivationsNeeded * 6
  const daysNeeded = secondsNeeded / (24 * 60 * 60)
  
  return {
    expNeeded,
    cultivationsNeeded,
    secondsNeeded,
    daysNeeded: Math.round(daysNeeded * 100) / 100
  }
}

/**
 * Tính tổng thời gian để lên cảnh giới cao nhất từ level 1
 * @returns {object} - Thông tin thời gian tổng
 */
export function calculateTotalTimeToMaxLevel() {
  const maxLevelExp = calculateNextLevelExp(1000) // 1,440,000,000 EXP
  const cultivationsNeeded = Math.ceil(maxLevelExp / 1000)
  const secondsNeeded = cultivationsNeeded * 6
  const daysNeeded = secondsNeeded / (24 * 60 * 60)
  
  return {
    maxLevelExp,
    cultivationsNeeded,
    secondsNeeded,
    daysNeeded: Math.round(daysNeeded * 100) / 100
  }
}

/**
 * Lấy thông tin cảnh giới
 * @param {number} level - Level hiện tại
 * @returns {object} - Thông tin cảnh giới
 */
export function getRealmInfo(level) {
  const realms = [
    { name: 'Phàm cảnh', min: 1, max: 9, color: '#6b7280' },
    { name: 'Luyện Khí cảnh', min: 10, max: 49, color: '#3b82f6' },
    { name: 'Trúc Cơ cảnh', min: 50, max: 99, color: '#10b981' },
    { name: 'Kim Đan cảnh', min: 100, max: 199, color: '#f59e0b' },
    { name: 'Nguyên Anh cảnh', min: 200, max: 499, color: '#ef4444' },
    { name: 'Hóa Thần cảnh', min: 500, max: 999, color: '#8b5cf6' },
    { name: 'Hợp Thể cảnh', min: 1000, max: 1000, color: '#f97316' }
  ]

  const currentRealm = realms.find(realm => level >= realm.min && level <= realm.max) || realms[0]
  const nextRealm = realms.find(realm => realm.min > level) || realms[realms.length - 1]

  return {
    currentRealm,
    nextRealm,
    isMaxLevel: level >= 1000
  }
}
