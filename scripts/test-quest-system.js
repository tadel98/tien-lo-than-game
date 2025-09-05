const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testQuestSystem() {
  try {
    console.log('🧪 Bắt đầu test hệ thống nhiệm vụ...')

    // Lấy player ID
    const player = await prisma.player.findFirst()
    if (!player) {
      console.log('❌ Không tìm thấy người chơi')
      return
    }

    const playerId = player.id
    console.log(`👤 Test với người chơi: ${player.name} (ID: ${playerId})`)

    // Test 1: Lấy danh sách nhiệm vụ
    console.log('\n📋 Test 1: Lấy danh sách nhiệm vụ')
    const quests = await prisma.quest.findMany({
      orderBy: { difficulty: 'asc' }
    })
    console.log(`✅ Tìm thấy ${quests.length} nhiệm vụ`)

    // Test 2: Lấy nhiệm vụ của người chơi
    console.log('\n👤 Test 2: Lấy nhiệm vụ của người chơi')
    const playerQuests = await prisma.playerQuest.findMany({
      where: { playerId },
      include: { quest: true }
    })
    console.log(`✅ Người chơi có ${playerQuests.length} nhiệm vụ`)

    // Test 3: Test bắt đầu nhiệm vụ
    console.log('\n🚀 Test 3: Bắt đầu nhiệm vụ')
    const availableQuest = quests.find(q => 
      !playerQuests.some(pq => pq.questId === q.id)
    )

    if (availableQuest) {
      console.log(`📝 Bắt đầu nhiệm vụ: ${availableQuest.displayName}`)
      
      const playerQuest = await prisma.playerQuest.create({
        data: {
          playerId,
          questId: availableQuest.id,
          status: 'in_progress',
          startedAt: new Date(),
          progress: JSON.stringify({})
        }
      })
      console.log(`✅ Đã bắt đầu nhiệm vụ: ${playerQuest.id}`)

      // Test 4: Hoàn thành nhiệm vụ
      console.log('\n🎯 Test 4: Hoàn thành nhiệm vụ')
      
      // Cập nhật trạng thái hoàn thành
      await prisma.playerQuest.update({
        where: { id: playerQuest.id },
        data: {
          status: 'completed',
          completedAt: new Date()
        }
      })

      // Phân tích phần thưởng
      const rewards = JSON.parse(availableQuest.rewards)
      console.log(`💰 Phần thưởng: ${JSON.stringify(rewards, null, 2)}`)

      // Cập nhật kinh nghiệm
      if (rewards.experience) {
        const newExp = Number(player.experience) + Number(rewards.experience)
        await prisma.player.update({
          where: { id: playerId },
          data: { experience: newExp }
        })
        console.log(`📈 Cộng ${rewards.experience} EXP`)
      }

      // Cập nhật tài nguyên
      if (rewards.resources) {
        for (const [resourceName, amount] of Object.entries(rewards.resources)) {
          const resource = await prisma.resource.findFirst({
            where: { name: resourceName }
          })

          if (resource) {
            const playerResource = await prisma.playerResource.findFirst({
              where: {
                playerId,
                resourceId: resource.id
              }
            })

            if (playerResource) {
              await prisma.playerResource.update({
                where: { id: playerResource.id },
                data: {
                  amount: Number(playerResource.amount) + Number(amount)
                }
              })
              console.log(`💎 Cộng ${amount} ${resourceName}`)
            }
          }
        }
      }

      console.log(`✅ Đã hoàn thành nhiệm vụ: ${availableQuest.displayName}`)
    } else {
      console.log('⚠️ Không có nhiệm vụ nào để test')
    }

    // Test 5: Kiểm tra trạng thái cuối
    console.log('\n📊 Test 5: Kiểm tra trạng thái cuối')
    const finalPlayer = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        resources: {
          include: { resource: true }
        }
      }
    })

    console.log(`👤 Người chơi: ${finalPlayer.name}`)
    console.log(`📈 Level: ${finalPlayer.level}`)
    console.log(`⭐ EXP: ${finalPlayer.experience}`)
    console.log(`💎 Tài nguyên:`)
    finalPlayer.resources.forEach(pr => {
      console.log(`   - ${pr.resource.name}: ${pr.amount}`)
    })

    // Test 6: Kiểm tra nhiệm vụ đã hoàn thành
    console.log('\n✅ Test 6: Nhiệm vụ đã hoàn thành')
    const completedQuests = await prisma.playerQuest.findMany({
      where: {
        playerId,
        status: 'completed'
      },
      include: { quest: true }
    })

    console.log(`🎯 Đã hoàn thành ${completedQuests.length} nhiệm vụ:`)
    completedQuests.forEach(pq => {
      console.log(`   - ${pq.quest.displayName} (${pq.quest.difficulty})`)
    })

    console.log('\n🎉 Test hệ thống nhiệm vụ hoàn thành!')
  } catch (error) {
    console.error('❌ Lỗi test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testQuestSystem()
