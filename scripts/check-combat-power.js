const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCombatPower() {
  try {
    console.log('⚔️ Kiểm tra sức mạnh chiến đấu...')

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

    // Hiển thị stats
    if (player.stats) {
      console.log('\n📊 Stats:')
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

    // Hiển thị sức mạnh chiến đấu
    const combatPowerResource = player.resources.find(r => r.resource.name === 'suc_manh_chien_dau')
    if (combatPowerResource) {
      console.log(`\n⚔️ Sức mạnh chiến đấu: ${combatPowerResource.amount}`)
    } else {
      console.log('\n❌ Không tìm thấy sức mạnh chiến đấu')
    }

    // Hiển thị tất cả resources
    console.log('\n💎 Tất cả resources:')
    player.resources.forEach(pr => {
      console.log(`   ${pr.resource.displayName}: ${pr.amount}`)
    })

  } catch (error) {
    console.error('❌ Lỗi:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCombatPower()
