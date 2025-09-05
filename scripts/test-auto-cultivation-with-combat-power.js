const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAutoCultivationWithCombatPower() {
  try {
    console.log('🧘 Test hệ thống tu luyện tự động với sức mạnh chiến đấu...')

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

    // Hiển thị thông tin ban đầu
    const combatPowerResource = player.resources.find(r => r.resource.name === 'suc_manh_chien_dau')
    console.log(`⚔️ Sức mạnh chiến đấu ban đầu: ${combatPowerResource?.amount || 0}`)
    console.log(`⭐ EXP hiện tại: ${player.experience}`)

    // Test auto-cultivation
    console.log('\n🔄 Test auto-cultivation...')
    
    const response = await fetch('http://localhost:3000/api/cultivation/auto-cultivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerId: player.id,
        expGain: 1000
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Auto-cultivation thành công!')
      console.log(`📈 EXP cộng: ${result.data.cultivation.expGain}`)
      console.log(`📊 Level up: ${result.data.cultivation.levelUp ? 'Có' : 'Không'}`)
      
      if (result.data.cultivation.levelUp) {
        console.log(`🎉 Level tăng: +${result.data.cultivation.levelGain}`)
        console.log(`📊 Level mới: ${result.data.cultivation.newLevel}`)
      }

      // Kiểm tra sức mạnh chiến đấu sau khi tu luyện
      const updatedPlayer = await prisma.player.findUnique({
        where: { id: player.id },
        include: {
          stats: true,
          resources: {
            include: { resource: true }
          }
        }
      })

      const updatedCombatPower = updatedPlayer.resources.find(r => r.resource.name === 'suc_manh_chien_dau')
      console.log(`⚔️ Sức mạnh chiến đấu sau tu luyện: ${updatedCombatPower?.amount || 0}`)
      
      if (updatedCombatPower && combatPowerResource) {
        const increase = updatedCombatPower.amount - combatPowerResource.amount
        if (increase > 0) {
          console.log(`📈 Tăng sức mạnh chiến đấu: +${increase}`)
        }
      }

      // Hiển thị stats mới
      if (updatedPlayer.stats) {
        console.log('\n📊 Stats sau tu luyện:')
        console.log(`   HP: ${updatedPlayer.stats.hp}`)
        console.log(`   MP: ${updatedPlayer.stats.mp}`)
        console.log(`   Attack: ${updatedPlayer.stats.attack}`)
        console.log(`   Defense: ${updatedPlayer.stats.defense}`)
        console.log(`   Speed: ${updatedPlayer.stats.speed}`)
        console.log(`   Luck: ${updatedPlayer.stats.luck}`)
        console.log(`   Wisdom: ${updatedPlayer.stats.wisdom}`)
        console.log(`   Strength: ${updatedPlayer.stats.strength}`)
        console.log(`   Agility: ${updatedPlayer.stats.agility}`)
        console.log(`   Vitality: ${updatedPlayer.stats.vitality}`)
        console.log(`   Spirit: ${updatedPlayer.stats.spirit}`)
      }
    } else {
      console.log('❌ Lỗi auto-cultivation:', await response.text())
    }

    console.log('\n🎉 Test hoàn thành!')
  } catch (error) {
    console.error('❌ Lỗi test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAutoCultivationWithCombatPower()
