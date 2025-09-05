const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedTalent() {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu thiên phú...')

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

    console.log('✅ Đã seed talent types')

    // Seed talents
    const talents = [
      {
        name: 'sword_mastery',
        displayName: 'Kiếm Pháp Thông Thần',
        description: 'Tăng sức mạnh tấn công và tốc độ khi sử dụng kiếm',
        typeId: (await prisma.talentType.findFirst({ where: { name: 'combat' } })).id,
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
        typeId: (await prisma.talentType.findFirst({ where: { name: 'cultivation' } })).id,
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
        typeId: (await prisma.talentType.findFirst({ where: { name: 'defense' } })).id,
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
        typeId: (await prisma.talentType.findFirst({ where: { name: 'utility' } })).id,
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
        typeId: (await prisma.talentType.findFirst({ where: { name: 'special' } })).id,
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
      },
      {
        name: 'critical_strike',
        displayName: 'Bạo Kích Thần Công',
        description: 'Tăng tỷ lệ chí mạng và sát thương chí mạng',
        typeId: (await prisma.talentType.findFirst({ where: { name: 'combat' } })).id,
        rarity: 'epic',
        level: 1,
        maxLevel: 8,
        effects: JSON.stringify({ critChance: 0.05, critDamage: 0.2 }),
        requirements: JSON.stringify({ level: 15 }),
        cost: 2000,
        icon: '💥'
      },
      {
        name: 'mana_efficiency',
        displayName: 'Pháp Lực Tiết Kiệm',
        description: 'Giảm chi phí pháp lực cho kỹ năng',
        typeId: (await prisma.talentType.findFirst({ where: { name: 'utility' } })).id,
        rarity: 'uncommon',
        level: 1,
        maxLevel: 6,
        effects: JSON.stringify({ mp: 30 }),
        requirements: JSON.stringify({ level: 8 }),
        cost: 800,
        icon: '💙'
      },
      {
        name: 'dragon_blood',
        displayName: 'Long Huyết Thần Thông',
        description: 'Tăng sức mạnh và khả năng hồi phục',
        typeId: (await prisma.talentType.findFirst({ where: { name: 'special' } })).id,
        rarity: 'mythic',
        level: 1,
        maxLevel: 3,
        effects: JSON.stringify({ 
          strength: 15, 
          hp: 50,
          vitality: 10 
        }),
        requirements: JSON.stringify({ level: 30, realm: 'Kết Đan' }),
        cost: 10000,
        icon: '🐉'
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

    // Seed buffs
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

    // Tạo một số thiên phú cơ bản cho tất cả players
    const players = await prisma.player.findMany()
    for (const player of players) {
      // Mở khóa thiên phú cơ bản
      const basicTalents = await prisma.talent.findMany({
        where: {
          name: { in: ['sword_mastery', 'iron_body'] }
        }
      })

      for (const talent of basicTalents) {
        await prisma.playerTalent.upsert({
          where: {
            playerId_talentId: {
              playerId: player.id,
              talentId: talent.id
            }
          },
          update: {},
          create: {
            playerId: player.id,
            talentId: talent.id,
            isUnlocked: true,
            unlockedAt: new Date(),
            isActive: true
          }
        })
      }
    }

    console.log('✅ Đã tạo thiên phú cơ bản cho players')

    console.log('🎉 Seed dữ liệu thiên phú hoàn tất!')
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu thiên phú:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTalent()
