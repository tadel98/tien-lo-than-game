const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBreakthrough() {
  try {
    await prisma.$connect();
    console.log('✅ Kết nối database thành công');
    
    // Lấy player đầu tiên để test
    const player = await prisma.player.findFirst({
      include: {
        resources: {
          include: { resource: true }
        }
      }
    });
    
    if (player) {
      console.log('🎮 Player:', player.name, 'Level:', player.level);
      console.log('💎 Experience:', player.experience.toString());
      
      // Test công thức EXP
      const currentLevel = player.level;
      const currentExp = Number(player.experience);
      const nextLevelExp = Math.pow(currentLevel, 2) * 1440;
      
      console.log('📊 Current EXP:', currentExp);
      console.log('📊 Next Level EXP needed:', nextLevelExp);
      console.log('📊 Can breakthrough:', currentExp >= nextLevelExp);
      
      // Test resources
      const tienNgoc = player.resources.find(r => r.resource.name === 'tien_ngoc');
      const linhThach = player.resources.find(r => r.resource.name === 'linh_thach');
      
      console.log('💰 Tiên Ngọc:', tienNgoc ? tienNgoc.amount : 'Not found');
      console.log('💰 Linh Thạch:', linhThach ? linhThach.amount : 'Not found');
      
      // Test breakthrough cost
      const baseTienNgoc = 1000;
      const baseLinhThach = 5000;
      const levelMultiplier = Math.floor(currentLevel / 10) + 1;
      const costTienNgoc = baseTienNgoc * levelMultiplier;
      const costLinhThach = baseLinhThach * levelMultiplier;
      
      console.log('💸 Breakthrough cost - Tiên Ngọc:', costTienNgoc);
      console.log('💸 Breakthrough cost - Linh Thạch:', costLinhThach);
      console.log('✅ Has enough Tiên Ngọc:', tienNgoc ? Number(tienNgoc.amount) >= costTienNgoc : false);
      console.log('✅ Has enough Linh Thạch:', linhThach ? Number(linhThach.amount) >= costLinhThach : false);
      
      // Test với level thấp hơn
      console.log('\n🔍 Testing với level 1:');
      const testLevel = 1;
      const testNextLevelExp = Math.pow(testLevel, 2) * 1440;
      console.log('📊 Level 1 next EXP needed:', testNextLevelExp);
      console.log('📊 Current EXP >= Level 1 next EXP:', currentExp >= testNextLevelExp);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBreakthrough();
