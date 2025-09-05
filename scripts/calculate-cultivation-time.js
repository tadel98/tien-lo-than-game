// Script tính toán thời gian tu luyện với công thức mới
// 100 ngày online liên tục để lên cảnh giới cao nhất

function calculateNextLevelExp(level) {
  return Math.pow(level, 2) * 1440
}

function calculateLevelFromExp(exp) {
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

function calculateRealm(level) {
  if (level < 10) return 'Phàm cảnh'
  if (level < 50) return 'Luyện Khí cảnh'
  if (level < 100) return 'Trúc Cơ cảnh'
  if (level < 200) return 'Kim Đan cảnh'
  if (level < 500) return 'Nguyên Anh cảnh'
  if (level < 1000) return 'Hóa Thần cảnh'
  return 'Hợp Thể cảnh'
}

function calculateTimeToNextLevel(currentLevel, currentExp) {
  const nextLevelExp = calculateNextLevelExp(currentLevel)
  const expNeeded = nextLevelExp - currentExp
  
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

// Tính toán tổng thời gian để lên cảnh giới cao nhất
const maxLevelExp = calculateNextLevelExp(1000) // 1,440,000,000 EXP
const cultivationsNeeded = Math.ceil(maxLevelExp / 1000)
const secondsNeeded = cultivationsNeeded * 6
const daysNeeded = secondsNeeded / (24 * 60 * 60)

console.log('=== CÔNG THỨC TU LUYỆN MỚI ===')
console.log(`Công thức: EXP cần = level² × 1440`)
console.log(`Level 1000 cần: ${maxLevelExp.toLocaleString()} EXP`)
console.log(`Số lần tu luyện cần: ${cultivationsNeeded.toLocaleString()}`)
console.log(`Thời gian cần: ${daysNeeded.toFixed(2)} ngày`)
console.log(`Thời gian cần: ${Math.round(daysNeeded)} ngày (làm tròn)`)
console.log('')

// Tính toán cho một số level quan trọng
const importantLevels = [1, 10, 50, 100, 200, 500, 1000]

console.log('=== THÔNG TIN CÁC LEVEL QUAN TRỌNG ===')
importantLevels.forEach(level => {
  const exp = calculateNextLevelExp(level)
  const realm = calculateRealm(level)
  const timeInfo = calculateTimeToNextLevel(level, 0)
  
  console.log(`Level ${level} (${realm}):`)
  console.log(`  - EXP cần: ${exp.toLocaleString()}`)
  console.log(`  - Thời gian từ level 1: ${timeInfo.daysNeeded.toFixed(2)} ngày`)
  console.log('')
})

// Tính toán cho level hiện tại của người chơi
console.log('=== THÔNG TIN NGƯỜI CHƠI HIỆN TẠI ===')
const currentLevel = 3
const currentExp = 3500
const nextLevelExp = calculateNextLevelExp(currentLevel)
const timeToNext = calculateTimeToNextLevel(currentLevel, currentExp)

console.log(`Level hiện tại: ${currentLevel}`)
console.log(`EXP hiện có: ${currentExp.toLocaleString()}`)
console.log(`EXP cần cho level ${currentLevel + 1}: ${nextLevelExp.toLocaleString()}`)
console.log(`EXP còn thiếu: ${(nextLevelExp - currentExp).toLocaleString()}`)
console.log(`Thời gian để lên level ${currentLevel + 1}: ${timeToNext.daysNeeded.toFixed(2)} ngày`)
console.log('')

console.log('=== KẾT LUẬN ===')
console.log(`✅ Công thức mới đảm bảo cần đúng ${Math.round(daysNeeded)} ngày online liên tục`)
console.log(`✅ Tu luyện mỗi 6 giây, mỗi lần +1000 EXP`)
console.log(`✅ Để lên cảnh giới cao nhất (Hợp Thể cảnh - Level 1000)`)
