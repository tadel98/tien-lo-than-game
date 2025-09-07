const { execSync } = require('child_process');

console.log('🚀 Running Vercel post-build script...');

try {
  // Skip Prisma operations in build environment (DATABASE_URL not available)
  console.log('⏭️ Skipping Prisma operations in build environment...');
  console.log('📦 Prisma client already generated during build...');
  
  console.log('✅ Post-build script completed successfully!');
} catch (error) {
  console.error('❌ Post-build script failed:', error.message);
  process.exit(1);
}