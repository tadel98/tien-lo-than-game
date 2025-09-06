const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateQuestCooldown() {
  console.log('🕐 Cập nhật quest cooldown thành số phút...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')

    // Xóa quests cũ
    await prisma.playerQuest.deleteMany({})
    await prisma.quest.deleteMany({})
    console.log('🗑️ Đã xóa quests cũ')

    // Tạo quests mới với cooldown theo phút
    const quests = [
      // Tutorial Quests (không cooldown)
      {
        name: 'tutorial_welcome',
        displayName: 'Chào Mừng Người Tu Luyện',
        description: 'Hoàn thành hướng dẫn cơ bản để nhận phần thưởng',
        category: 'tutorial',
        difficulty: 'easy',
        requirements: JSON.stringify({ level: 1 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 100, linh_thach: 500 },
          experience: 1000
        }),
        isRepeatable: false,
        isActive: true
      },
      {
        name: 'tutorial_cultivation',
        displayName: 'Tu Luyện Đầu Tiên',
        description: 'Thực hiện tu luyện lần đầu để hiểu cơ chế',
        category: 'tutorial',
        difficulty: 'easy',
        requirements: JSON.stringify({ level: 1 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 1000, huyen_luc: 200 },
          experience: 2000
        }),
        isRepeatable: false,
        isActive: true
      },

      // Quick Quests (5-15 phút)
      {
        name: 'quick_cultivation',
        displayName: 'Tu Luyện Nhanh',
        description: 'Tu luyện nhanh để tăng kinh nghiệm',
        category: 'quick',
        difficulty: 'easy',
        requirements: JSON.stringify({ level: 1 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 800, tien_ngoc: 20 },
          experience: 2000
        }),
        isRepeatable: true,
        repeatInterval: 5, // 5 phút
        isActive: true
      },
      {
        name: 'quick_meditation',
        displayName: 'Thiền Định Nhanh',
        description: 'Thiền định để tăng tu vi',
        category: 'quick',
        difficulty: 'easy',
        requirements: JSON.stringify({ level: 3 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 1200, tien_ngoc: 30 },
          experience: 3000
        }),
        isRepeatable: true,
        repeatInterval: 10, // 10 phút
        isActive: true
      },
      {
        name: 'quick_energy_gathering',
        displayName: 'Thu Thập Năng Lượng',
        description: 'Thu thập năng lượng thiên nhiên',
        category: 'quick',
        difficulty: 'easy',
        requirements: JSON.stringify({ level: 5 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 1500, huyen_luc: 100 },
          experience: 4000
        }),
        isRepeatable: true,
        repeatInterval: 15, // 15 phút
        isActive: true
      },

      // Short Quests (20-35 phút)
      {
        name: 'short_breakthrough',
        displayName: 'Đột Phá Ngắn',
        description: 'Thực hiện đột phá nhỏ để tăng level',
        category: 'short',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 8 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 80, linh_thach: 2000, nguyen_thach: 50 },
          experience: 8000
        }),
        isRepeatable: true,
        repeatInterval: 20, // 20 phút
        isActive: true
      },
      {
        name: 'short_spirit_beast',
        displayName: 'Săn Linh Thú Ngắn',
        description: 'Săn linh thú nhỏ để thu thập tài nguyên',
        category: 'short',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 12 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 2500, tien_ngoc: 60 },
          experience: 10000
        }),
        isRepeatable: true,
        repeatInterval: 25, // 25 phút
        isActive: true
      },
      {
        name: 'short_equipment_training',
        displayName: 'Luyện Tập Trang Bị',
        description: 'Luyện tập với trang bị để tăng độ bền',
        category: 'short',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 15 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 100, linh_thach: 3000 },
          experience: 12000
        }),
        isRepeatable: true,
        repeatInterval: 30, // 30 phút
        isActive: true
      },
      {
        name: 'short_talent_practice',
        displayName: 'Luyện Thiên Phú',
        description: 'Luyện tập thiên phú để tăng khả năng',
        category: 'short',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 18 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 120, linh_thach: 3500, nguyen_thach: 80 },
          experience: 15000
        }),
        isRepeatable: true,
        repeatInterval: 35, // 35 phút
        isActive: true
      },

      // Medium Quests (40-60 phút)
      {
        name: 'medium_cultivation_session',
        displayName: 'Phiên Tu Luyện Trung Bình',
        description: 'Phiên tu luyện dài để tăng đáng kể tu vi',
        category: 'medium',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 20 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 5000, tien_ngoc: 150 },
          experience: 20000
        }),
        isRepeatable: true,
        repeatInterval: 40, // 40 phút
        isActive: true
      },
      {
        name: 'medium_boss_hunt',
        displayName: 'Săn Boss Trung Bình',
        description: 'Săn boss mạnh để nhận phần thưởng lớn',
        category: 'medium',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 25, combatPower: 3000 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 200, linh_thach: 6000, nguyen_thach: 150 },
          experience: 25000
        }),
        isRepeatable: true,
        repeatInterval: 45, // 45 phút
        isActive: true
      },
      {
        name: 'medium_realm_exploration',
        displayName: 'Khám Phá Cảnh Giới',
        description: 'Khám phá cảnh giới mới để tìm tài nguyên quý',
        category: 'medium',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 30 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 250, linh_thach: 8000, nguyen_thach: 200 },
          experience: 30000
        }),
        isRepeatable: true,
        repeatInterval: 50, // 50 phút
        isActive: true
      },
      {
        name: 'medium_spirit_awakening',
        displayName: 'Thức Tỉnh Linh Hồn',
        description: 'Thức tỉnh linh hồn để tăng sức mạnh tinh thần',
        category: 'medium',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 35 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 300, linh_thach: 10000, nguyen_thach: 250 },
          experience: 35000
        }),
        isRepeatable: true,
        repeatInterval: 55, // 55 phút
        isActive: true
      },
      {
        name: 'medium_artifact_crafting',
        displayName: 'Chế Tạo Pháp Bảo',
        description: 'Chế tạo pháp bảo mạnh để tăng sức mạnh',
        category: 'medium',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 40 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 350, linh_thach: 12000, nguyen_thach: 300 },
          experience: 40000
        }),
        isRepeatable: true,
        repeatInterval: 60, // 60 phút
        isActive: true
      },

      // Long Quests (90-120 phút)
      {
        name: 'long_cultivation_marathon',
        displayName: 'Marathon Tu Luyện',
        description: 'Tu luyện liên tục trong thời gian dài',
        category: 'long',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 45 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 20000, tien_ngoc: 500 },
          experience: 60000
        }),
        isRepeatable: true,
        repeatInterval: 90, // 90 phút
        isActive: true
      },
      {
        name: 'long_dragon_slaying',
        displayName: 'Trảm Long',
        description: 'Đánh bại rồng để nhận phần thưởng huyền thoại',
        category: 'long',
        difficulty: 'expert',
        requirements: JSON.stringify({ level: 50, combatPower: 10000 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 800, linh_thach: 25000, nguyen_thach: 500 },
          experience: 80000
        }),
        isRepeatable: true,
        repeatInterval: 105, // 105 phút
        isActive: true
      },
      {
        name: 'long_realm_ascension',
        displayName: 'Thăng Cảnh Giới Cao',
        description: 'Thăng lên cảnh giới cao hơn',
        category: 'long',
        difficulty: 'expert',
        requirements: JSON.stringify({ level: 60 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1000, linh_thach: 30000, nguyen_thach: 600 },
          experience: 100000
        }),
        isRepeatable: true,
        repeatInterval: 120, // 120 phút
        isActive: true
      },

      // Story Quests (không cooldown)
      {
        name: 'story_combat_mastery',
        displayName: 'Luyện Tập Chiến Đấu',
        description: 'Tăng cường sức mạnh chiến đấu thông qua luyện tập',
        category: 'story',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 25 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 800, linh_thach: 20000 },
          experience: 40000
        }),
        isRepeatable: false,
        isActive: true
      },
      {
        name: 'story_talent_discovery',
        displayName: 'Khám Phá Thiên Phú',
        description: 'Khám phá và phát triển thiên phú của bản thân',
        category: 'story',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 30 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1200, linh_thach: 30000 },
          experience: 60000
        }),
        isRepeatable: false,
        isActive: true
      }
    ]

    // Tạo quests
    console.log('📝 Tạo quests với cooldown theo phút...')
    for (const questData of quests) {
      await prisma.quest.create({
        data: questData
      })
    }
    console.log(`✅ Đã tạo ${quests.length} quests`)

    // Gán quests cho tất cả players
    console.log('👥 Gán quests cho players...')
    const players = await prisma.player.findMany()
    const createdQuests = await prisma.quest.findMany()

    for (const player of players) {
      for (const quest of createdQuests) {
        // Chỉ gán quests phù hợp với level của player
        const requirements = JSON.parse(quest.requirements || '{}')
        const requiredLevel = requirements.level || 1

        if (player.level >= requiredLevel && quest.isActive) {
          await prisma.playerQuest.create({
            data: {
              playerId: player.id,
              questId: quest.id,
              status: quest.category === 'tutorial' ? 'available' : 'locked',
              progress: JSON.stringify({
                type: quest.name,
                description: quest.displayName,
                target: 1,
                current: 0
              }),
              startedAt: quest.category === 'tutorial' ? new Date() : null,
              completedAt: null
            }
          })
        }
      }
    }
    console.log(`✅ Đã gán quests cho ${players.length} players`)

    // Báo cáo kết quả
    const questCount = await prisma.quest.count()
    const playerQuestCount = await prisma.playerQuest.count()
    
    console.log(`\n📊 Kết quả:`)
    console.log(`- Quests: ${questCount}`)
    console.log(`- Player Quests: ${playerQuestCount}`)
    
    // Hiển thị cooldown breakdown
    console.log(`\n⏰ Cooldown Breakdown:`)
    console.log(`- Quick (5-15 phút): 3 quests`)
    console.log(`- Short (20-35 phút): 4 quests`)
    console.log(`- Medium (40-60 phút): 5 quests`)
    console.log(`- Long (90-120 phút): 3 quests`)
    console.log(`- Tutorial/Story (không cooldown): 4 quests`)

    console.log('🎉 Hoàn thành cập nhật quest cooldown!')
    
  } catch (error) {
    console.error('❌ Lỗi cập nhật quest cooldown:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateQuestCooldown()
