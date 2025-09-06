const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugAuthIssue() {
  try {
    await prisma.$connect();
    console.log('✅ Kết nối database thành công');
    
    // Kiểm tra tất cả users và players
    const users = await prisma.user.findMany({
      include: {
        player: true
      }
    });
    
    console.log('👥 Users và Players:');
    console.log('==================================================');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User: ${user.username} (${user.email})`);
      if (user.player) {
        console.log(`   Player: ${user.player.name} (Level ${user.player.level})`);
        console.log(`   Player ID: ${user.player.id}`);
      } else {
        console.log('   ❌ No player associated');
      }
      console.log('');
    });
    
    // Kiểm tra sessions
    const sessions = await prisma.session.findMany({
      include: {
        user: {
          include: {
            player: true
          }
        }
      }
    });
    
    console.log('🔐 Active Sessions:');
    console.log('==================================================');
    
    sessions.forEach((session, index) => {
      console.log(`${index + 1}. Session: ${session.token.substring(0, 20)}...`);
      console.log(`   User: ${session.user.username}`);
      if (session.user.player) {
        console.log(`   Player: ${session.user.player.name} (ID: ${session.user.player.id})`);
      } else {
        console.log('   ❌ No player associated');
      }
      console.log('');
    });
    
    // Tìm user có player để test
    const userWithPlayer = users.find(u => u.player);
    if (userWithPlayer) {
      console.log('🎮 Test user found:');
      console.log(`   Username: ${userWithPlayer.username}`);
      console.log(`   Player ID: ${userWithPlayer.player.id}`);
      console.log(`   Player Name: ${userWithPlayer.player.name}`);
      console.log(`   Player Level: ${userWithPlayer.player.level}`);
    } else {
      console.log('❌ No user with player found!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuthIssue();
