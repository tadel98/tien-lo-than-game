const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testRepeatableQuests() {
  try {
    console.log('🔄 Test hệ thống nhiệm vụ lặp lại...')

    // Lấy player
    const player = await prisma.player.findFirst()
    if (!player) {
      console.log('❌ Không tìm thấy người chơi')
      return
    }

    const playerId = player.id
    console.log(`👤 Player: ${player.name} (ID: ${playerId})`)

    // Lấy nhiệm vụ lặp lại
    const repeatableQuests = await prisma.quest.findMany({
      where: { isRepeatable: true },
      orderBy: { repeatInterval: 'asc' }
    })

    console.log(`\n📋 Tìm thấy ${repeatableQuests.length} nhiệm vụ lặp lại:`)
    repeatableQuests.forEach(quest => {
      console.log(`   - ${quest.displayName} (${quest.repeatInterval} phút)`)
    })

    // Test nhiệm vụ 5 phút
    const quest5min = repeatableQuests.find(q => q.repeatInterval === 5)
    if (quest5min) {
      console.log(`\n🧪 Test nhiệm vụ 5 phút: ${quest5min.displayName}`)
      
      // Bắt đầu nhiệm vụ
      console.log('1. Bắt đầu nhiệm vụ...')
      const startResponse = await fetch('http://localhost:3000/api/quest/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, questId: quest5min.id })
      })
      
      if (startResponse.ok) {
        console.log('✅ Bắt đầu thành công')
        
        // Hoàn thành nhiệm vụ
        console.log('2. Hoàn thành nhiệm vụ...')
        const completeResponse = await fetch('http://localhost:3000/api/quest/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, questId: quest5min.id })
        })
        
        if (completeResponse.ok) {
          const result = await completeResponse.json()
          console.log('✅ Hoàn thành thành công')
          console.log(`💰 Phần thưởng: ${JSON.stringify(result.data.rewards, null, 2)}`)
          
          // Kiểm tra trạng thái cooldown
          console.log('3. Kiểm tra trạng thái cooldown...')
          const playerQuest = await prisma.playerQuest.findFirst({
            where: { playerId, questId: quest5min.id },
            include: { quest: true }
          })
          
          if (playerQuest) {
            console.log(`📊 Trạng thái: ${playerQuest.status}`)
            console.log(`⏰ Cooldown until: ${playerQuest.cooldownUntil}`)
            console.log(`🕐 Last completed: ${playerQuest.lastCompletedAt}`)
            
            // Tính thời gian cooldown còn lại
            const now = new Date()
            const cooldownUntil = new Date(playerQuest.cooldownUntil)
            const remainingSeconds = Math.max(0, Math.ceil((cooldownUntil.getTime() - now.getTime()) / 1000))
            console.log(`⏳ Thời gian còn lại: ${remainingSeconds} giây`)
          }
        } else {
          console.log('❌ Lỗi hoàn thành:', await completeResponse.text())
        }
      } else {
        console.log('❌ Lỗi bắt đầu:', await startResponse.text())
      }
    }

    // Test nhiệm vụ 10 phút
    const quest10min = repeatableQuests.find(q => q.repeatInterval === 10)
    if (quest10min) {
      console.log(`\n🧪 Test nhiệm vụ 10 phút: ${quest10min.displayName}`)
      
      // Bắt đầu và hoàn thành
      const startResponse = await fetch('http://localhost:3000/api/quest/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, questId: quest10min.id })
      })
      
      if (startResponse.ok) {
        const completeResponse = await fetch('http://localhost:3000/api/quest/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, questId: quest10min.id })
        })
        
        if (completeResponse.ok) {
          console.log('✅ Nhiệm vụ 10 phút hoàn thành')
          
          // Kiểm tra cooldown
          const playerQuest = await prisma.playerQuest.findFirst({
            where: { playerId, questId: quest10min.id }
          })
          
          if (playerQuest) {
            const now = new Date()
            const cooldownUntil = new Date(playerQuest.cooldownUntil)
            const remainingMinutes = Math.max(0, Math.ceil((cooldownUntil.getTime() - now.getTime()) / (1000 * 60)))
            console.log(`⏰ Cooldown: ${remainingMinutes} phút`)
          }
        }
      }
    }

    // Hiển thị tất cả nhiệm vụ của player
    console.log('\n📊 Tất cả nhiệm vụ của player:')
    const allPlayerQuests = await prisma.playerQuest.findMany({
      where: { playerId },
      include: { quest: true }
    })
    
    allPlayerQuests.forEach(pq => {
      const quest = pq.quest
      const isRepeatable = quest.isRepeatable ? '🔄' : '📋'
      const cooldownInfo = pq.cooldownUntil ? ` (Cooldown: ${pq.cooldownUntil})` : ''
      console.log(`   ${isRepeatable} ${quest.displayName} - ${pq.status}${cooldownInfo}`)
    })

    console.log('\n🎉 Test hoàn thành!')
  } catch (error) {
    console.error('❌ Lỗi test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRepeatableQuests()
