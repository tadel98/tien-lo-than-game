import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Mock boss data - trong thực tế sẽ lấy từ database
    const bosses = [
      {
        id: 'demon_lord',
        name: 'Ma Vương Hắc Ám',
        level: 10,
        hp: 5000,
        maxHp: 5000,
        attack: 300,
        defense: 200,
        speed: 150,
        combatPower: 15000,
        rewards: {
          exp: 5000, // Tăng EXP
          tien_ngoc: 500,
          linh_thach: 200,
          items: [
            { id: 'demon_sword', name: 'Kiếm Ma Vương', rarity: 'epic', dropRate: 0.3 },
            { id: 'dark_armor', name: 'Áo Giáp Hắc Ám', rarity: 'rare', dropRate: 0.5 }
          ]
        },
        description: 'Ma vương hùng mạnh từ địa ngục, sở hữu sức mạnh khủng khiếp.',
        icon: '👹',
        difficulty: 'hard'
      },
      {
        id: 'dragon_king',
        name: 'Long Vương Cổ Đại',
        level: 20,
        hp: 15000,
        maxHp: 15000,
        attack: 800,
        defense: 600,
        speed: 300,
        combatPower: 50000,
        rewards: {
          exp: 15000, // Tăng EXP
          tien_ngoc: 2000,
          linh_thach: 1000,
          items: [
            { id: 'dragon_scale', name: 'Vảy Rồng', rarity: 'legendary', dropRate: 0.1 },
            { id: 'dragon_heart', name: 'Trái Tim Rồng', rarity: 'epic', dropRate: 0.3 },
            { id: 'ancient_sword', name: 'Kiếm Cổ Đại', rarity: 'legendary', dropRate: 0.2 }
          ]
        },
        description: 'Long vương cổ đại với sức mạnh vô song, chỉ có những cao thủ mới dám thách thức.',
        icon: '🐉',
        difficulty: 'extreme'
      },
      {
        id: 'phoenix_emperor',
        name: 'Phượng Hoàng Đế',
        level: 30,
        hp: 30000,
        maxHp: 30000,
        attack: 1500,
        defense: 1200,
        speed: 500,
        combatPower: 100000,
        rewards: {
          exp: 50000, // Tăng EXP
          tien_ngoc: 8000,
          linh_thach: 5000,
          items: [
            { id: 'phoenix_feather', name: 'Lông Phượng Hoàng', rarity: 'legendary', dropRate: 0.05 },
            { id: 'emperor_crown', name: 'Vương Miện Đế', rarity: 'legendary', dropRate: 0.1 },
            { id: 'divine_armor', name: 'Áo Giáp Thần Thánh', rarity: 'legendary', dropRate: 0.15 }
          ]
        },
        description: 'Phượng hoàng đế với sức mạnh thần thánh, chỉ có những bậc thầy mới có thể đánh bại.',
        icon: '🔥',
        difficulty: 'godlike'
      },
      {
        id: 'shadow_assassin',
        name: 'Sát Thủ Bóng Tối',
        level: 5,
        hp: 2000,
        maxHp: 2000,
        attack: 150,
        defense: 80,
        speed: 200,
        combatPower: 5000,
        rewards: {
          exp: 1500, // Tăng EXP
          tien_ngoc: 150,
          linh_thach: 50,
          items: [
            { id: 'shadow_dagger', name: 'Dao Găm Bóng Tối', rarity: 'uncommon', dropRate: 0.4 },
            { id: 'stealth_cloak', name: 'Áo Choàng Tàng Hình', rarity: 'rare', dropRate: 0.3 }
          ]
        },
        description: 'Sát thủ bóng tối với tốc độ cao và sát thương lớn.',
        icon: '🗡️',
        difficulty: 'medium'
      }
    ]

    return {
      success: true,
      data: bosses
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi lấy danh sách boss'
    })
  }
})
