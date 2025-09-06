const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedAllGameData() {
  console.log('🌱 Bắt đầu seed tất cả dữ liệu game...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')
    
    // 1. Seed Resources
    await seedResources()
    
    // 2. Seed Companions
    await seedCompanions()
    
    // 3. Seed Achievements
    await seedAchievements()
    
    // 4. Seed Quests
    await seedQuests()
    
    // 5. Seed Equipment Types
    await seedEquipmentTypes()
    
    // 6. Seed Equipment
    await seedEquipment()
    
    // 7. Seed Skills
    await seedSkills()
    
    // 8. Seed Talent Types & Talents
    await seedTalents()
    
    // 9. Seed Buffs
    await seedBuffs()
    
    // 10. Seed Game Configs
    await seedGameConfigs()
    
    // 11. Seed Shops & Shop Items
    await seedShops()
    
    // 12. Seed Recipes
    await seedRecipes()
    
    // 13. Seed Dao Furnaces
    await seedFurnaces()
    
    // 14. Seed Spirit Beast Types
    await seedSpiritBeasts()
    
    // 15. Seed Beast Foods
    await seedBeastFoods()
    
    // 16. Seed Hunting Grounds
    await seedHuntingGrounds()
    
    console.log('🎉 Hoàn thành seed tất cả dữ liệu game!')
    
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function seedResources() {
  console.log('📦 Seeding resources...')
  
  const resources = [
    {
      name: 'tien_ngoc',
      displayName: 'Tiên Ngọc',
      description: 'Loại tiền tệ cao cấp trong game',
      icon: '💎',
      color: '#fbbf24'
    },
    {
      name: 'tien_ngoc_khoa',
      displayName: 'Tiên Ngọc Khóa',
      description: 'Tiên Ngọc bị khóa, không thể sử dụng',
      icon: '🔒',
      color: '#6b7280'
    },
    {
      name: 'linh_thach',
      displayName: 'Linh Thạch',
      description: 'Loại tiền tệ cơ bản trong game',
      icon: '💎',
      color: '#3b82f6'
    },
    {
      name: 'nguyen_thach',
      displayName: 'Nguyên Thạch',
      description: 'Loại tiền tệ phổ biến trong game',
      icon: '🪨',
      color: '#10b981'
    },
    {
      name: 'huyen_luc',
      displayName: 'Huyền Lực',
      description: 'Năng lượng huyền bí để tu luyện',
      icon: '⚡',
      color: '#8b5cf6'
    },
    {
      name: 'suc_manh_chien_dau',
      displayName: 'Sức Mạnh Chiến Đấu',
      description: 'Tổng sức mạnh chiến đấu của người chơi',
      icon: '⚔️',
      color: '#ef4444'
    }
  ]

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { name: resource.name },
      update: resource,
      create: resource
    })
  }
  
  console.log('✅ Đã seed resources')
}

async function seedCompanions() {
  console.log('📦 Seeding companions...')
  
  const companions = [
    {
      name: 'thien_hoa_tien_co',
      displayName: 'Thiên Hoa Tiên Cơ',
      description: 'Một tiên nữ xinh đẹp với sức mạnh thiên nhiên',
      icon: '🌸',
      rarity: 'legendary',
      basePower: 100
    },
    {
      name: 'ngan_long',
      displayName: 'Ngân Long',
      description: 'Rồng bạc hùng mạnh với sức mạnh nguyên tố',
      icon: '🐉',
      rarity: 'epic',
      basePower: 80
    },
    {
      name: 'phoenix_fire',
      displayName: 'Phượng Hoàng Lửa',
      description: 'Phượng hoàng với sức mạnh lửa thuần túy',
      icon: '🔥',
      rarity: 'legendary',
      basePower: 120
    },
    {
      name: 'ice_wolf',
      displayName: 'Băng Lang',
      description: 'Sói băng với khả năng kiểm soát băng',
      icon: '🐺',
      rarity: 'epic',
      basePower: 75
    }
  ]

  for (const companion of companions) {
    await prisma.companion.upsert({
      where: { name: companion.name },
      update: companion,
      create: companion
    })
  }
  
  console.log('✅ Đã seed companions')
}

async function seedAchievements() {
  console.log('📦 Seeding achievements...')
  
  const achievements = [
    {
      name: 'first_login',
      displayName: 'Lần Đầu Tiên',
      description: 'Đăng nhập lần đầu tiên',
      icon: '🎉',
      category: 'general',
      points: 10
    },
    {
      name: 'level_10',
      displayName: 'Tu Luyện Sơ Cấp',
      description: 'Đạt cấp độ 10',
      icon: '⭐',
      category: 'level',
      points: 50
    },
    {
      name: 'first_companion',
      displayName: 'Bạn Đồng Hành',
      description: 'Có bạn đồng hành đầu tiên',
      icon: '👥',
      category: 'companion',
      points: 30
    },
    {
      name: 'level_50',
      displayName: 'Tu Luyện Trung Cấp',
      description: 'Đạt cấp độ 50',
      icon: '🌟',
      category: 'level',
      points: 200
    },
    {
      name: 'legendary_companion',
      displayName: 'Thần Thú Đồng Hành',
      description: 'Có bạn đồng hành huyền thoại',
      icon: '👑',
      category: 'companion',
      points: 500
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: achievement,
      create: achievement
    })
  }
  
  console.log('✅ Đã seed achievements')
}

async function seedQuests() {
  console.log('📦 Seeding quests...')
  
  const quests = [
    {
      name: 'tutorial_1',
      displayName: 'Hướng Dẫn Cơ Bản',
      description: 'Hoàn thành hướng dẫn cơ bản',
      category: 'tutorial',
      difficulty: 'easy',
      rewards: JSON.stringify({
        experience: 100,
        resources: {
          linh_thach: 1000
        }
      }),
      requirements: JSON.stringify({
        level: 1
      })
    },
    {
      name: 'cultivation_1',
      displayName: 'Tu Luyện Đầu Tiên',
      description: 'Bắt đầu quá trình tu luyện',
      category: 'cultivation',
      difficulty: 'easy',
      rewards: JSON.stringify({
        experience: 200,
        resources: {
          huyen_luc: 100
        }
      }),
      requirements: JSON.stringify({
        level: 1
      })
    },
    {
      name: 'daily_cultivation',
      displayName: 'Tu Luyện Hàng Ngày',
      description: 'Tu luyện 30 phút mỗi ngày',
      category: 'daily',
      difficulty: 'easy',
      isRepeatable: true,
      repeatInterval: 1440, // 24 hours
      rewards: JSON.stringify({
        experience: 500,
        resources: {
          linh_thach: 2000,
          huyen_luc: 200
        }
      }),
      requirements: JSON.stringify({
        level: 5
      })
    },
    {
      name: 'weekly_boss',
      displayName: 'Thử Thách Boss Hàng Tuần',
      description: 'Đánh bại boss cấp cao',
      category: 'weekly',
      difficulty: 'hard',
      isRepeatable: true,
      repeatInterval: 10080, // 7 days
      rewards: JSON.stringify({
        experience: 5000,
        resources: {
          tien_ngoc: 100,
          equipment: 'legendary_sword'
        }
      }),
      requirements: JSON.stringify({
        level: 30,
        combatPower: 10000
      })
    }
  ]

  for (const quest of quests) {
    await prisma.quest.upsert({
      where: { name: quest.name },
      update: quest,
      create: quest
    })
  }
  
  console.log('✅ Đã seed quests')
}

async function seedEquipmentTypes() {
  console.log('📦 Seeding equipment types...')
  
  const equipmentTypes = [
    {
      name: 'weapon',
      displayName: 'Vũ Khí',
      description: 'Vũ khí để tấn công',
      slot: 'weapon',
      icon: '⚔️'
    },
    {
      name: 'armor',
      displayName: 'Áo Giáp',
      description: 'Áo giáp để phòng thủ',
      slot: 'armor',
      icon: '🛡️'
    },
    {
      name: 'accessory',
      displayName: 'Trang Sức',
      description: 'Trang sức tăng thuộc tính',
      slot: 'accessory',
      icon: '💍'
    },
    {
      name: 'helmet',
      displayName: 'Mũ',
      description: 'Mũ bảo vệ đầu',
      slot: 'helmet',
      icon: '🎩'
    }
  ]

  for (const type of equipmentTypes) {
    await prisma.equipmentType.upsert({
      where: { name: type.name },
      update: type,
      create: type
    })
  }
  
  console.log('✅ Đã seed equipment types')
}

async function seedEquipment() {
  console.log('📦 Seeding equipment...')
  
  const weaponType = await prisma.equipmentType.findFirst({ where: { name: 'weapon' } })
  const armorType = await prisma.equipmentType.findFirst({ where: { name: 'armor' } })
  const accessoryType = await prisma.equipmentType.findFirst({ where: { name: 'accessory' } })
  
  const equipments = [
    {
      name: 'iron_sword',
      displayName: 'Kiếm Sắt',
      description: 'Vũ khí cơ bản cho người mới',
      typeId: weaponType.id,
      rarity: 'common',
      level: 1,
      stats: JSON.stringify({ attack: 10, speed: 5 }),
      requirements: JSON.stringify({ level: 1 }),
      price: 100,
      icon: '⚔️'
    },
    {
      name: 'steel_sword',
      displayName: 'Kiếm Thép',
      description: 'Vũ khí mạnh hơn kiếm sắt',
      typeId: weaponType.id,
      rarity: 'uncommon',
      level: 10,
      stats: JSON.stringify({ attack: 25, speed: 8 }),
      requirements: JSON.stringify({ level: 10 }),
      price: 500,
      icon: '🗡️'
    },
    {
      name: 'leather_armor',
      displayName: 'Áo Da',
      description: 'Áo giáp cơ bản',
      typeId: armorType.id,
      rarity: 'common',
      level: 3,
      stats: JSON.stringify({ defense: 15, hp: 50 }),
      requirements: JSON.stringify({ level: 3 }),
      price: 200,
      icon: '🛡️'
    },
    {
      name: 'magic_ring',
      displayName: 'Nhẫn Ma Pháp',
      description: 'Tăng sức mạnh ma pháp',
      typeId: accessoryType.id,
      rarity: 'rare',
      level: 15,
      stats: JSON.stringify({ mp: 100, wisdom: 10 }),
      requirements: JSON.stringify({ level: 15 }),
      price: 1000,
      icon: '💍'
    }
  ]

  for (const equipment of equipments) {
    await prisma.equipment.upsert({
      where: { name: equipment.name },
      update: equipment,
      create: equipment
    })
  }
  
  console.log('✅ Đã seed equipment')
}

async function seedSkills() {
  console.log('📦 Seeding skills...')
  
  const skills = [
    {
      name: 'basic_attack',
      displayName: 'Tấn Công Cơ Bản',
      description: 'Tấn công cơ bản với kiếm',
      category: 'combat',
      type: 'active',
      level: 1,
      maxLevel: 10,
      cooldown: 0,
      mpCost: 0,
      damage: 15,
      effects: JSON.stringify({ damage: 1.0 }),
      icon: '⚔️'
    },
    {
      name: 'fire_ball',
      displayName: 'Cầu Lửa',
      description: 'Bắn cầu lửa gây sát thương pháp thuật',
      category: 'magic',
      type: 'active',
      level: 1,
      maxLevel: 10,
      cooldown: 5,
      mpCost: 20,
      damage: 30,
      effects: JSON.stringify({ damage: 1.5, element: 'fire' }),
      icon: '🔥'
    },
    {
      name: 'heal',
      displayName: 'Trị Thương',
      description: 'Hồi phục máu cho bản thân',
      category: 'magic',
      type: 'active',
      level: 1,
      maxLevel: 8,
      cooldown: 10,
      mpCost: 25,
      damage: 0,
      effects: JSON.stringify({ heal: 50 }),
      icon: '💚'
    },
    {
      name: 'sword_mastery',
      displayName: 'Kiếm Pháp Thông Thần',
      description: 'Tăng sức mạnh khi sử dụng kiếm',
      category: 'passive',
      type: 'passive',
      level: 1,
      maxLevel: 10,
      cooldown: 0,
      mpCost: 0,
      damage: 0,
      effects: JSON.stringify({ attack: 0.1 }),
      icon: '🗡️'
    }
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: skill,
      create: skill
    })
  }
  
  console.log('✅ Đã seed skills')
}

async function seedTalents() {
  console.log('📦 Seeding talents...')
  
  // Seed talent types
  const talentTypes = [
    {
      name: 'combat',
      displayName: 'Chiến Đấu',
      description: 'Tăng cường khả năng chiến đấu',
      icon: '⚔️',
      color: '#ef4444'
    },
    {
      name: 'cultivation',
      displayName: 'Tu Luyện',
      description: 'Tăng tốc độ tu luyện và cảnh giới',
      icon: '🧘',
      color: '#8b5cf6'
    },
    {
      name: 'defense',
      displayName: 'Phòng Thủ',
      description: 'Tăng cường khả năng phòng thủ',
      icon: '🛡️',
      color: '#10b981'
    },
    {
      name: 'utility',
      displayName: 'Tiện Ích',
      description: 'Các tài năng hỗ trợ',
      icon: '✨',
      color: '#06b6d4'
    },
    {
      name: 'special',
      displayName: 'Đặc Biệt',
      description: 'Tài năng đặc biệt hiếm có',
      icon: '🌟',
      color: '#f59e0b'
    }
  ]

  for (const type of talentTypes) {
    await prisma.talentType.upsert({
      where: { name: type.name },
      update: type,
      create: type
    })
  }

  // Seed talents
  const combatType = await prisma.talentType.findFirst({ where: { name: 'combat' } })
  const cultivationType = await prisma.talentType.findFirst({ where: { name: 'cultivation' } })
  const defenseType = await prisma.talentType.findFirst({ where: { name: 'defense' } })
  const utilityType = await prisma.talentType.findFirst({ where: { name: 'utility' } })
  const specialType = await prisma.talentType.findFirst({ where: { name: 'special' } })

  const talents = [
    {
      name: 'sword_mastery',
      displayName: 'Kiếm Pháp Thông Thần',
      description: 'Tăng sức mạnh tấn công và tốc độ khi sử dụng kiếm',
      typeId: combatType.id,
      rarity: 'common',
      level: 1,
      maxLevel: 10,
      effects: JSON.stringify({ attack: 5, speed: 2 }),
      requirements: JSON.stringify({ level: 1 }),
      cost: 100,
      icon: '🗡️'
    },
    {
      name: 'cultivation_speed',
      displayName: 'Thiên Tư Tu Luyện',
      description: 'Tăng tốc độ tu luyện và nhận kinh nghiệm',
      typeId: cultivationType.id,
      rarity: 'uncommon',
      level: 1,
      maxLevel: 8,
      effects: JSON.stringify({ expMultiplier: 1.2 }),
      requirements: JSON.stringify({ level: 5 }),
      cost: 500,
      icon: '⚡'
    },
    {
      name: 'iron_body',
      displayName: 'Thiết Thân Công',
      description: 'Tăng cường phòng thủ và máu',
      typeId: defenseType.id,
      rarity: 'common',
      level: 1,
      maxLevel: 10,
      effects: JSON.stringify({ defense: 8, hp: 20 }),
      requirements: JSON.stringify({ level: 3 }),
      cost: 200,
      icon: '🛡️'
    },
    {
      name: 'lucky_star',
      displayName: 'Cát Tinh Chiếu Mệnh',
      description: 'Tăng may mắn và tỷ lệ rơi đồ',
      typeId: utilityType.id,
      rarity: 'rare',
      level: 1,
      maxLevel: 6,
      effects: JSON.stringify({ luck: 10, dropRate: 1.15 }),
      requirements: JSON.stringify({ level: 10 }),
      cost: 1000,
      icon: '🍀'
    },
    {
      name: 'spirit_awakening',
      displayName: 'Thần Hồn Giác Tỉnh',
      description: 'Tăng tất cả thuộc tính cơ bản',
      typeId: specialType.id,
      rarity: 'legendary',
      level: 1,
      maxLevel: 5,
      effects: JSON.stringify({ 
        strength: 5, 
        agility: 5, 
        vitality: 5, 
        spirit: 5,
        wisdom: 5 
      }),
      requirements: JSON.stringify({ level: 20, realm: 'Luyện Khí' }),
      cost: 5000,
      icon: '🌟'
    }
  ]

  for (const talent of talents) {
    await prisma.talent.upsert({
      where: { name: talent.name },
      update: talent,
      create: talent
    })
  }
  
  console.log('✅ Đã seed talents')
}

async function seedBuffs() {
  console.log('📦 Seeding buffs...')
  
  const buffs = [
    {
      name: 'strength_potion',
      displayName: 'Thuốc Tăng Lực',
      description: 'Tăng sức mạnh tạm thời',
      type: 'buff',
      category: 'stat',
      effects: JSON.stringify({ strength: 10 }),
      duration: 3600, // 1 giờ
      stackable: false,
      icon: '💪'
    },
    {
      name: 'cultivation_meditation',
      displayName: 'Thiền Định Tu Luyện',
      description: 'Tăng tốc độ tu luyện',
      type: 'buff',
      category: 'cultivation',
      effects: JSON.stringify({ expMultiplier: 1.5 }),
      duration: 7200, // 2 giờ
      stackable: false,
      icon: '🧘'
    },
    {
      name: 'blessing_of_luck',
      displayName: 'Phước Lộc Thiên Ban',
      description: 'Tăng may mắn và tỷ lệ rơi đồ',
      type: 'buff',
      category: 'utility',
      effects: JSON.stringify({ luck: 20, dropRate: 1.3 }),
      duration: 1800, // 30 phút
      stackable: false,
      icon: '🍀'
    },
    {
      name: 'poison_curse',
      displayName: 'Độc Chú',
      description: 'Giảm sức mạnh và tốc độ',
      type: 'debuff',
      category: 'stat',
      effects: JSON.stringify({ attack: -15, speed: -10 }),
      duration: 600, // 10 phút
      stackable: true,
      icon: '☠️'
    }
  ]

  for (const buff of buffs) {
    await prisma.buff.upsert({
      where: { name: buff.name },
      update: buff,
      create: buff
    })
  }
  
  console.log('✅ Đã seed buffs')
}

async function seedGameConfigs() {
  console.log('📦 Seeding game configs...')
  
  const configs = [
    {
      key: 'max_level',
      value: '1000',
      type: 'number',
      category: 'player'
    },
    {
      key: 'experience_multiplier',
      value: '1.0',
      type: 'number',
      category: 'player'
    },
    {
      key: 'resource_cap',
      value: '999999999',
      type: 'number',
      category: 'resources'
    },
    {
      key: 'combat_power_formula',
      value: '(level * 100) + (attack * 10) + (defense * 5) + (speed * 3)',
      type: 'string',
      category: 'combat'
    },
    {
      key: 'cultivation_speed_base',
      value: '1.0',
      type: 'number',
      category: 'cultivation'
    }
  ]

  for (const config of configs) {
    await prisma.gameConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config
    })
  }
  
  console.log('✅ Đã seed game configs')
}

async function seedShops() {
  console.log('📦 Seeding shops...')
  
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

  for (const shop of shops) {
    await prisma.shop.upsert({
      where: { name: shop.name },
      update: shop,
      create: shop
    })
  }

  // Seed shop items
  const generalShop = await prisma.shop.findFirst({ where: { name: 'general_shop' } })
  const equipmentShop = await prisma.shop.findFirst({ where: { name: 'equipment_shop' } })
  
  const shopItems = [
    {
      shopId: generalShop.id,
      itemType: 'consumable',
      itemId: 'health_potion_001',
      name: 'health_potion',
      displayName: 'Thuốc Hồi Máu',
      description: 'Hồi phục 100 HP',
      price: 50,
      currency: 'tien_ngoc',
      stock: -1,
      level: 1,
      rarity: 'common',
      icon: '🧪'
    },
    {
      shopId: generalShop.id,
      itemType: 'consumable',
      itemId: 'mana_potion_001',
      name: 'mana_potion',
      displayName: 'Thuốc Hồi MP',
      description: 'Hồi phục 50 MP',
      price: 30,
      currency: 'tien_ngoc',
      stock: -1,
      level: 1,
      rarity: 'common',
      icon: '💙'
    },
    {
      shopId: equipmentShop.id,
      itemType: 'equipment',
      itemId: 'iron_sword_001',
      name: 'iron_sword',
      displayName: 'Kiếm Sắt',
      description: 'Vũ khí cơ bản cho người mới',
      price: 200,
      currency: 'tien_ngoc',
      stock: 10,
      level: 5,
      rarity: 'common',
      icon: '⚔️'
    }
  ]

  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { 
        shopId_itemId: {
          shopId: item.shopId,
          itemId: item.itemId
        }
      },
      update: item,
      create: item
    })
  }
  
  console.log('✅ Đã seed shops')
}

async function seedRecipes() {
  console.log('📦 Seeding recipes...')
  
  const recipes = [
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

  for (const recipe of recipes) {
    await prisma.recipe.upsert({
      where: { name: recipe.name },
      update: recipe,
      create: recipe
    })
  }
  
  console.log('✅ Đã seed recipes')
}

async function seedFurnaces() {
  console.log('📦 Seeding furnaces...')
  
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

  for (const furnace of furnaces) {
    await prisma.daoFurnace.upsert({
      where: { name: furnace.name },
      update: furnace,
      create: furnace
    })
  }
  
  console.log('✅ Đã seed furnaces')
}

async function seedSpiritBeasts() {
  console.log('📦 Seeding spirit beasts...')
  
  const spiritBeastTypes = [
    {
      name: 'fire_dragon',
      displayName: 'Hỏa Long',
      description: 'Rồng lửa hùng mạnh với sức mạnh hỏa nguyên tố',
      category: 'legendary',
      baseStats: JSON.stringify({
        attack: 100,
        defense: 80,
        speed: 60,
        hp: 500
      }),
      growthRate: JSON.stringify({
        attack: 1.2,
        defense: 1.0,
        speed: 0.8,
        hp: 1.5
      }),
      skills: JSON.stringify(['fire_breath', 'dragon_roar', 'flame_shield']),
      icon: '🐉',
      color: '#ef4444'
    },
    {
      name: 'ice_wolf',
      displayName: 'Băng Lang',
      description: 'Sói băng với khả năng kiểm soát băng',
      category: 'epic',
      baseStats: JSON.stringify({
        attack: 70,
        defense: 60,
        speed: 90,
        hp: 300
      }),
      growthRate: JSON.stringify({
        attack: 1.0,
        defense: 0.9,
        speed: 1.3,
        hp: 1.2
      }),
      skills: JSON.stringify(['ice_claw', 'frost_bite', 'snow_storm']),
      icon: '🐺',
      color: '#06b6d4'
    },
    {
      name: 'thunder_bird',
      displayName: 'Lôi Điểu',
      description: 'Chim sét với tốc độ siêu nhanh',
      category: 'rare',
      baseStats: JSON.stringify({
        attack: 80,
        defense: 40,
        speed: 120,
        hp: 250
      }),
      growthRate: JSON.stringify({
        attack: 1.1,
        defense: 0.7,
        speed: 1.5,
        hp: 1.0
      }),
      skills: JSON.stringify(['lightning_strike', 'thunder_dash', 'storm_call']),
      icon: '⚡',
      color: '#fbbf24'
    }
  ]

  for (const beastType of spiritBeastTypes) {
    await prisma.spiritBeastType.upsert({
      where: { name: beastType.name },
      update: beastType,
      create: beastType
    })
  }
  
  console.log('✅ Đã seed spirit beast types')
}

async function seedBeastFoods() {
  console.log('📦 Seeding beast foods...')
  
  const beastFoods = [
    {
      name: 'basic_food',
      displayName: 'Thức Ăn Cơ Bản',
      description: 'Thức ăn cơ bản cho linh thú',
      category: 'basic',
      effects: JSON.stringify({
        happiness: 10,
        hunger: 20
      }),
      price: 10,
      currency: 'linh_thach',
      icon: '🍖'
    },
    {
      name: 'premium_food',
      displayName: 'Thức Ăn Cao Cấp',
      description: 'Thức ăn cao cấp tăng nhiều thuộc tính',
      category: 'premium',
      effects: JSON.stringify({
        happiness: 25,
        hunger: 50,
        exp: 100
      }),
      price: 50,
      currency: 'tien_ngoc',
      icon: '🥩'
    },
    {
      name: 'special_food',
      displayName: 'Thức Ăn Đặc Biệt',
      description: 'Thức ăn đặc biệt với hiệu ứng mạnh',
      category: 'special',
      effects: JSON.stringify({
        happiness: 50,
        hunger: 100,
        exp: 300,
        stats: { attack: 5, defense: 5 }
      }),
      price: 200,
      currency: 'tien_ngoc',
      icon: '🍯'
    }
  ]

  for (const food of beastFoods) {
    await prisma.beastFood.upsert({
      where: { name: food.name },
      update: food,
      create: food
    })
  }
  
  console.log('✅ Đã seed beast foods')
}

async function seedHuntingGrounds() {
  console.log('📦 Seeding hunting grounds...')
  
  const huntingGrounds = [
    {
      name: 'beginner_forest',
      displayName: 'Rừng Người Mới',
      description: 'Khu vực săn bắt dành cho người mới',
      level: 1,
      maxLevel: 10,
      difficulty: 'easy',
      beastTypes: JSON.stringify(['ice_wolf', 'thunder_bird']),
      dropRates: JSON.stringify({
        'ice_wolf': 0.6,
        'thunder_bird': 0.4
      }),
      icon: '🌲'
    },
    {
      name: 'mystic_mountains',
      displayName: 'Núi Thần Bí',
      description: 'Vùng núi với linh thú mạnh mẽ',
      level: 20,
      maxLevel: 50,
      difficulty: 'normal',
      beastTypes: JSON.stringify(['fire_dragon', 'ice_wolf']),
      dropRates: JSON.stringify({
        'fire_dragon': 0.3,
        'ice_wolf': 0.7
      }),
      icon: '🏔️'
    },
    {
      name: 'dragon_lair',
      displayName: 'Hang Rồng',
      description: 'Hang động của rồng cổ đại',
      level: 50,
      maxLevel: 100,
      difficulty: 'extreme',
      beastTypes: JSON.stringify(['fire_dragon']),
      dropRates: JSON.stringify({
        'fire_dragon': 1.0
      }),
      icon: '🐉'
    }
  ]

  for (const ground of huntingGrounds) {
    await prisma.huntingGround.upsert({
      where: { name: ground.name },
      update: ground,
      create: ground
    })
  }
  
  console.log('✅ Đã seed hunting grounds')
}

// Chạy seed
seedAllGameData()
