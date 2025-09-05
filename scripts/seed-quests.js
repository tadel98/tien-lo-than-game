const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const quests = [
  // Nhiệm vụ lặp lại 5 phút
  {
    name: 'quest_repeat_5min_1',
    displayName: 'Tu Luyện Nhanh',
    description: 'Tu luyện trong 5 phút để nhận phần thưởng nhỏ',
    category: 'cultivation',
    difficulty: 'easy',
    isRepeatable: true,
    repeatInterval: 5, // 5 phút
    rewards: JSON.stringify({
      experience: 500,
      resources: {
        tien_ngoc: 50,
        linh_thach: 25
      }
    }),
    requirements: JSON.stringify({
      cultivation_sessions: 1
    })
  },
  {
    name: 'quest_repeat_5min_2',
    displayName: 'Thu Thập Nhanh',
    description: 'Thu thập tài nguyên trong 5 phút',
    category: 'resource',
    difficulty: 'easy',
    isRepeatable: true,
    repeatInterval: 5,
    rewards: JSON.stringify({
      experience: 300,
      resources: {
        tien_ngoc: 30,
        linh_thach: 15
      }
    }),
    requirements: JSON.stringify({
      resource_collection: 1
    })
  },

  // Nhiệm vụ lặp lại 10 phút
  {
    name: 'quest_repeat_10min_1',
    displayName: 'Tu Luyện Trung Bình',
    description: 'Tu luyện trong 10 phút để nhận phần thưởng tốt hơn',
    category: 'cultivation',
    difficulty: 'easy',
    isRepeatable: true,
    repeatInterval: 10,
    rewards: JSON.stringify({
      experience: 1000,
      resources: {
        tien_ngoc: 100,
        linh_thach: 50
      }
    }),
    requirements: JSON.stringify({
      cultivation_sessions: 2
    })
  },
  {
    name: 'quest_repeat_10min_2',
    displayName: 'Chế Tạo Đơn Giản',
    description: 'Chế tạo 1 món đồ trong 10 phút',
    category: 'crafting',
    difficulty: 'easy',
    isRepeatable: true,
    repeatInterval: 10,
    rewards: JSON.stringify({
      experience: 800,
      resources: {
        tien_ngoc: 80,
        linh_thach: 40
      }
    }),
    requirements: JSON.stringify({
      items_crafted: 1
    })
  },

  // Nhiệm vụ lặp lại 15 phút
  {
    name: 'quest_repeat_15min_1',
    displayName: 'Tu Luyện Chuyên Sâu',
    description: 'Tu luyện trong 15 phút để nhận phần thưởng lớn',
    category: 'cultivation',
    difficulty: 'medium',
    isRepeatable: true,
    repeatInterval: 15,
    rewards: JSON.stringify({
      experience: 2000,
      resources: {
        tien_ngoc: 200,
        linh_thach: 100
      }
    }),
    requirements: JSON.stringify({
      cultivation_sessions: 3
    })
  },
  {
    name: 'quest_repeat_15min_2',
    displayName: 'Săn Linh Thú',
    description: 'Bắt 1 linh thú trong 15 phút',
    category: 'spirit_beast',
    difficulty: 'medium',
    isRepeatable: true,
    repeatInterval: 15,
    rewards: JSON.stringify({
      experience: 1500,
      resources: {
        tien_ngoc: 150,
        linh_thach: 75
      }
    }),
    requirements: JSON.stringify({
      spirit_beasts_captured: 1
    })
  },

  // Nhiệm vụ lặp lại 20 phút
  {
    name: 'quest_repeat_20min_1',
    displayName: 'Tu Luyện Cao Cấp',
    description: 'Tu luyện trong 20 phút để nhận phần thưởng cao cấp',
    category: 'cultivation',
    difficulty: 'medium',
    isRepeatable: true,
    repeatInterval: 20,
    rewards: JSON.stringify({
      experience: 3000,
      resources: {
        tien_ngoc: 300,
        linh_thach: 150
      }
    }),
    requirements: JSON.stringify({
      cultivation_sessions: 5
    })
  },
  {
    name: 'quest_repeat_20min_2',
    displayName: 'Thợ Rèn Chuyên Nghiệp',
    description: 'Chế tạo 3 món đồ trong 20 phút',
    category: 'crafting',
    difficulty: 'medium',
    isRepeatable: true,
    repeatInterval: 20,
    rewards: JSON.stringify({
      experience: 2500,
      resources: {
        tien_ngoc: 250,
        linh_thach: 125
      }
    }),
    requirements: JSON.stringify({
      items_crafted: 3
    })
  },

  // Nhiệm vụ dễ (không lặp lại)
  {
    name: 'quest_beginner_1',
    displayName: 'Bước Đầu Tu Luyện',
    description: 'Hoàn thành lần tu luyện đầu tiên để làm quen với hệ thống',
    category: 'cultivation',
    difficulty: 'easy',
    isRepeatable: false,
    repeatInterval: null,
    rewards: JSON.stringify({
      experience: 1000,
      resources: {
        tien_ngoc: 100,
        linh_thach: 50
      }
    }),
    requirements: JSON.stringify({
      cultivation_sessions: 1
    })
  },
  {
    name: 'quest_beginner_2',
    displayName: 'Thu Thập Tài Nguyên',
    description: 'Thu thập 100 Tiên Ngọc để mua trang bị cơ bản',
    category: 'resource',
    difficulty: 'easy',
    rewards: JSON.stringify({
      experience: 2000,
      resources: {
        tien_ngoc: 200,
        linh_thach: 100
      }
    }),
    requirements: JSON.stringify({
      tien_ngoc: 100
    })
  },
  {
    name: 'quest_beginner_3',
    displayName: 'Nâng Cấp Trang Bị',
    description: 'Mua và trang bị 1 món đồ từ cửa hàng',
    category: 'equipment',
    difficulty: 'easy',
    rewards: JSON.stringify({
      experience: 3000,
      resources: {
        tien_ngoc: 300,
        linh_thach: 150
      }
    }),
    requirements: JSON.stringify({
      equipment_purchased: 1
    })
  },
  {
    name: 'quest_beginner_4',
    displayName: 'Khám Phá Thiên Phú',
    description: 'Mở khóa 1 thiên phú để tăng cường sức mạnh',
    category: 'talent',
    difficulty: 'easy',
    rewards: JSON.stringify({
      experience: 4000,
      resources: {
        tien_ngoc: 400,
        linh_thach: 200
      }
    }),
    requirements: JSON.stringify({
      talents_unlocked: 1
    })
  },
  {
    name: 'quest_beginner_5',
    displayName: 'Chinh Phục Linh Thú',
    description: 'Bắt được 1 linh thú đầu tiên',
    category: 'spirit_beast',
    difficulty: 'easy',
    rewards: JSON.stringify({
      experience: 5000,
      resources: {
        tien_ngoc: 500,
        linh_thach: 250
      }
    }),
    requirements: JSON.stringify({
      spirit_beasts_captured: 1
    })
  },

  // Nhiệm vụ trung bình
  {
    name: 'quest_intermediate_1',
    displayName: 'Tu Luyện Chuyên Sâu',
    description: 'Tu luyện 10 lần liên tiếp để nâng cao cảnh giới',
    category: 'cultivation',
    difficulty: 'medium',
    rewards: JSON.stringify({
      experience: 10000,
      resources: {
        tien_ngoc: 1000,
        linh_thach: 500
      }
    }),
    requirements: JSON.stringify({
      cultivation_sessions: 10
    })
  },
  {
    name: 'quest_intermediate_2',
    displayName: 'Thợ Rèn Tài Ba',
    description: 'Chế tạo 5 món đồ từ đạo lô',
    category: 'crafting',
    difficulty: 'medium',
    rewards: JSON.stringify({
      experience: 15000,
      resources: {
        tien_ngoc: 1500,
        linh_thach: 750
      }
    }),
    requirements: JSON.stringify({
      items_crafted: 5
    })
  },
  {
    name: 'quest_intermediate_3',
    displayName: 'Thợ Săn Linh Thú',
    description: 'Bắt được 5 linh thú khác nhau',
    category: 'spirit_beast',
    difficulty: 'medium',
    rewards: JSON.stringify({
      experience: 20000,
      resources: {
        tien_ngoc: 2000,
        linh_thach: 1000
      }
    }),
    requirements: JSON.stringify({
      spirit_beasts_captured: 5
    })
  },

  // Nhiệm vụ khó
  {
    name: 'quest_advanced_1',
    displayName: 'Đại Sư Tu Luyện',
    description: 'Tu luyện 100 lần để đạt được cảnh giới cao',
    category: 'cultivation',
    difficulty: 'hard',
    rewards: JSON.stringify({
      experience: 50000,
      resources: {
        tien_ngoc: 5000,
        linh_thach: 2500
      }
    }),
    requirements: JSON.stringify({
      cultivation_sessions: 100
    })
  },
  {
    name: 'quest_advanced_2',
    displayName: 'Thương Gia Tài Ba',
    description: 'Mua 20 món đồ từ cửa hàng',
    category: 'shop',
    difficulty: 'hard',
    rewards: JSON.stringify({
      experience: 75000,
      resources: {
        tien_ngoc: 7500,
        linh_thach: 3750
      }
    }),
    requirements: JSON.stringify({
      items_purchased: 20
    })
  },
  {
    name: 'quest_advanced_3',
    displayName: 'Chủ Nhân Linh Thú',
    description: 'Sở hữu 10 linh thú và nuôi dưỡng chúng',
    category: 'spirit_beast',
    difficulty: 'expert',
    rewards: JSON.stringify({
      experience: 100000,
      resources: {
        tien_ngoc: 10000,
        linh_thach: 5000
      }
    }),
    requirements: JSON.stringify({
      spirit_beasts_owned: 10,
      spirit_beasts_fed: 50
    })
  }
]

async function seedQuests() {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu nhiệm vụ...')

    // Xóa tất cả nhiệm vụ cũ
    await prisma.playerQuest.deleteMany()
    await prisma.quest.deleteMany()
    console.log('✅ Đã xóa dữ liệu nhiệm vụ cũ')

    // Tạo nhiệm vụ mới
    for (const quest of quests) {
      await prisma.quest.create({
        data: quest
      })
      console.log(`✅ Đã tạo nhiệm vụ: ${quest.displayName}`)
    }

    console.log(`🎉 Hoàn thành seed ${quests.length} nhiệm vụ!`)
  } catch (error) {
    console.error('❌ Lỗi seed nhiệm vụ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedQuests()
