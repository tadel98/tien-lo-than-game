#!/usr/bin/env node

console.log('🚀 Starting Vercel build process...')

const { execSync } = require('child_process')

async function build() {
  try {
    // Step 1: Check environment
    console.log('📊 Environment check:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set')
    
    // Step 2: Generate Prisma client
    console.log('\n📦 Generating Prisma client...')
    try {
      execSync('npx prisma generate --no-engine', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          PRISMA_GENERATE_DATAPROXY: 'false',
          PRISMA_CLI_BINARY_TARGETS: 'native'
        }
      })
      console.log('✅ Prisma client generated successfully!')
    } catch (prismaError) {
      console.error('⚠️ Prisma generation failed:', prismaError.message)
      console.log('🔄 Trying alternative approach...')
      
      // Try with different flags
      try {
        execSync('npx prisma generate', { stdio: 'inherit' })
        console.log('✅ Prisma client generated with fallback!')
      } catch (fallbackError) {
        console.error('❌ Prisma generation failed completely:', fallbackError.message)
        console.log('⚠️ Continuing build without Prisma generation...')
      }
    }
    
    // Step 3: Build Nuxt
    console.log('\n🏗️ Building Nuxt application...')
    execSync('npx nuxt@3.8.0 build', { stdio: 'inherit' })
    console.log('✅ Nuxt build completed successfully!')
    
    console.log('\n🎉 Build process completed!')
    
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

build()
