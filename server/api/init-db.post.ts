import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    console.log('🚀 Initializing database...')

    // Generate Prisma client
    console.log('📦 Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })

    // Push database schema
    console.log('🗄️ Pushing database schema...')
    execSync('npx prisma db push', { stdio: 'inherit' })

    // Seed resources
    console.log('🌱 Seeding resources...')
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

    // Seed companions
    console.log('🌱 Seeding companions...')
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
      }
    ]

    for (const companion of companions) {
      await prisma.companion.upsert({
        where: { name: companion.name },
        update: companion,
        create: companion
      })
    }

    // Seed quests
    console.log('🌱 Seeding quests...')
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
      }
    ]

    for (const quest of quests) {
      await prisma.quest.upsert({
        where: { name: quest.name },
        update: quest,
        create: quest
      })
    }

    // Seed achievements
    console.log('🌱 Seeding achievements...')
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
      }
    ]

    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: achievement,
        create: achievement
      })
    }

    // Seed game configs
    console.log('🌱 Seeding game configs...')
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
      }
    ]

    for (const config of configs) {
      await prisma.gameConfig.upsert({
        where: { key: config.key },
        update: config,
        create: config
      })
    }

    console.log('✅ Database initialization completed!')

    return {
      success: true,
      message: 'Database initialized successfully',
      data: {
        resources: resources.length,
        companions: companions.length,
        quests: quests.length,
        achievements: achievements.length,
        configs: configs.length
      }
    }
  } catch (error: any) {
    console.error('❌ Database initialization failed:', error)
    return {
      success: false,
      message: 'Database initialization failed',
      error: error.message
    }
  } finally {
    await prisma.$disconnect()
  }
})