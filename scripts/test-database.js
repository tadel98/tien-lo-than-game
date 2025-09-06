const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  console.log('🧪 Bắt đầu test database...')
  
  try {
    // Test 1: Kết nối database
    console.log('\n1️⃣ Test kết nối database...')
    await prisma.$connect()
    console.log('✅ Kết nối database thành công!')

    // Test 2: Kiểm tra tables
    console.log('\n2️⃣ Test kiểm tra tables...')
    
    // Test User table
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ User table: ${userCount} records`)
    } catch (error) {
      console.log(`❌ User table error: ${error.message}`)
    }

    // Test Player table
    try {
      const playerCount = await prisma.player.count()
      console.log(`✅ Player table: ${playerCount} records`)
    } catch (error) {
      console.log(`❌ Player table error: ${error.message}`)
    }

    // Test Resource table
    try {
      const resourceCount = await prisma.resource.count()
      console.log(`✅ Resource table: ${resourceCount} records`)
    } catch (error) {
      console.log(`❌ Resource table error: ${error.message}`)
    }

    // Test Quest table
    try {
      const questCount = await prisma.quest.count()
      console.log(`✅ Quest table: ${questCount} records`)
    } catch (error) {
      console.log(`❌ Quest table error: ${error.message}`)
    }

    // Test Companion table
    try {
      const companionCount = await prisma.companion.count()
      console.log(`✅ Companion table: ${companionCount} records`)
    } catch (error) {
      console.log(`❌ Companion table error: ${error.message}`)
    }

    // Test 3: Tạo test data
    console.log('\n3️⃣ Test tạo test data...')
    
    // Tạo test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword'
      }
    })
    console.log(`✅ Tạo test user: ${testUser.id}`)

    // Tạo test player
    const testPlayer = await prisma.player.upsert({
      where: { id: 'test-player-123' },
      update: {},
      create: {
        id: 'test-player-123',
        name: 'Test Player',
        level: 1,
        experience: 0,
        realm: 'Phàm cảnh',
        combatPower: 100,
        userId: testUser.id
      }
    })
    console.log(`✅ Tạo test player: ${testPlayer.id}`)

    // Test 4: Test auto cultivation
    console.log('\n4️⃣ Test auto cultivation...')
    
    // Simulate auto cultivation
    const expGain = 1000
    const newExp = testPlayer.experience + expGain
    
    // Check level up
    let newLevel = testPlayer.level
    let levelUp = false
    let levelGain = 0
    
    for (let level = testPlayer.level + 1; level <= 1000; level++) {
      const requiredExp = Math.pow(level, 2) * 1440
      if (newExp >= requiredExp) {
        newLevel = level
        levelUp = true
        levelGain = level - testPlayer.level
      } else {
        break
      }
    }

    // Update player
    const updatedPlayer = await prisma.player.update({
      where: { id: testPlayer.id },
      data: {
        experience: newExp,
        level: newLevel,
        updatedAt: new Date()
      }
    })

    console.log(`✅ Auto cultivation test: Level ${testPlayer.level} → ${updatedPlayer.level}`)
    if (levelUp) {
      console.log(`🎉 Level up! +${levelGain} level(s)`)
    }

    // Test 5: Test queries
    console.log('\n5️⃣ Test queries...')
    
    // Get all players
    const players = await prisma.player.findMany({
      take: 5,
      orderBy: { level: 'desc' }
    })
    console.log(`✅ Found ${players.length} players`)

    // Get player with resources
    const playerWithResources = await prisma.player.findUnique({
      where: { id: testPlayer.id },
      include: {
        resources: {
          include: {
            resource: true
          }
        }
      }
    })
    console.log(`✅ Player with resources: ${playerWithResources ? 'Found' : 'Not found'}`)

    // Test 6: Cleanup test data
    console.log('\n6️⃣ Cleanup test data...')
    
    await prisma.player.deleteMany({
      where: { id: { startsWith: 'test-player' } }
    })
    console.log('✅ Cleaned up test players')

    await prisma.user.deleteMany({
      where: { email: 'test@example.com' }
    })
    console.log('✅ Cleaned up test users')

    console.log('\n🎉 Tất cả tests đã hoàn thành thành công!')

  } catch (error) {
    console.error('❌ Database test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testDatabase()
