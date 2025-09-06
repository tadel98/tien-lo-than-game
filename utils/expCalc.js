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
  11: 0.90,  // 90% fail
  12: 0.91,  // 91% fail
  13: 0.95,  // 95% fail
  14: 0.97,  // 97% fail
  15: 0.99   // 99% fail
};

// Tên các cảnh giới
const REALM_NAMES = [
  'Luyện Khí',      // 1
  'Trúc Cơ',        // 2
  'Kim Đan',        // 3
  'Nguyên Anh',     // 4
  'Hóa Thần',       // 5
  'Hợp Thể',        // 6
  'Đại Thừa'        // 7
];

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

// Lấy tên cảnh giới
export function getRealmName(realmIndex) {
  return REALM_NAMES[realmIndex - 1] || 'Unknown';
}

// Tính exp cần để lên tầng tiếp theo trong cảnh giới hiện tại
export function expToNextFloor(currentRealm, currentFloor) {
  if (currentFloor >= FLOORS) {
    return 0; // Đã max tầng trong cảnh giới này
  }
  
  const expDay = expPerDay(currentRealm);
  const nextFloor = currentFloor + 1;
  
  if (nextFloor <= 10) {
    // 10 tầng đầu luôn thành công
    return expDay;
  } else {
    // 5 tầng cuối có tỉ lệ fail
    const failRate = FAIL_RATES[nextFloor];
    const successRate = 1 - failRate;
    const expectedTries = 1 / successRate;
    return expDay * expectedTries;
  }
}

// Tính tỷ lệ thành công cho tầng
export function getSuccessRate(floor) {
  if (floor <= 10) {
    return 1.0; // 100% thành công
  }
  return 1 - (FAIL_RATES[floor] || 0);
}

// Tính exp cần để lên cảnh giới tiếp theo
export function expToNextRealm(currentRealm) {
  if (currentRealm >= REALMS) {
    return 0; // Đã max cảnh giới
  }
  return expForRealm(currentRealm + 1);
}

// Tính exp cần từ đầu đến cảnh giới và tầng hiện tại
export function expToCurrentLevel(realm, floor) {
  let totalExp = 0;
  
  // Exp từ các cảnh giới trước
  for (let r = 1; r < realm; r++) {
    totalExp += expForRealm(r);
  }
  
  // Exp từ các tầng trong cảnh giới hiện tại
  const expDay = expPerDay(realm);
  for (let f = 1; f < floor; f++) {
    if (f <= 10) {
      totalExp += expDay;
    } else {
      const failRate = FAIL_RATES[f];
      const successRate = 1 - failRate;
      const expectedTries = 1 / successRate;
      totalExp += expDay * expectedTries;
    }
  }
  
  return totalExp;
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
