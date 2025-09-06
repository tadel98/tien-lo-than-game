const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedComprehensiveQuests() {
  console.log('🌱 Bắt đầu seed quests toàn diện...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')

    // Xóa quests cũ
    await prisma.playerQuest.deleteMany({})
    await prisma.quest.deleteMany({})
    console.log('🗑️ Đã xóa quests cũ')

    // Tạo quests mới với cấu trúc đúng
    const quests = [
      // Tutorial Quests
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
          resources: { linh_thach: 1000, tien_ngoc: 100 },
          experience: 2000
        }),
        isRepeatable: false,
        isActive: true
      },

      // Daily Quests
      {
        name: 'daily_cultivation',
        displayName: 'Tu Luyện Hàng Ngày',
        description: 'Tu luyện để tăng cường tu vi mỗi ngày',
        category: 'daily',
        difficulty: 'easy',
        requirements: JSON.stringify({ level: 1 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 2000, tien_ngoc: 50 },
          experience: 5000
        }),
        isRepeatable: true,
        repeatInterval: 1440, // 24 hours
        isActive: true
      },
      {
        name: 'daily_breakthrough',
        displayName: 'Đột Phá Hàng Ngày',
        description: 'Thực hiện đột phá để tăng level',
        category: 'daily',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 5 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 200, linh_thach: 5000, nguyen_thach: 100 },
          experience: 10000
        }),
        isRepeatable: true,
        repeatInterval: 1440,
        isActive: true
      },
      {
        name: 'daily_spirit_beast',
        displayName: 'Săn Linh Thú',
        description: 'Săn linh thú để thu thập tài nguyên',
        category: 'daily',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 10 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 3000, tien_ngoc: 150 },
          experience: 8000
        }),
        isRepeatable: true,
        repeatInterval: 1440,
        isActive: true
      },
      {
        name: 'daily_equipment_upgrade',
        displayName: 'Nâng Cấp Trang Bị',
        description: 'Nâng cấp trang bị để tăng sức mạnh',
        category: 'daily',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 15 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 300, linh_thach: 4000 },
          experience: 12000
        }),
        isRepeatable: true,
        repeatInterval: 1440,
        isActive: true
      },

      // Weekly Quests
      {
        name: 'weekly_boss_challenge',
        displayName: 'Thử Thách Boss Hàng Tuần',
        description: 'Đánh bại boss mạnh để nhận phần thưởng lớn',
        category: 'weekly',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 20, combatPower: 5000 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1000, linh_thach: 20000, nguyen_thach: 500 },
          experience: 50000
        }),
        isRepeatable: true,
        repeatInterval: 10080, // 7 days
        isActive: true
      },
      {
        name: 'weekly_cultivation_marathon',
        displayName: 'Marathon Tu Luyện',
        description: 'Tu luyện liên tục trong tuần để chứng minh quyết tâm',
        category: 'weekly',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 15 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 15000, tien_ngoc: 500 },
          experience: 30000
        }),
        isRepeatable: true,
        repeatInterval: 10080,
        isActive: true
      },
      {
        name: 'weekly_resource_hunter',
        displayName: 'Thợ Săn Tài Nguyên',
        description: 'Thu thập tài nguyên trong tuần',
        category: 'weekly',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 25 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 800, linh_thach: 25000, nguyen_thach: 400 },
          experience: 40000
        }),
        isRepeatable: true,
        repeatInterval: 10080,
        isActive: true
      },

      // Story Quests
      {
        name: 'story_realm_ascension',
        displayName: 'Thăng Cảnh Giới',
        description: 'Đạt đến cảnh giới mới trong hành trình tu luyện',
        category: 'story',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 50 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 2000, linh_thach: 50000, nguyen_thach: 1000 },
          experience: 100000
        }),
        isRepeatable: false,
        isActive: true
      },
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
      },

      // Special Quests
      {
        name: 'special_talent_awakening',
        displayName: 'Thức Tỉnh Thiên Phú',
        description: 'Kích hoạt thiên phú để tăng cường khả năng',
        category: 'special',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 30 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1200, linh_thach: 30000 },
          experience: 60000
        }),
        isRepeatable: false,
        isActive: true
      },
      {
        name: 'special_equipment_master',
        displayName: 'Bậc Thầy Trang Bị',
        description: 'Thu thập và nâng cấp trang bị mạnh',
        category: 'special',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 40 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1500, linh_thach: 40000, nguyen_thach: 800 },
          experience: 80000
        }),
        isRepeatable: false,
        isActive: true
      },
      {
        name: 'special_spirit_beast_tamer',
        displayName: 'Thợ Thuần Hóa Linh Thú',
        description: 'Thuần hóa và chăm sóc linh thú',
        category: 'special',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 35 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1000, linh_thach: 35000, nguyen_thach: 600 },
          experience: 70000
        }),
        isRepeatable: false,
        isActive: true
      },

      // Achievement Quests
      {
        name: 'achievement_level_milestone',
        displayName: 'Cột Mốc Cấp Độ',
        description: 'Đạt được cột mốc cấp độ quan trọng',
        category: 'achievement',
        difficulty: 'easy',
        requirements: JSON.stringify({ level: 10 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 300, linh_thach: 8000 },
          experience: 15000
        }),
        isRepeatable: false,
        isActive: true
      },
      {
        name: 'achievement_resource_collector',
        displayName: 'Thu Thập Tài Nguyên',
        description: 'Thu thập một lượng lớn tài nguyên',
        category: 'achievement',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 20 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 600, linh_thach: 15000, nguyen_thach: 300 },
          experience: 30000
        }),
        isRepeatable: false,
        isActive: true
      },
      {
        name: 'achievement_combat_legend',
        displayName: 'Huyền Thoại Chiến Đấu',
        description: 'Đạt được sức mạnh chiến đấu huyền thoại',
        category: 'achievement',
        difficulty: 'hard',
        requirements: JSON.stringify({ level: 50, combatPower: 50000 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 2500, linh_thach: 60000, nguyen_thach: 1500 },
          experience: 150000
        }),
        isRepeatable: false,
        isActive: true
      },

      // Event Quests
      {
        name: 'event_lunar_new_year',
        displayName: 'Tết Nguyên Đán',
        description: 'Tham gia sự kiện Tết để nhận phần thưởng đặc biệt',
        category: 'event',
        difficulty: 'easy',
        requirements: JSON.stringify({ level: 1 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 500, linh_thach: 5000 },
          experience: 10000
        }),
        isRepeatable: true,
        repeatInterval: 525600, // 1 year
        isActive: false // Sẽ kích hoạt khi có sự kiện
      },
      {
        name: 'event_double_exp',
        displayName: 'Sự Kiện Kinh Nghiệm Kép',
        description: 'Nhận gấp đôi kinh nghiệm trong sự kiện đặc biệt',
        category: 'event',
        difficulty: 'medium',
        requirements: JSON.stringify({ level: 20 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1000, linh_thach: 20000 },
          experience: 50000
        }),
        isRepeatable: true,
        repeatInterval: 10080, // 1 week
        isActive: false // Sẽ kích hoạt khi có sự kiện
      }
    ]

    // Tạo quests
    console.log('📝 Tạo quests...')
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

    console.log('🎉 Hoàn thành seed quests toàn diện!')
    
  } catch (error) {
    console.error('❌ Lỗi seed quests:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedComprehensiveQuests()
