const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedCharacter() {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu nhân vật...')

    // Seed equipment types
    const equipmentTypes = [
      {
        name: 'weapon',
        displayName: 'Vũ Khí',
        description: 'Vũ khí chiến đấu',
        slot: 'weapon',
        icon: '⚔️'
      },
      {
        name: 'armor',
        displayName: 'Giáp',
        description: 'Áo giáp bảo vệ',
        slot: 'armor',
        icon: '🛡️'
      },
      {
        name: 'helmet',
        displayName: 'Mũ',
        description: 'Mũ bảo vệ đầu',
        slot: 'helmet',
        icon: '⛑️'
      },
      {
        name: 'accessory',
        displayName: 'Trang Sức',
        description: 'Trang sức tăng cường',
        slot: 'accessory',
        icon: '💍'
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

    // Seed equipments
    const equipments = [
      {
        name: 'wooden_sword',
        displayName: 'Kiếm Gỗ',
        description: 'Kiếm gỗ cơ bản cho người mới',
        typeId: (await prisma.equipmentType.findFirst({ where: { name: 'weapon' } })).id,
        rarity: 'common',
        level: 1,
        stats: JSON.stringify({ attack: 5, speed: 2 }),
        requirements: JSON.stringify({ level: 1 }),
        price: 100,
        icon: '🗡️'
      },
      {
        name: 'iron_sword',
        displayName: 'Kiếm Sắt',
        description: 'Kiếm sắt mạnh mẽ',
        typeId: (await prisma.equipmentType.findFirst({ where: { name: 'weapon' } })).id,
        rarity: 'uncommon',
        level: 5,
        stats: JSON.stringify({ attack: 15, speed: 3 }),
        requirements: JSON.stringify({ level: 5 }),
        price: 500,
        icon: '⚔️'
      },
      {
        name: 'leather_armor',
        displayName: 'Giáp Da',
        description: 'Giáp da nhẹ nhàng',
        typeId: (await prisma.equipmentType.findFirst({ where: { name: 'armor' } })).id,
        rarity: 'common',
        level: 1,
        stats: JSON.stringify({ defense: 8, hp: 20 }),
        requirements: JSON.stringify({ level: 1 }),
        price: 150,
        icon: '🦺'
      },
      {
        name: 'chain_mail',
        displayName: 'Giáp Xích',
        description: 'Giáp xích bảo vệ tốt',
        typeId: (await prisma.equipmentType.findFirst({ where: { name: 'armor' } })).id,
        rarity: 'uncommon',
        level: 5,
        stats: JSON.stringify({ defense: 20, hp: 50 }),
        requirements: JSON.stringify({ level: 5 }),
        price: 800,
        icon: '🛡️'
      },
      {
        name: 'lucky_ring',
        displayName: 'Nhẫn May Mắn',
        description: 'Nhẫn tăng may mắn',
        typeId: (await prisma.equipmentType.findFirst({ where: { name: 'accessory' } })).id,
        rarity: 'rare',
        level: 3,
        stats: JSON.stringify({ luck: 10, wisdom: 5 }),
        requirements: JSON.stringify({ level: 3 }),
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

    console.log('✅ Đã seed equipments')

    // Seed skills
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
        damage: 10,
        effects: JSON.stringify({ damage: 10, critChance: 0.05 }),
        requirements: JSON.stringify({ level: 1 }),
        icon: '⚔️'
      },
      {
        name: 'cultivation_meditation',
        displayName: 'Thiền Định Tu Luyện',
        description: 'Tăng tốc độ tu luyện',
        category: 'cultivation',
        type: 'passive',
        level: 1,
        maxLevel: 5,
        cooldown: 0,
        mpCost: 0,
        damage: 0,
        effects: JSON.stringify({ expMultiplier: 1.2 }),
        requirements: JSON.stringify({ level: 3 }),
        icon: '🧘'
      },
      {
        name: 'healing_technique',
        displayName: 'Kỹ Thuật Hồi Máu',
        description: 'Hồi phục máu',
        category: 'combat',
        type: 'active',
        level: 1,
        maxLevel: 8,
        cooldown: 30,
        mpCost: 20,
        damage: 0,
        effects: JSON.stringify({ heal: 50, healMultiplier: 1.5 }),
        requirements: JSON.stringify({ level: 5 }),
        icon: '💚'
      },
      {
        name: 'spirit_enhancement',
        displayName: 'Tăng Cường Tinh Thần',
        description: 'Tăng tạm thời các thuộc tính',
        category: 'buff',
        type: 'active',
        level: 1,
        maxLevel: 6,
        cooldown: 60,
        mpCost: 30,
        damage: 0,
        effects: JSON.stringify({ 
          attack: 15, 
          defense: 10, 
          speed: 8, 
          duration: 300 
        }),
        requirements: JSON.stringify({ level: 7 }),
        icon: '✨'
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

    // Tạo stats cho tất cả players hiện có
    const players = await prisma.player.findMany()
    for (const player of players) {
      // Tạo stats mặc định
      await prisma.playerStats.upsert({
        where: { playerId: player.id },
        update: {},
        create: {
          playerId: player.id,
          hp: 100 + (player.level * 10),
          mp: 50 + (player.level * 5),
          attack: 10 + (player.level * 2),
          defense: 5 + player.level,
          speed: 8 + Math.floor(player.level / 2),
          luck: 5,
          wisdom: 5,
          strength: 5 + Math.floor(player.level / 3),
          agility: 5 + Math.floor(player.level / 3),
          vitality: 5 + Math.floor(player.level / 3),
          spirit: 5 + Math.floor(player.level / 3)
        }
      })

      // Thêm một số trang bị cơ bản
      const woodenSword = await prisma.equipment.findFirst({ where: { name: 'wooden_sword' } })
      const leatherArmor = await prisma.equipment.findFirst({ where: { name: 'leather_armor' } })
      
      if (woodenSword) {
        await prisma.playerEquipment.upsert({
          where: {
            playerId_equipmentId: {
              playerId: player.id,
              equipmentId: woodenSword.id
            }
          },
          update: {},
          create: {
            playerId: player.id,
            equipmentId: woodenSword.id,
            isEquipped: true
          }
        })
      }

      if (leatherArmor) {
        await prisma.playerEquipment.upsert({
          where: {
            playerId_equipmentId: {
              playerId: player.id,
              equipmentId: leatherArmor.id
            }
          },
          update: {},
          create: {
            playerId: player.id,
            equipmentId: leatherArmor.id,
            isEquipped: true
          }
        })
      }

      // Học kỹ năng cơ bản
      const basicAttack = await prisma.skill.findFirst({ where: { name: 'basic_attack' } })
      if (basicAttack) {
        await prisma.playerSkill.upsert({
          where: {
            playerId_skillId: {
              playerId: player.id,
              skillId: basicAttack.id
            }
          },
          update: {},
          create: {
            playerId: player.id,
            skillId: basicAttack.id,
            isLearned: true,
            learnedAt: new Date()
          }
        })
      }
    }

    console.log('✅ Đã tạo stats và trang bị cho players')

    console.log('🎉 Seed dữ liệu nhân vật hoàn tất!')
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu nhân vật:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCharacter()
