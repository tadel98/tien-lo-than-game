const { execSync } = require('child_process')

console.log('🔧 Running Vercel build script...')

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  console.log('✅ Prisma client generated successfully!')
} catch (error) {
  console.error('❌ Prisma generation failed:', error.message)
  process.exit(1)
}
