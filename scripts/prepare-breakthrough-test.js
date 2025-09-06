const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function prepareBreakthroughTest() {
  try {
    await prisma.$connect();
    console.log('✅ Kết nối database thành công');
    
    // Lấy player đầu tiên
    const player = await prisma.player.findFirst();
    
    if (player) {
      console.log('🎮 Preparing player:', player.name);
      
      // Cấp đủ kinh nghiệm để đột phá (level 1 -> 2 cần 1440 EXP)
      const requiredExp = Math.pow(player.level, 2) * 1440;
      console.log('📊 Required EXP for breakthrough:', requiredExp);
      
      // Cập nhật kinh nghiệm
      await prisma.player.update({
        where: { id: player.id },
        data: {
          experience: BigInt(requiredExp)
        }
      });
      console.log('✅ Updated experience to:', requiredExp);
      
      // Cấp đủ Tiên Ngọc (cần 1000 cho level 1)
      const tienNgocResource = await prisma.resource.findFirst({
        where: { name: 'tien_ngoc' }
      });
      
      if (tienNgocResource) {
        await prisma.playerResource.upsert({
          where: {
            playerId_resourceId: {
              playerId: player.id,
              resourceId: tienNgocResource.id
            }
          },
          update: {
            amount: 10000 // Cấp nhiều để test
          },
          create: {
            playerId: player.id,
            resourceId: tienNgocResource.id,
            amount: 10000,
            locked: 0
          }
        });
        console.log('✅ Updated Tiên Ngọc to: 10000');
      }
      
      // Cấp đủ Linh Thạch (cần 5000 cho level 1)
      const linhThachResource = await prisma.resource.findFirst({
        where: { name: 'linh_thach' }
      });
      
      if (linhThachResource) {
        await prisma.playerResource.upsert({
          where: {
            playerId_resourceId: {
              playerId: player.id,
              resourceId: linhThachResource.id
            }
          },
          update: {
            amount: 50000 // Cấp nhiều để test
          },
          create: {
            playerId: player.id,
            resourceId: linhThachResource.id,
            amount: 50000,
            locked: 0
          }
        });
        console.log('✅ Updated Linh Thạch to: 50000');
      }
      
      console.log('🎉 Player ready for breakthrough test!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

prepareBreakthroughTest();
