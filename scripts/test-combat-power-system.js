const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCombatPowerSystem() {
  try {
    console.log('⚔️ Test hệ thống sức mạnh chiến đấu...')

    // Lấy player
    const player = await prisma.player.findFirst({
      include: {
        stats: true,
        resources: {
          include: { resource: true }
        }
      }
    })

    if (!player) {
      console.log('❌ Không tìm thấy người chơi')
      return
    }

    console.log(`👤 Player: ${player.name} (Level ${player.level})`)

    // Hiển thị stats hiện tại
    console.log('\n📊 Stats hiện tại:')
    if (player.stats) {
      console.log(`   HP: ${player.stats.hp}`)
      console.log(`   MP: ${player.stats.mp}`)
      console.log(`   Attack: ${player.stats.attack}`)
      console.log(`   Defense: ${player.stats.defense}`)
      console.log(`   Speed: ${player.stats.speed}`)
      console.log(`   Luck: ${player.stats.luck}`)
      console.log(`   Wisdom: ${player.stats.wisdom}`)
      console.log(`   Strength: ${player.stats.strength}`)
      console.log(`   Agility: ${player.stats.agility}`)
      console.log(`   Vitality: ${player.stats.vitality}`)
      console.log(`   Spirit: ${player.stats.spirit}`)
    }

    // Hiển thị sức mạnh chiến đấu hiện tại
    const combatPowerResource = player.resources.find(r => r.resource.name === 'suc_manh_chien_dau')
    if (combatPowerResource) {
      console.log(`\n⚔️ Sức mạnh chiến đấu hiện tại: ${combatPowerResource.amount}`)
    }

    // Test cập nhật sức mạnh chiến đấu
    console.log('\n🔄 Test cập nhật sức mạnh chiến đấu...')
    
    const response = await fetch('http://localhost:3000/api/character/update-combat-power', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerId: player.id,
        levelGain: 1
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Cập nhật thành công!')
      console.log(`📈 Điểm cộng: ${result.data.pointsGained}`)
      console.log(`⚔️ Sức mạnh chiến đấu mới: ${result.data.combatPower}`)
      console.log(`📊 Tăng sức mạnh: +${result.data.combatPowerIncrease}`)
      
      // Hiển thị stats mới
      console.log('\n📊 Stats mới:')
      console.log(`   HP: ${result.data.newStats.hp}`)
      console.log(`   MP: ${result.data.newStats.mp}`)
      console.log(`   Attack: ${result.data.newStats.attack}`)
      console.log(`   Defense: ${result.data.newStats.defense}`)
      console.log(`   Speed: ${result.data.newStats.speed}`)
      console.log(`   Luck: ${result.data.newStats.luck}`)
      console.log(`   Wisdom: ${result.data.newStats.wisdom}`)
      console.log(`   Strength: ${result.data.newStats.strength}`)
      console.log(`   Agility: ${result.data.newStats.agility}`)
      console.log(`   Vitality: ${result.data.newStats.vitality}`)
      console.log(`   Spirit: ${result.data.newStats.spirit}`)
    } else {
      console.log('❌ Lỗi cập nhật:', await response.text())
    }

    // Test với level gain lớn hơn
    console.log('\n🔄 Test với level gain = 5...')
    
    const response2 = await fetch('http://localhost:3000/api/character/update-combat-power', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerId: player.id,
        levelGain: 5
      })
    })

    if (response2.ok) {
      const result2 = await response2.json()
      console.log('✅ Cập nhật thành công!')
      console.log(`📈 Điểm cộng: ${result2.data.pointsGained}`)
      console.log(`⚔️ Sức mạnh chiến đấu mới: ${result2.data.combatPower}`)
      console.log(`📊 Tăng sức mạnh: +${result2.data.combatPowerIncrease}`)
    } else {
      console.log('❌ Lỗi cập nhật:', await response2.text())
    }

    console.log('\n🎉 Test hệ thống sức mạnh chiến đấu hoàn thành!')
  } catch (error) {
    console.error('❌ Lỗi test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCombatPowerSystem()
