const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function prepareBreakthroughTest() {
  console.log('🔧 Chuẩn bị test breakthrough...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')

    // Cập nhật player "Như Yên" để có thể breakthrough
    const playerName = 'Như Yên'
    const player = await prisma.player.findFirst({
      where: { name: playerName }
    })

    if (!player) {
      console.error(`❌ Không tìm thấy player: ${playerName}`)
      return
    }

    console.log(`\n🎮 Preparing player: ${player.name}`)
    console.log(`  - Current Level: ${player.level}`)
    console.log(`  - Current EXP: ${player.experience}`)

    // Tính EXP cần cho level tiếp theo
    const currentLevel = player.level
    const requiredExpForNextLevel = Math.pow(currentLevel, 2) * 1440

    console.log(`  - Required EXP for Level ${currentLevel + 1}: ${requiredExpForNextLevel}`)

    // Cập nhật EXP
    await prisma.player.update({
      where: { id: player.id },
      data: { experience: BigInt(requiredExpForNextLevel) }
    })

    console.log(`✅ Updated EXP to: ${requiredExpForNextLevel}`)

    // Kiểm tra resources
    const playerWithResources = await prisma.player.findUnique({
      where: { id: player.id },
      include: {
        resources: {
          include: {
            resource: true
          }
        }
      }
    })

    console.log(`\n💰 Current Resources:`)
    for (const pr of playerWithResources.resources) {
      console.log(`  - ${pr.resource.displayName}: ${pr.amount}`)
    }

    // Kiểm tra breakthrough conditions
    const breakthroughCost = {
      tienNgoc: 1000 * (Math.floor(currentLevel / 10) + 1),
      linhThach: 5000 * (Math.floor(currentLevel / 10) + 1)
    }

    const tienNgoc = playerWithResources.resources.find(r => r.resource.name === 'tien_ngoc')
    const linhThach = playerWithResources.resources.find(r => r.resource.name === 'linh_thach')

    console.log(`\n⚡ Breakthrough Analysis:`)
    console.log(`  - Required: ${breakthroughCost.tienNgoc} Tiên Ngọc, ${breakthroughCost.linhThach} Linh Thạch`)
    console.log(`  - Has: ${tienNgoc ? tienNgoc.amount : 0} Tiên Ngọc, ${linhThach ? linhThach.amount : 0} Linh Thạch`)
    console.log(`  - Can Breakthrough: ${tienNgoc && Number(tienNgoc.amount) >= breakthroughCost.tienNgoc && linhThach && Number(linhThach.amount) >= breakthroughCost.linhThach ? '✅ YES' : '❌ NO'}`)

    if (tienNgoc && Number(tienNgoc.amount) >= breakthroughCost.tienNgoc && linhThach && Number(linhThach.amount) >= breakthroughCost.linhThach) {
      console.log(`\n🎉 Player ${player.name} is ready for breakthrough test!`)
    } else {
      console.log(`\n⚠️ Player ${player.name} needs more resources for breakthrough`)
    }

  } catch (error) {
    console.error('❌ Lỗi chuẩn bị test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

prepareBreakthroughTest()