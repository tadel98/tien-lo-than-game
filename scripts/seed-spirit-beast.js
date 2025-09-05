const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu Spirit Beast...')

  try {
    // Tạo các loại linh thú
    const beastTypes = [
      {
        name: 'fire_wolf',
        displayName: 'Hỏa Lang',
        description: 'Linh thú lửa hung dữ với tốc độ cao',
        category: 'common',
        baseStats: JSON.stringify({
          attack: 50,
          defense: 30,
          speed: 80,
          hp: 100,
          mp: 40
        }),
        growthRate: JSON.stringify({
          attack: 0.1,
          defense: 0.05,
          speed: 0.15,
          hp: 0.08,
          mp: 0.06
        }),
        skills: JSON.stringify(['Fire Claw', 'Howl', 'Dash']),
        icon: '🐺',
        color: '#ef4444'
      },
      {
        name: 'ice_tiger',
        displayName: 'Băng Hổ',
        description: 'Linh thú băng với sức mạnh phòng thủ',
        category: 'rare',
        baseStats: JSON.stringify({
          attack: 70,
          defense: 60,
          speed: 50,
          hp: 150,
          mp: 60
        }),
        growthRate: JSON.stringify({
          attack: 0.12,
          defense: 0.18,
          speed: 0.08,
          hp: 0.12,
          mp: 0.10
        }),
        skills: JSON.stringify(['Ice Claw', 'Frost Shield', 'Freeze']),
        icon: '🐅',
        color: '#3b82f6'
      },
      {
        name: 'thunder_eagle',
        displayName: 'Lôi Điểu',
        description: 'Linh thú sấm sét bay lượn trên cao',
        category: 'epic',
        baseStats: JSON.stringify({
          attack: 90,
          defense: 40,
          speed: 120,
          hp: 120,
          mp: 100
        }),
        growthRate: JSON.stringify({
          attack: 0.15,
          defense: 0.06,
          speed: 0.20,
          hp: 0.10,
          mp: 0.18
        }),
        skills: JSON.stringify(['Thunder Strike', 'Lightning Dash', 'Storm Call']),
        icon: '🦅',
        color: '#8b5cf6'
      },
      {
        name: 'earth_bear',
        displayName: 'Địa Gấu',
        description: 'Linh thú đất với sức mạnh và sức chịu đựng cao',
        category: 'legendary',
        baseStats: JSON.stringify({
          attack: 120,
          defense: 100,
          speed: 30,
          hp: 200,
          mp: 80
        }),
        growthRate: JSON.stringify({
          attack: 0.18,
          defense: 0.20,
          speed: 0.05,
          hp: 0.15,
          mp: 0.12
        }),
        skills: JSON.stringify(['Earth Slam', 'Rock Shield', 'Earthquake']),
        icon: '🐻',
        color: '#f59e0b'
      },
      {
        name: 'dragon_phoenix',
        displayName: 'Long Phượng',
        description: 'Linh thú huyền thoại kết hợp rồng và phượng',
        category: 'mythical',
        baseStats: JSON.stringify({
          attack: 200,
          defense: 150,
          speed: 100,
          hp: 300,
          mp: 200
        }),
        growthRate: JSON.stringify({
          attack: 0.25,
          defense: 0.22,
          speed: 0.18,
          hp: 0.20,
          mp: 0.25
        }),
        skills: JSON.stringify(['Dragon Breath', 'Phoenix Rebirth', 'Elemental Storm']),
        icon: '🐉',
        color: '#ef4444'
      }
    ]

    for (const beastTypeData of beastTypes) {
      const beastType = await prisma.spiritBeastType.upsert({
        where: { name: beastTypeData.name },
        update: beastTypeData,
        create: beastTypeData
      })
      console.log(`✅ Tạo loại linh thú: ${beastType.displayName}`)
    }

    // Tạo thức ăn cho linh thú
    const foods = [
      {
        name: 'basic_meat',
        displayName: 'Thịt Cơ Bản',
        description: 'Thịt thường cho linh thú',
        category: 'basic',
        effects: JSON.stringify({
          hunger: 20,
          happiness: 5,
          health: 10
        }),
        price: 10,
        currency: 'tien_ngoc',
        icon: '🥩'
      },
      {
        name: 'spirit_grass',
        displayName: 'Linh Thảo',
        description: 'Cỏ linh khí tăng sức khỏe',
        category: 'basic',
        effects: JSON.stringify({
          hunger: 15,
          happiness: 10,
          health: 25
        }),
        price: 15,
        currency: 'tien_ngoc',
        icon: '🌿'
      },
      {
        name: 'premium_fish',
        displayName: 'Cá Cao Cấp',
        description: 'Cá quý hiếm tăng hạnh phúc',
        category: 'premium',
        effects: JSON.stringify({
          hunger: 30,
          happiness: 25,
          health: 15,
          attack: 5
        }),
        price: 50,
        currency: 'linh_thach',
        icon: '🐟'
      },
      {
        name: 'dragon_fruit',
        displayName: 'Quả Rồng',
        description: 'Trái cây huyền thoại tăng toàn bộ stats',
        category: 'special',
        effects: JSON.stringify({
          hunger: 40,
          happiness: 30,
          health: 40,
          attack: 10,
          defense: 10,
          speed: 10
        }),
        price: 200,
        currency: 'tien_ngoc',
        icon: '🍎'
      }
    ]

    for (const foodData of foods) {
      const food = await prisma.beastFood.upsert({
        where: { name: foodData.name },
        update: foodData,
        create: foodData
      })
      console.log(`✅ Tạo thức ăn: ${food.displayName}`)
    }

    // Tạo khu vực săn
    const huntingGrounds = [
      {
        name: 'forest_entrance',
        displayName: 'Cổng Rừng',
        description: 'Khu vực săn cơ bản cho người mới',
        level: 1,
        maxLevel: 10,
        difficulty: 'easy',
        beastTypes: JSON.stringify({
          'fire_wolf': 0.7,
          'ice_tiger': 0.3
        }),
        dropRates: JSON.stringify({
          'Linh Thảo': 0.3,
          'Thịt Thú': 0.5,
          'Da Thú': 0.2
        }),
        icon: '🌲'
      },
      {
        name: 'mountain_peak',
        displayName: 'Đỉnh Núi',
        description: 'Khu vực săn nâng cao với linh thú mạnh',
        level: 10,
        maxLevel: 30,
        difficulty: 'normal',
        beastTypes: JSON.stringify({
          'ice_tiger': 0.5,
          'thunder_eagle': 0.4,
          'earth_bear': 0.1
        }),
        dropRates: JSON.stringify({
          'Linh Thảo': 0.4,
          'Tinh Thạch': 0.3,
          'Hồn Thạch': 0.1,
          'Thịt Thú': 0.6
        }),
        icon: '⛰️'
      },
      {
        name: 'dragon_valley',
        displayName: 'Thung Lũng Rồng',
        description: 'Khu vực săn nguy hiểm với linh thú huyền thoại',
        level: 30,
        maxLevel: 50,
        difficulty: 'hard',
        beastTypes: JSON.stringify({
          'earth_bear': 0.6,
          'dragon_phoenix': 0.1,
          'thunder_eagle': 0.3
        }),
        dropRates: JSON.stringify({
          'Hồn Thạch': 0.4,
          'Tinh Thạch': 0.6,
          'Vảy Rồng': 0.05,
          'Linh Thảo': 0.5
        }),
        icon: '🏔️'
      },
      {
        name: 'celestial_realm',
        displayName: 'Thiên Giới',
        description: 'Khu vực săn tối cao chỉ dành cho bậc thầy',
        level: 50,
        maxLevel: 100,
        difficulty: 'extreme',
        beastTypes: JSON.stringify({
          'dragon_phoenix': 0.8,
          'thunder_eagle': 0.2
        }),
        dropRates: JSON.stringify({
          'Vảy Rồng': 0.3,
          'Hồn Thạch': 0.8,
          'Tinh Thạch': 0.9,
          'Thiên Thạch': 0.1
        }),
        icon: '☁️'
      }
    ]

    for (const groundData of huntingGrounds) {
      const ground = await prisma.huntingGround.upsert({
        where: { name: groundData.name },
        update: groundData,
        create: groundData
      })
      console.log(`✅ Tạo khu vực săn: ${ground.displayName}`)
    }

    console.log('🎉 Hoàn thành seed dữ liệu Spirit Beast!')
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu Spirit Beast:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
