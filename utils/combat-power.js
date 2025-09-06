// Utility functions for combat power calculation

/**
 * Tính điểm cộng cho mỗi level
 * @param {number} level - Level hiện tại
 * @returns {number} - Số điểm cộng
 */
export function calculatePointsPerLevel(level) {
  // Công thức: 5 điểm cơ bản + 1 điểm mỗi 10 level
  return 5 + Math.floor(level / 10)
}

/**
 * Phân bổ điểm ngẫu nhiên vào các chỉ số
 * @param {object} currentStats - Stats hiện tại
 * @param {number} totalPoints - Tổng điểm cần phân bổ
 * @returns {object} - Stats sau khi cập nhật
 */
export function distributePoints(currentStats, totalPoints) {
  const stats = { ...currentStats }
  const statKeys = ['hp', 'mp', 'attack', 'defense', 'speed', 'luck', 'wisdom', 'strength', 'agility', 'vitality', 'spirit']
  
  for (let i = 0; i < totalPoints; i++) {
    const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)]
    stats[randomStat] = (stats[randomStat] || 0) + 1
  }
  
  return stats
}

/**
 * Tính sức mạnh chiến đấu dựa trên stats
 * @param {object} stats - Stats của người chơi
 * @returns {number} - Sức mạnh chiến đấu
 */
export function calculateCombatPower(stats) {
  if (!stats) return 0
  
  // Công thức: Tổng tất cả stats * 10 + bonus từ các stats chính
  const basePower = (stats.hp || 0) + (stats.mp || 0) + (stats.attack || 0) + (stats.defense || 0) + 
                   (stats.speed || 0) + (stats.luck || 0) + (stats.wisdom || 0) + 
                   (stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)
  
  // Bonus từ các stats chính
  const mainStatsBonus = ((stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)) * 2
  
  return Math.floor(basePower * 10 + mainStatsBonus)
}

/**
 * Tính sức mạnh chiến đấu với level và equipment
 * @param {object} player - Thông tin người chơi
 * @returns {number} - Sức mạnh chiến đấu
 */
export function calculateCombatPowerWithLevel(player) {
  if (!player.stats) return 0
  
  const baseStats = player.stats.base || player.stats
  const level = player.level || 1
  
  // Tính stats với bonus level (mỗi level tăng 10% stats)
  const totalStats = {
    hp: (baseStats.hp || 0) + Math.floor((baseStats.hp || 0) * 0.1 * level),
    mp: (baseStats.mp || 0) + Math.floor((baseStats.mp || 0) * 0.1 * level),
    attack: (baseStats.attack || 0) + Math.floor((baseStats.attack || 0) * 0.1 * level),
    defense: (baseStats.defense || 0) + Math.floor((baseStats.defense || 0) * 0.1 * level),
    speed: (baseStats.speed || 0) + Math.floor((baseStats.speed || 0) * 0.1 * level),
    luck: (baseStats.luck || 0) + Math.floor((baseStats.luck || 0) * 0.1 * level),
    wisdom: (baseStats.wisdom || 0) + Math.floor((baseStats.wisdom || 0) * 0.1 * level),
    strength: (baseStats.strength || 0) + Math.floor((baseStats.strength || 0) * 0.1 * level),
    agility: (baseStats.agility || 0) + Math.floor((baseStats.agility || 0) * 0.1 * level),
    vitality: (baseStats.vitality || 0) + Math.floor((baseStats.vitality || 0) * 0.1 * level),
    spirit: (baseStats.spirit || 0) + Math.floor((baseStats.spirit || 0) * 0.1 * level)
  }
  
  // Thêm bonus từ equipment
  let equipmentBonus = 0
  if (player.equipments) {
    player.equipments.forEach((equipment) => {
      if (equipment.equipment && equipment.equipment.stats) {
        const eqStats = equipment.equipment.stats
        equipmentBonus += (eqStats.strength || 0) + (eqStats.agility || 0) + 
                         (eqStats.wisdom || 0) + (eqStats.vitality || 0) +
                         (eqStats.attack || 0) + (eqStats.defense || 0) +
                         (eqStats.hp || 0) + (eqStats.mp || 0) + (eqStats.speed || 0)
      }
    })
  }
  
  // Công thức tính sức mạnh chiến đấu mới
  const basePower = totalStats.hp + totalStats.mp + totalStats.attack + totalStats.defense + 
                   totalStats.speed + totalStats.luck + totalStats.wisdom + 
                   totalStats.strength + totalStats.agility + totalStats.vitality + totalStats.spirit
  
  // Bonus từ level (mỗi level +1000 combat power)
  const levelBonus = level * 1000
  
  // Bonus từ equipment
  const equipmentPower = equipmentBonus * 5
  
  return Math.floor(basePower * 10 + equipmentPower + levelBonus)
}
