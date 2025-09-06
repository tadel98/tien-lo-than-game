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

    // Tạo quests mới
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
        level: 1,
        requirements: JSON.stringify({ level: 1 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 1000, huyen_luc: 200 },
          experience: 2000
        }),
        objectives: JSON.stringify({
          type: 'cultivate',
          description: 'Tu luyện 1 lần',
          target: 1,
          current: 0
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
        level: 1,
        requirements: JSON.stringify({ level: 1 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 2000, tien_ngoc: 50 },
          experience: 5000
        }),
        objectives: JSON.stringify({
          type: 'cultivate',
          description: 'Tu luyện 10 lần',
          target: 10,
          current: 0
        }),
        isRepeatable: true,
        isActive: true
      },
      {
        name: 'daily_breakthrough',
        displayName: 'Đột Phá Hàng Ngày',
        description: 'Thực hiện đột phá để tăng level',
        category: 'daily',
        difficulty: 'medium',
        level: 5,
        requirements: JSON.stringify({ level: 5 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 200, linh_thach: 5000, nguyen_thach: 100 },
          experience: 10000
        }),
        objectives: JSON.stringify({
          type: 'breakthrough',
          description: 'Đột phá 1 lần',
          target: 1,
          current: 0
        }),
        isRepeatable: true,
        isActive: true
      },
      {
        name: 'daily_spirit_beast',
        displayName: 'Săn Linh Thú',
        description: 'Săn linh thú để thu thập tài nguyên',
        category: 'daily',
        difficulty: 'medium',
        level: 10,
        requirements: JSON.stringify({ level: 10 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 3000, tien_ngoc: 150 },
          experience: 8000
        }),
        objectives: JSON.stringify({
          type: 'hunt_spirit_beast',
          description: 'Săn linh thú 5 lần',
          target: 5,
          current: 0
        }),
        isRepeatable: true,
        isActive: true
      },

      // Weekly Quests
      {
        name: 'weekly_boss_challenge',
        displayName: 'Thử Thách Boss Hàng Tuần',
        description: 'Đánh bại boss mạnh để nhận phần thưởng lớn',
        category: 'weekly',
        difficulty: 'hard',
        level: 20,
        requirements: JSON.stringify({ level: 20, combatPower: 5000 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1000, linh_thach: 20000, nguyen_thach: 500 },
          experience: 50000
        }),
        objectives: JSON.stringify({
          type: 'defeat_boss',
          description: 'Đánh bại boss cấp độ cao',
          target: 1,
          current: 0
        }),
        isRepeatable: true,
        isActive: true
      },
      {
        name: 'weekly_cultivation_marathon',
        displayName: 'Marathon Tu Luyện',
        description: 'Tu luyện liên tục trong tuần để chứng minh quyết tâm',
        category: 'weekly',
        difficulty: 'medium',
        level: 15,
        requirements: JSON.stringify({ level: 15 }),
        rewards: JSON.stringify({
          resources: { linh_thach: 15000, tien_ngoc: 500 },
          experience: 30000
        }),
        objectives: JSON.stringify({
          type: 'cultivate',
          description: 'Tu luyện 100 lần',
          target: 100,
          current: 0
        }),
        isRepeatable: true,
        isActive: true
      },

      // Story Quests
      {
        name: 'story_realm_ascension',
        displayName: 'Thăng Cảnh Giới',
        description: 'Đạt đến cảnh giới mới trong hành trình tu luyện',
        category: 'story',
        difficulty: 'hard',
        level: 50,
        requirements: JSON.stringify({ level: 50 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 2000, linh_thach: 50000, nguyen_thach: 1000 },
          experience: 100000
        }),
        objectives: JSON.stringify({
          type: 'reach_realm',
          description: 'Đạt đến cảnh giới Luyện Khí',
          target: 1,
          current: 0
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
        level: 25,
        requirements: JSON.stringify({ level: 25 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 800, linh_thach: 20000 },
          experience: 40000
        }),
        objectives: JSON.stringify({
          type: 'reach_combat_power',
          description: 'Đạt sức mạnh chiến đấu 10000',
          target: 10000,
          current: 0
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
        level: 30,
        requirements: JSON.stringify({ level: 30 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1200, linh_thach: 30000 },
          experience: 60000
        }),
        objectives: JSON.stringify({
          type: 'unlock_talent',
          description: 'Mở khóa 3 thiên phú',
          target: 3,
          current: 0
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
        level: 40,
        requirements: JSON.stringify({ level: 40 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 1500, linh_thach: 40000, nguyen_thach: 800 },
          experience: 80000
        }),
        objectives: JSON.stringify({
          type: 'equip_items',
          description: 'Trang bị 5 món đồ',
          target: 5,
          current: 0
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
        level: 10,
        requirements: JSON.stringify({ level: 10 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 300, linh_thach: 8000 },
          experience: 15000
        }),
        objectives: JSON.stringify({
          type: 'reach_level',
          description: 'Đạt level 25',
          target: 25,
          current: 0
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
        level: 20,
        requirements: JSON.stringify({ level: 20 }),
        rewards: JSON.stringify({
          resources: { tien_ngoc: 600, linh_thach: 15000, nguyen_thach: 300 },
          experience: 30000
        }),
        objectives: JSON.stringify({
          type: 'collect_resources',
          description: 'Thu thập 100000 Linh Thạch',
          target: 100000,
          current: 0
        }),
        isRepeatable: false,
        isActive: true
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

        if (player.level >= requiredLevel) {
          await prisma.playerQuest.create({
            data: {
              playerId: player.id,
              questId: quest.id,
              status: quest.category === 'tutorial' ? 'available' : 'locked',
              progress: quest.objectives || JSON.stringify({}),
              startedAt: quest.category === 'tutorial' ? new Date() : null,
              completedAt: null
            }
          })
        }
      }
    }
    console.log(`✅ Đã gán quests cho ${players.length} players`)

    console.log('🎉 Hoàn thành seed quests toàn diện!')
    
  } catch (error) {
    console.error('❌ Lỗi seed quests:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedComprehensiveQuests()
