const { execSync } = require('child_process');

console.log('🚀 Running Vercel post-build script...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  console.log('🗄️ Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Seed database
  console.log('🌱 Seeding database...');
  execSync('node scripts/seed.js', { stdio: 'inherit' });
  
  console.log('✅ Post-build script completed successfully!');
} catch (error) {
  console.error('❌ Post-build script failed:', error.message);
  process.exit(1);
}