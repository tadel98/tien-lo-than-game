const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testBreakthroughFix() {
  console.log('🧪 Test breakthrough fix...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')

    // Test player "Như Yên" - có đủ resources để breakthrough
    const playerName = 'Như Yên'
    const player = await prisma.player.findFirst({
      where: { name: playerName },
      include: {
        resources: {
          include: {
            resource: true
          }
        }
      }
    })

    if (!player) {
      console.error(`❌ Không tìm thấy player: ${playerName}`)
      return
    }

    console.log(`\n🎮 Testing player: ${player.name}`)
    console.log(`  - Level: ${player.level}`)
    console.log(`  - EXP: ${player.experience}`)
    console.log(`  - Realm: ${player.realm}`)

    // Kiểm tra breakthrough conditions
    const currentLevel = player.level
    const currentExp = Number(player.experience)
    const nextLevelExp = Math.pow(currentLevel, 2) * 1440

    console.log(`\n⚡ Breakthrough Analysis:`)
    console.log(`  - Required EXP for Level ${currentLevel + 1}: ${nextLevelExp}`)
    console.log(`  - Current EXP: ${currentExp}`)
    console.log(`  - Can Breakthrough: ${currentExp >= nextLevelExp ? '✅ YES' : '❌ NO'}`)

    if (currentExp >= nextLevelExp) {
      const breakthroughCost = {
        tienNgoc: 1000 * (Math.floor(currentLevel / 10) + 1),
        linhThach: 5000 * (Math.floor(currentLevel / 10) + 1)
      }

      const tienNgoc = player.resources.find(r => r.resource.name === 'tien_ngoc')
      const linhThach = player.resources.find(r => r.resource.name === 'linh_thach')

      console.log(`\n💰 Resource Check:`)
      console.log(`  - Breakthrough Cost: ${breakthroughCost.tienNgoc} Tiên Ngọc, ${breakthroughCost.linhThach} Linh Thạch`)
      console.log(`  - Has Resources: ${tienNgoc ? tienNgoc.amount : 0} Tiên Ngọc, ${linhThach ? linhThach.amount : 0} Linh Thạch`)
      console.log(`  - Can Afford: ${tienNgoc && Number(tienNgoc.amount) >= breakthroughCost.tienNgoc && linhThach && Number(linhThach.amount) >= breakthroughCost.linhThach ? '✅ YES' : '❌ NO'}`)

      if (tienNgoc && Number(tienNgoc.amount) >= breakthroughCost.tienNgoc && linhThach && Number(linhThach.amount) >= breakthroughCost.linhThach) {
        console.log(`\n🚀 Player ${player.name} can perform breakthrough!`)
        
        // Test API call
        console.log(`\n📡 Testing breakthrough API...`)
        
        const response = await fetch('http://localhost:3000/api/cultivation/breakthrough', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            playerId: player.id
          })
        })

        if (response.ok) {
          const result = await response.json()
          console.log(`✅ Breakthrough successful!`)
          console.log(`  - Old Level: ${result.data.breakthrough.oldLevel}`)
          console.log(`  - New Level: ${result.data.breakthrough.newLevel}`)
          console.log(`  - Old Realm: ${result.data.breakthrough.oldRealm}`)
          console.log(`  - New Realm: ${result.data.breakthrough.newRealm}`)
          console.log(`  - Realm Change: ${result.data.breakthrough.isRealmChange ? 'YES' : 'NO'}`)
          console.log(`  - Rewards:`, result.data.breakthrough.rewards)
        } else {
          const error = await response.text()
          console.log(`❌ Breakthrough failed: ${response.status}`)
          console.log(`  - Error: ${error}`)
        }
      }
    }

    // Test quest start
    console.log(`\n🎯 Testing quest start...`)
    
    // Find an available quest for this player
    const availableQuests = await prisma.playerQuest.findMany({
      where: {
        playerId: player.id,
        status: 'available'
      },
      include: {
        quest: true
      }
    })

    if (availableQuests.length > 0) {
      const quest = availableQuests[0]
      console.log(`📋 Testing quest: ${quest.quest.displayName}`)
      
      const questResponse = await fetch('http://localhost:3000/api/quest/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId: player.id,
          questId: quest.questId
        })
      })

      if (questResponse.ok) {
        const questResult = await questResponse.json()
        console.log(`✅ Quest started successfully!`)
        console.log(`  - Quest: ${questResult.data.quest.displayName}`)
        console.log(`  - Status: ${questResult.data.quest.playerStatus.status}`)
      } else {
        const questError = await questResponse.text()
        console.log(`❌ Quest start failed: ${questResponse.status}`)
        console.log(`  - Error: ${questError}`)
      }
    } else {
      console.log(`❌ No available quests found for player`)
    }

  } catch (error) {
    console.error('❌ Lỗi test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testBreakthroughFix()
