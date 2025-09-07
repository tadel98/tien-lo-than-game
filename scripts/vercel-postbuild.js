const { execSync } = require('child_process');

console.log('🚀 Running Vercel post-build script...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Skip database push in build environment (DATABASE_URL not available)
  console.log('⏭️ Skipping database push in build environment...');
  
  // Skip seeding in build environment (DATABASE_URL not available)
  console.log('⏭️ Skipping database seeding in build environment...');
  
  console.log('✅ Post-build script completed successfully!');
} catch (error) {
  console.error('❌ Post-build script failed:', error.message);
  process.exit(1);
}