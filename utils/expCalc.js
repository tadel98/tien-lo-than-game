// expCalc.js

// =======================
// CONFIG
// =======================
const BASE_EXP_PER_DAY = 2400000;  // Exp/ngày cảnh giới đầu (Luyện Khí)
const REALMS = 7;                  // 7 cảnh giới
const FLOORS = 15;                 // 15 tầng mỗi cảnh giới
const REALM_GROWTH = 0.05;         // +5% exp mỗi cảnh giới

// Tỷ lệ fail tầng 11-15
const FAIL_RATES = {
  11: 0.10,  // 10% fail
  12: 0.09,  // 9% fail
  13: 0.05,  // 5% fail
  14: 0.03,  // 3% fail
  15: 0.01   // 1% fail
};

// Tên các cảnh giới
const REALM_NAMES = {
  1: 'Luyện Khí',
  2: 'Trúc Cơ', 
  3: 'Kim Đan',
  4: 'Nguyên Anh',
  5: 'Hóa Thần',
  6: 'Luyện Hư',
  7: 'Đại Thừa'
};

// =======================
// FUNCTIONS
// =======================

// Exp/ngày theo cảnh giới
export function expPerDay(realmIndex) {
  return BASE_EXP_PER_DAY * Math.pow(1 + REALM_GROWTH, realmIndex - 1);
}

// Exp để hoàn thành 1 cảnh giới
export function expForRealm(realmIndex) {
  const expDay = expPerDay(realmIndex);
  let totalExp = 0;

  for (let floor = 1; floor <= FLOORS; floor++) {
    if (floor <= 10) {
      // 10 tầng đầu luôn thành công
      totalExp += expDay;
    } else {
      // 5 tầng cuối có tỉ lệ fail
      const failRate = FAIL_RATES[floor];
      const successRate = 1 - failRate;
      const expectedTries = 1 / successRate; // số lần trung bình phải thử
      totalExp += expDay * expectedTries;
    }
  }

  return totalExp;
}

// Exp tổng cần từ Luyện Khí 1 -> Đại Thừa 15
export function totalExpToMax() {
  let total = 0;
  for (let realm = 1; realm <= REALMS; realm++) {
    total += expForRealm(realm);
  }
  return total;
}

// Tính số ngày cần thiết so với thời gian cho trước
export function daysToMax(totalExp, days = 180) {
  const avgExpPerDay = (expPerDay(1) + expPerDay(REALMS)) / 2; // trung bình
  const totalExpPossible = avgExpPerDay * days;

  return {
    expNeed: totalExp,
    expCanFarm: totalExpPossible,
    canReach: totalExpPossible >= totalExp,
    daysRequired: Math.ceil(totalExp / avgExpPerDay)
  };
}

// Tính exp cần cho 1 tầng cụ thể
export function expForFloor(realmIndex, floor) {
  const expDay = expPerDay(realmIndex);
  
  if (floor <= 10) {
    return expDay; // 10 tầng đầu luôn thành công
  } else {
    const failRate = FAIL_RATES[floor];
    const successRate = 1 - failRate;
    const expectedTries = 1 / successRate;
    return expDay * expectedTries;
  }
}

// Tính exp cần để lên tầng tiếp theo
export function expToNextFloor(realmIndex, currentFloor) {
  if (currentFloor >= FLOORS) {
    return 0; // Đã max tầng
  }
  return expForFloor(realmIndex, currentFloor + 1);
}

// Tính exp cần để lên cảnh giới tiếp theo
export function expToNextRealm(currentRealmIndex) {
  if (currentRealmIndex >= REALMS) {
    return 0; // Đã max cảnh giới
  }
  
  let totalExp = 0;
  for (let floor = 1; floor <= FLOORS; floor++) {
    totalExp += expForFloor(currentRealmIndex, floor);
  }
  return totalExp;
}

// Tính tỷ lệ thành công cho tầng
export function getSuccessRate(floor) {
  if (floor <= 10) {
    return 1.0; // 100% thành công
  } else {
    return 1 - (FAIL_RATES[floor] || 0);
  }
}

// Lấy tên cảnh giới
export function getRealmName(realmIndex) {
  return REALM_NAMES[realmIndex] || `Cảnh Giới ${realmIndex}`;
}

// Tính exp cần từ đầu đến cảnh giới và tầng hiện tại
export function expToCurrentLevel(realmIndex, floor) {
  let totalExp = 0;
  
  // Exp từ các cảnh giới trước
  for (let realm = 1; realm < realmIndex; realm++) {
    totalExp += expForRealm(realm);
  }
  
  // Exp từ các tầng trong cảnh giới hiện tại
  for (let f = 1; f < floor; f++) {
    totalExp += expForFloor(realmIndex, f);
  }
  
  return totalExp;
}

// Tính exp cần để max level từ vị trí hiện tại
export function expToMaxFromCurrent(realmIndex, floor) {
  const totalMax = totalExpToMax();
  const current = expToCurrentLevel(realmIndex, floor);
  return totalMax - current;
}

// Tính thời gian cần thiết để lên tầng tiếp theo (ngày)
export function daysToNextFloor(realmIndex, currentFloor, expPerDay) {
  const expNeeded = expToNextFloor(realmIndex, currentFloor);
  return Math.ceil(expNeeded / expPerDay);
}

// Tính thời gian cần thiết để lên cảnh giới tiếp theo (ngày)
export function daysToNextRealm(currentRealmIndex, expPerDay) {
  const expNeeded = expToNextRealm(currentRealmIndex);
  return Math.ceil(expNeeded / expPerDay);
}

// =======================
// MAIN (for testing)
// =======================
export function calculateCultivationStats() {
  const expNeed = totalExpToMax();
  const result = daysToMax(expNeed, 180);

  console.log("======================================");
  console.log("⚔️   KẾT QUẢ TÍNH EXP TU LUYỆN");
  console.log("======================================");
  console.log("Tổng exp cần:", expNeed.toLocaleString());
  console.log("Exp có thể farm trong 180 ngày:", result.expCanFarm.toLocaleString());
  console.log("Đủ để max level trong 180 ngày?", result.canReach ? "✅ Có" : "❌ Không");
  console.log("Số ngày tối thiểu cần:", result.daysRequired, "ngày");
  console.log("======================================");
  
  return result;
}

// Export constants
export { BASE_EXP_PER_DAY, REALMS, FLOORS, REALM_GROWTH, FAIL_RATES, REALM_NAMES };
