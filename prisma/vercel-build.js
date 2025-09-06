const { execSync } = require('child_process')

console.log('🔧 Running Vercel build script...')

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ DATABASE_URL not set, skipping Prisma generation')
    process.exit(0)
  }
  
  console.log('📦 Generating Prisma client...')
  console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
  
  // Generate Prisma client with better error handling
  execSync('npx prisma generate --no-engine', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      PRISMA_GENERATE_DATAPROXY: 'false'
    }
  })
  
  console.log('✅ Prisma client generated successfully!')
} catch (error) {
  console.error('❌ Prisma generation failed:', error.message)
  console.error('Full error:', error)
  
  // Don't exit with error code to allow build to continue
  console.log('⚠️ Continuing build despite Prisma generation error...')
}
