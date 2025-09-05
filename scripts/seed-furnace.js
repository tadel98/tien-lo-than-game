const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu Dao Furnace...')

  try {
    // Tạo các lò đạo
    const furnaces = [
      {
        name: 'basic_furnace',
        displayName: 'Lò Đạo Cơ Bản',
        description: 'Lò đạo dành cho người mới bắt đầu',
        level: 1,
        maxLevel: 5,
        efficiency: 1.0,
        icon: '🔥'
      },
      {
        name: 'advanced_furnace',
        displayName: 'Lò Đạo Nâng Cao',
        description: 'Lò đạo với hiệu suất cao hơn',
        level: 1,
        maxLevel: 10,
        efficiency: 1.2,
        icon: '🔥🔥'
      },
      {
        name: 'master_furnace',
        displayName: 'Lò Đạo Bậc Thầy',
        description: 'Lò đạo cấp cao nhất',
        level: 1,
        maxLevel: 20,
        efficiency: 1.5,
        icon: '🔥🔥🔥'
      }
    ]

    for (const furnaceData of furnaces) {
      const furnace = await prisma.daoFurnace.upsert({
        where: { name: furnaceData.name },
        update: furnaceData,
        create: furnaceData
      })
      console.log(`✅ Tạo lò đạo: ${furnace.displayName}`)
    }

    // Tạo các công thức luyện đan
    const alchemyRecipes = [
      {
        name: 'health_potion_recipe',
        displayName: 'Công Thức Thuốc Hồi Máu',
        description: 'Chế tạo thuốc hồi máu cơ bản',
        category: 'alchemy',
        level: 1,
        successRate: 0.8,
        materials: JSON.stringify({
          'Linh Thảo': 2,
          'Nước Tinh Khiết': 1
        }),
        result: JSON.stringify({
          'Thuốc Hồi Máu': 1
        }),
        experience: 50,
        icon: '🧪'
      },
      {
        name: 'mana_potion_recipe',
        displayName: 'Công Thức Thuốc Hồi MP',
        description: 'Chế tạo thuốc hồi MP cơ bản',
        category: 'alchemy',
        level: 2,
        successRate: 0.75,
        materials: JSON.stringify({
          'Linh Thảo': 3,
          'Tinh Thạch': 1
        }),
        result: JSON.stringify({
          'Thuốc Hồi MP': 1
        }),
        experience: 60,
        icon: '💙'
      },
      {
        name: 'cultivation_pill_recipe',
        displayName: 'Công Thức Đan Tu Luyện',
        description: 'Chế tạo đan tu luyện nâng cao',
        category: 'alchemy',
        level: 5,
        successRate: 0.6,
        materials: JSON.stringify({
          'Linh Thảo': 5,
          'Tinh Thạch': 3,
          'Huyết Thảo': 2
        }),
        result: JSON.stringify({
          'Đan Tu Luyện': 1
        }),
        experience: 200,
        icon: '💊'
      }
    ]

    for (const recipeData of alchemyRecipes) {
      const recipe = await prisma.recipe.upsert({
        where: { name: recipeData.name },
        update: recipeData,
        create: recipeData
      })
      console.log(`✅ Tạo công thức: ${recipe.displayName}`)
    }

    // Tạo các công thức luyện khí
    const forgingRecipes = [
      {
        name: 'iron_sword_recipe',
        displayName: 'Công Thức Kiếm Sắt',
        description: 'Chế tạo kiếm sắt cơ bản',
        category: 'forging',
        level: 3,
        successRate: 0.7,
        materials: JSON.stringify({
          'Quặng Sắt': 5,
          'Than Đá': 3
        }),
        result: JSON.stringify({
          'Kiếm Sắt': 1
        }),
        experience: 100,
        icon: '⚔️'
      },
      {
        name: 'steel_sword_recipe',
        displayName: 'Công Thức Kiếm Thép',
        description: 'Chế tạo kiếm thép nâng cao',
        category: 'forging',
        level: 8,
        successRate: 0.5,
        materials: JSON.stringify({
          'Quặng Thép': 8,
          'Than Cốc': 5,
          'Linh Thạch': 2
        }),
        result: JSON.stringify({
          'Kiếm Thép': 1
        }),
        experience: 300,
        icon: '⚔️'
      },
      {
        name: 'magic_ring_recipe',
        displayName: 'Công Thức Nhẫn Ma Pháp',
        description: 'Chế tạo nhẫn ma pháp quý hiếm',
        category: 'forging',
        level: 15,
        successRate: 0.3,
        materials: JSON.stringify({
          'Vàng Thỏi': 3,
          'Tinh Thạch': 5,
          'Linh Thảo': 10,
          'Hồn Thạch': 1
        }),
        result: JSON.stringify({
          'Nhẫn Ma Pháp': 1
        }),
        experience: 500,
        icon: '💍'
      }
    ]

    for (const recipeData of forgingRecipes) {
      const recipe = await prisma.recipe.upsert({
        where: { name: recipeData.name },
        update: recipeData,
        create: recipeData
      })
      console.log(`✅ Tạo công thức: ${recipe.displayName}`)
    }

    // Tạo các công thức chế tạo
    const craftingRecipes = [
      {
        name: 'leather_armor_recipe',
        displayName: 'Công Thức Áo Da',
        description: 'Chế tạo áo da cơ bản',
        category: 'crafting',
        level: 2,
        successRate: 0.8,
        materials: JSON.stringify({
          'Da Thú': 3,
          'Chỉ Khâu': 2
        }),
        result: JSON.stringify({
          'Áo Da': 1
        }),
        experience: 80,
        icon: '🛡️'
      },
      {
        name: 'backpack_recipe',
        displayName: 'Công Thức Túi Đeo',
        description: 'Chế tạo túi đeo mở rộng không gian',
        category: 'crafting',
        level: 5,
        successRate: 0.7,
        materials: JSON.stringify({
          'Da Thú': 5,
          'Chỉ Khâu': 3,
          'Túi Không Gian': 1
        }),
        result: JSON.stringify({
          'Túi Đeo': 1
        }),
        experience: 150,
        icon: '🎒'
      },
      {
        name: 'cultivation_mat_recipe',
        displayName: 'Công Thức Thảm Tu Luyện',
        description: 'Chế tạo thảm tu luyện tăng hiệu quả',
        category: 'crafting',
        level: 10,
        successRate: 0.6,
        materials: JSON.stringify({
          'Lụa Tơ': 10,
          'Linh Thảo': 8,
          'Tinh Thạch': 5,
          'Huyền Vải': 3
        }),
        result: JSON.stringify({
          'Thảm Tu Luyện': 1
        }),
        experience: 400,
        icon: '🧘'
      }
    ]

    for (const recipeData of craftingRecipes) {
      const recipe = await prisma.recipe.upsert({
        where: { name: recipeData.name },
        update: recipeData,
        create: recipeData
      })
      console.log(`✅ Tạo công thức: ${recipe.displayName}`)
    }

    console.log('🎉 Hoàn thành seed dữ liệu Dao Furnace!')
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu Dao Furnace:', error)
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
