const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu Shop...')

  try {
    // Tạo các cửa hàng
    const shops = [
      {
        name: 'general_shop',
        displayName: 'Cửa Hàng Tổng Hợp',
        description: 'Cửa hàng bán đủ loại vật phẩm cơ bản',
        category: 'general',
        icon: '🏪'
      },
      {
        name: 'equipment_shop',
        displayName: 'Cửa Hàng Trang Bị',
        description: 'Chuyên bán vũ khí và áo giáp',
        category: 'equipment',
        icon: '⚔️'
      },
      {
        name: 'consumables_shop',
        displayName: 'Cửa Hàng Tiêu Hao',
        description: 'Thuốc men và vật phẩm tiêu dùng',
        category: 'consumables',
        icon: '🧪'
      },
      {
        name: 'materials_shop',
        displayName: 'Cửa Hàng Nguyên Liệu',
        description: 'Vật liệu chế tạo và luyện đan',
        category: 'materials',
        icon: '💎'
      }
    ]

    for (const shopData of shops) {
      const shop = await prisma.shop.upsert({
        where: { name: shopData.name },
        update: shopData,
        create: shopData
      })
      console.log(`✅ Tạo cửa hàng: ${shop.displayName}`)
    }

    // Tạo items cho cửa hàng tổng hợp
    const generalShop = await prisma.shop.findFirst({ where: { name: 'general_shop' } })
    
    const generalItems = [
      {
        name: 'health_potion',
        displayName: 'Thuốc Hồi Máu',
        description: 'Hồi phục 100 HP',
        itemType: 'consumable',
        itemId: 'health_potion_001',
        price: 50,
        currency: 'tien_ngoc',
        stock: -1,
        level: 1,
        rarity: 'common',
        icon: '🧪'
      },
      {
        name: 'mana_potion',
        displayName: 'Thuốc Hồi MP',
        description: 'Hồi phục 50 MP',
        itemType: 'consumable',
        itemId: 'mana_potion_001',
        price: 30,
        currency: 'tien_ngoc',
        stock: -1,
        level: 1,
        rarity: 'common',
        icon: '💙'
      },
      {
        name: 'iron_sword',
        displayName: 'Kiếm Sắt',
        description: 'Vũ khí cơ bản cho người mới',
        itemType: 'equipment',
        itemId: 'iron_sword_001',
        price: 200,
        currency: 'tien_ngoc',
        stock: 10,
        level: 5,
        rarity: 'common',
        icon: '⚔️'
      },
      {
        name: 'leather_armor',
        displayName: 'Áo Da',
        description: 'Áo giáp cơ bản',
        itemType: 'equipment',
        itemId: 'leather_armor_001',
        price: 150,
        currency: 'tien_ngoc',
        stock: 8,
        level: 3,
        rarity: 'common',
        icon: '🛡️'
      }
    ]

    for (const itemData of generalItems) {
      const item = await prisma.shopItem.upsert({
        where: { 
          shopId_itemId: {
            shopId: generalShop.id,
            itemId: itemData.itemId
          }
        },
        update: { ...itemData, shopId: generalShop.id },
        create: { ...itemData, shopId: generalShop.id }
      })
      console.log(`✅ Tạo item: ${item.displayName}`)
    }

    // Tạo items cho cửa hàng trang bị
    const equipmentShop = await prisma.shop.findFirst({ where: { name: 'equipment_shop' } })
    
    const equipmentItems = [
      {
        name: 'steel_sword',
        displayName: 'Kiếm Thép',
        description: 'Vũ khí mạnh hơn kiếm sắt',
        itemType: 'equipment',
        itemId: 'steel_sword_001',
        price: 500,
        currency: 'tien_ngoc',
        stock: 5,
        level: 10,
        rarity: 'uncommon',
        icon: '⚔️'
      },
      {
        name: 'chain_mail',
        displayName: 'Áo Giáp Xích',
        description: 'Áo giáp bảo vệ tốt',
        itemType: 'equipment',
        itemId: 'chain_mail_001',
        price: 400,
        currency: 'tien_ngoc',
        stock: 3,
        level: 8,
        rarity: 'uncommon',
        icon: '🛡️'
      },
      {
        name: 'magic_ring',
        displayName: 'Nhẫn Ma Pháp',
        description: 'Tăng sức mạnh ma pháp',
        itemType: 'equipment',
        itemId: 'magic_ring_001',
        price: 800,
        currency: 'tien_ngoc',
        stock: 2,
        level: 15,
        rarity: 'rare',
        icon: '💍'
      }
    ]

    for (const itemData of equipmentItems) {
      const item = await prisma.shopItem.upsert({
        where: { 
          shopId_itemId: {
            shopId: equipmentShop.id,
            itemId: itemData.itemId
          }
        },
        update: { ...itemData, shopId: equipmentShop.id },
        create: { ...itemData, shopId: equipmentShop.id }
      })
      console.log(`✅ Tạo item: ${item.displayName}`)
    }

    // Tạo items cho cửa hàng tiêu hao
    const consumablesShop = await prisma.shop.findFirst({ where: { name: 'consumables_shop' } })
    
    const consumableItems = [
      {
        name: 'greater_health_potion',
        displayName: 'Thuốc Hồi Máu Cao Cấp',
        description: 'Hồi phục 500 HP',
        itemType: 'consumable',
        itemId: 'greater_health_potion_001',
        price: 200,
        currency: 'tien_ngoc',
        stock: 20,
        level: 10,
        rarity: 'uncommon',
        icon: '🧪'
      },
      {
        name: 'cultivation_pill',
        displayName: 'Đan Tu Luyện',
        description: 'Tăng tốc độ tu luyện',
        itemType: 'consumable',
        itemId: 'cultivation_pill_001',
        price: 300,
        currency: 'linh_thach',
        stock: 15,
        level: 5,
        rarity: 'rare',
        icon: '💊'
      },
      {
        name: 'experience_scroll',
        displayName: 'Cuộn Kinh Nghiệm',
        description: 'Tăng kinh nghiệm trực tiếp',
        itemType: 'consumable',
        itemId: 'experience_scroll_001',
        price: 1000,
        currency: 'tien_ngoc',
        stock: 5,
        level: 20,
        rarity: 'epic',
        icon: '📜'
      }
    ]

    for (const itemData of consumableItems) {
      const item = await prisma.shopItem.upsert({
        where: { 
          shopId_itemId: {
            shopId: consumablesShop.id,
            itemId: itemData.itemId
          }
        },
        update: { ...itemData, shopId: consumablesShop.id },
        create: { ...itemData, shopId: consumablesShop.id }
      })
      console.log(`✅ Tạo item: ${item.displayName}`)
    }

    // Tạo items cho cửa hàng nguyên liệu
    const materialsShop = await prisma.shop.findFirst({ where: { name: 'materials_shop' } })
    
    const materialItems = [
      {
        name: 'iron_ore',
        displayName: 'Quặng Sắt',
        description: 'Nguyên liệu chế tạo vũ khí',
        itemType: 'material',
        itemId: 'iron_ore_001',
        price: 20,
        currency: 'nguyen_thach',
        stock: -1,
        level: 1,
        rarity: 'common',
        icon: '⛏️'
      },
      {
        name: 'spirit_herb',
        displayName: 'Linh Thảo',
        description: 'Thảo dược quý hiếm',
        itemType: 'material',
        itemId: 'spirit_herb_001',
        price: 100,
        currency: 'linh_thach',
        stock: 50,
        level: 5,
        rarity: 'uncommon',
        icon: '🌿'
      },
      {
        name: 'dragon_scale',
        displayName: 'Vảy Rồng',
        description: 'Vật liệu cực quý hiếm',
        itemType: 'material',
        itemId: 'dragon_scale_001',
        price: 5000,
        currency: 'tien_ngoc',
        stock: 1,
        level: 50,
        rarity: 'legendary',
        icon: '🐉'
      }
    ]

    for (const itemData of materialItems) {
      const item = await prisma.shopItem.upsert({
        where: { 
          shopId_itemId: {
            shopId: materialsShop.id,
            itemId: itemData.itemId
          }
        },
        update: { ...itemData, shopId: materialsShop.id },
        create: { ...itemData, shopId: materialsShop.id }
      })
      console.log(`✅ Tạo item: ${item.displayName}`)
    }

    console.log('🎉 Hoàn thành seed dữ liệu Shop!')
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu Shop:', error)
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
