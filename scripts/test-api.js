// Test API endpoints
const baseUrl = 'http://localhost:3000'

async function testAPI() {
  console.log('🧪 Bắt đầu test API endpoints...')
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Test Health API...')
    try {
      const response = await fetch(`${baseUrl}/api/health`)
      const data = await response.json()
      console.log('✅ Health API:', data.success ? 'OK' : 'FAILED')
      if (data.database) {
        console.log(`   Database: ${data.database.connected ? 'Connected' : 'Disconnected'}`)
        console.log(`   Users: ${data.database.users}`)
        console.log(`   Resources: ${data.database.resources}`)
      }
    } catch (error) {
      console.log('❌ Health API error:', error.message)
    }

    // Test 2: Init DB API
    console.log('\n2️⃣ Test Init DB API...')
    try {
      const response = await fetch(`${baseUrl}/api/init-db`, {
        method: 'POST'
      })
      const data = await response.json()
      console.log('✅ Init DB API:', data.success ? 'OK' : 'FAILED')
      if (data.data) {
        console.log(`   Resources: ${data.data.resources}`)
        console.log(`   Companions: ${data.data.companions}`)
        console.log(`   Quests: ${data.data.quests}`)
      }
    } catch (error) {
      console.log('❌ Init DB API error:', error.message)
    }

    // Test 3: Auto Cultivation API
    console.log('\n3️⃣ Test Auto Cultivation API...')
    try {
      const response = await fetch(`${baseUrl}/api/cultivation/auto-cultivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId: 'test-api-player',
          expGain: 1000
        })
      })
      const data = await response.json()
      console.log('✅ Auto Cultivation API:', data.success ? 'OK' : 'FAILED')
      if (data.data) {
        console.log(`   Player Level: ${data.data.player.level}`)
        console.log(`   Experience: ${data.data.player.experience}`)
        console.log(`   Level Up: ${data.data.cultivation.levelUp ? 'Yes' : 'No'}`)
      }
    } catch (error) {
      console.log('❌ Auto Cultivation API error:', error.message)
    }

    console.log('\n🎉 API tests completed!')

  } catch (error) {
    console.error('❌ API test failed:', error.message)
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${baseUrl}/api/health`)
    return response.ok
  } catch (error) {
    return false
  }
}

// Main function
async function main() {
  console.log('🔍 Checking if server is running...')
  const serverRunning = await checkServer()
  
  if (!serverRunning) {
    console.log('❌ Server is not running!')
    console.log('Please start the server with: npm run dev')
    return
  }
  
  console.log('✅ Server is running!')
  await testAPI()
}

main()
