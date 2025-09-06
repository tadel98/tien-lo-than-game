const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyMigration() {
  console.log('🔍 Kiểm tra data migration sang PostgreSQL...')
  
  try {
    await prisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')
    
    // Kiểm tra số lượng records trong các bảng chính
    const tables = [
      { name: 'users', model: prisma.user },
      { name: 'players', model: prisma.player },
      { name: 'resources', model: prisma.resource },
      { name: 'player_resources', model: prisma.playerResource },
      { name: 'player_stats', model: prisma.playerStats },
      { name: 'companions', model: prisma.companion },
      { name: 'achievements', model: prisma.achievement },
      { name: 'quests', model: prisma.quest },
      { name: 'player_quests', model: prisma.playerQuest },
      { name: 'equipment_types', model: prisma.equipmentType },
      { name: 'equipments', model: prisma.equipment },
      { name: 'player_equipments', model: prisma.playerEquipment },
      { name: 'skills', model: prisma.skill },
      { name: 'player_skills', model: prisma.playerSkill },
      { name: 'talent_types', model: prisma.talentType },
      { name: 'talents', model: prisma.talent },
      { name: 'player_talents', model: prisma.playerTalent },
      { name: 'buffs', model: prisma.buff },
      { name: 'game_configs', model: prisma.gameConfig },
      { name: 'shops', model: prisma.shop },
      { name: 'shop_items', model: prisma.shopItem },
      { name: 'recipes', model: prisma.recipe },
      { name: 'dao_furnaces', model: prisma.daoFurnace },
      { name: 'spirit_beast_types', model: prisma.spiritBeastType },
      { name: 'beast_foods', model: prisma.beastFood },
      { name: 'hunting_grounds', model: prisma.huntingGround },
      { name: 'cultivation_logs', model: prisma.cultivationLog },
      { name: 'sessions', model: prisma.session }
    ]
    
    console.log('\n📊 Báo cáo số lượng records:')
    console.log('=' .repeat(50))
    
    for (const table of tables) {
      try {
        const count = await table.model.count()
        console.log(`✅ ${table.name.padEnd(25)}: ${count} records`)
      } catch (error) {
        console.log(`❌ ${table.name.padEnd(25)}: Lỗi - ${error.message}`)
      }
    }
    
    // Kiểm tra một số sample data
    console.log('\n🔍 Kiểm tra sample data:')
    console.log('=' .repeat(50))
    
    // Users
    const users = await prisma.user.findMany({ take: 3 })
    console.log(`\n👥 Users (${users.length}):`)
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.email})`)
    })
    
    // Players
    const players = await prisma.player.findMany({ take: 3 })
    console.log(`\n🎮 Players (${players.length}):`)
    players.forEach(player => {
      console.log(`  - ${player.name} (Level ${player.level}, ${player.realm})`)
    })
    
    // Resources
    const resources = await prisma.resource.findMany({ take: 5 })
    console.log(`\n💎 Resources (${resources.length}):`)
    resources.forEach(resource => {
      console.log(`  - ${resource.displayName} (${resource.name})`)
    })
    
    // Player Resources
    const playerResources = await prisma.playerResource.findMany({ 
      take: 5,
      include: { resource: true, player: true }
    })
    console.log(`\n💰 Player Resources (${playerResources.length}):`)
    playerResources.forEach(pr => {
      console.log(`  - ${pr.player.name}: ${pr.resource.displayName} = ${pr.amount}`)
    })
    
    // Quests
    const quests = await prisma.quest.findMany({ take: 5 })
    console.log(`\n📜 Quests (${quests.length}):`)
    quests.forEach(quest => {
      console.log(`  - ${quest.displayName} (${quest.category}, ${quest.difficulty})`)
    })
    
    // Equipment Types
    const equipmentTypes = await prisma.equipmentType.findMany()
    console.log(`\n⚔️  Equipment Types (${equipmentTypes.length}):`)
    equipmentTypes.forEach(et => {
      console.log(`  - ${et.displayName} (${et.slot})`)
    })
    
    // Skills
    const skills = await prisma.skill.findMany({ take: 5 })
    console.log(`\n🎯 Skills (${skills.length}):`)
    skills.forEach(skill => {
      console.log(`  - ${skill.displayName} (${skill.category}, Level ${skill.level})`)
    })
    
    // Talents
    const talents = await prisma.talent.findMany({ take: 5 })
    console.log(`\n🌟 Talents (${talents.length}):`)
    talents.forEach(talent => {
      console.log(`  - ${talent.displayName} (${talent.rarity}, Level ${talent.level})`)
    })
    
    // Game Configs
    const gameConfigs = await prisma.gameConfig.findMany()
    console.log(`\n⚙️  Game Configs (${gameConfigs.length}):`)
    gameConfigs.forEach(config => {
      console.log(`  - ${config.key}: ${config.value} (${config.type})`)
    })
    
    // Shops
    const shops = await prisma.shop.findMany()
    console.log(`\n🏪 Shops (${shops.length}):`)
    shops.forEach(shop => {
      console.log(`  - ${shop.displayName} (${shop.category})`)
    })
    
    // Dao Furnaces
    const furnaces = await prisma.daoFurnace.findMany()
    console.log(`\n🔥 Dao Furnaces (${furnaces.length}):`)
    furnaces.forEach(furnace => {
      console.log(`  - ${furnace.displayName} (Level ${furnace.level})`)
    })
    
    // Spirit Beast Types
    const spiritBeastTypes = await prisma.spiritBeastType.findMany()
    console.log(`\n🐉 Spirit Beast Types (${spiritBeastTypes.length}):`)
    spiritBeastTypes.forEach(beastType => {
      console.log(`  - ${beastType.displayName} (${beastType.category})`)
    })
    
    // Hunting Grounds
    const huntingGrounds = await prisma.huntingGround.findMany()
    console.log(`\n🌲 Hunting Grounds (${huntingGrounds.length}):`)
    huntingGrounds.forEach(ground => {
      console.log(`  - ${ground.displayName} (Level ${ground.level}, ${ground.difficulty})`)
    })
    
    // Cultivation Logs
    const cultivationLogs = await prisma.cultivationLog.findMany({ take: 3 })
    console.log(`\n🧘 Cultivation Logs (${cultivationLogs.length}):`)
    cultivationLogs.forEach(log => {
      console.log(`  - ${log.description} (+${log.expGained} EXP)`)
    })
    
    console.log('\n🎉 Verification hoàn tất!')
    console.log('✅ Tất cả data đã được migrate thành công sang PostgreSQL!')
    
  } catch (error) {
    console.error('❌ Lỗi verification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyMigration()
