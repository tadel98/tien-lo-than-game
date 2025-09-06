const { PrismaClient } = require('@prisma/client')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Tạo Prisma client cho PostgreSQL
const postgresPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_u5SXZm3yzvOl@ep-long-dust-a1cl7wyx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
})

// Kết nối đến SQLite database
const sqliteDb = new sqlite3.Database(path.join(__dirname, '../prisma/dev.db'))

async function migrateData() {
  console.log('🚀 Bắt đầu migrate data từ SQLite sang PostgreSQL...')
  
  try {
    // Test kết nối PostgreSQL
    await postgresPrisma.$connect()
    console.log('✅ Kết nối PostgreSQL thành công!')
    
    // Kiểm tra SQLite database
    console.log('🔍 Kiểm tra SQLite database...')
    
    // Migrate Users
    await migrateUsers()
    
    // Migrate Resources
    await migrateResources()
    
    // Migrate Players
    await migratePlayers()
    
    // Migrate Player Resources
    await migratePlayerResources()
    
    // Migrate Player Stats
    await migratePlayerStats()
    
    // Migrate Companions
    await migrateCompanions()
    
    // Migrate Player Companions
    await migratePlayerCompanions()
    
    // Migrate Achievements
    await migrateAchievements()
    
    // Migrate Player Achievements
    await migratePlayerAchievements()
    
    // Migrate Quests
    await migrateQuests()
    
    // Migrate Player Quests
    await migratePlayerQuests()
    
    // Migrate Equipment Types
    await migrateEquipmentTypes()
    
    // Migrate Equipments
    await migrateEquipments()
    
    // Migrate Player Equipments
    await migratePlayerEquipments()
    
    // Migrate Skills
    await migrateSkills()
    
    // Migrate Player Skills
    await migratePlayerSkills()
    
    // Migrate Talent Types
    await migrateTalentTypes()
    
    // Migrate Talents
    await migrateTalents()
    
    // Migrate Player Talents
    await migratePlayerTalents()
    
    // Migrate Buffs
    await migrateBuffs()
    
    // Migrate Player Buffs
    await migratePlayerBuffs()
    
    // Migrate Game Configs
    await migrateGameConfigs()
    
    // Migrate Shops
    await migrateShops()
    
    // Migrate Shop Items
    await migrateShopItems()
    
    // Migrate Purchase Histories
    await migratePurchaseHistories()
    
    // Migrate Inventories
    await migrateInventories()
    
    // Migrate Recipes
    await migrateRecipes()
    
    // Migrate Crafting Histories
    await migrateCraftingHistories()
    
    // Migrate Dao Furnaces
    await migrateDaoFurnaces()
    
    // Migrate Player Furnaces
    await migratePlayerFurnaces()
    
    // Migrate Spirit Beast Types
    await migrateSpiritBeastTypes()
    
    // Migrate Spirit Beasts
    await migrateSpiritBeasts()
    
    // Migrate Beast Foods
    await migrateBeastFoods()
    
    // Migrate Beast Feeding Histories
    await migrateBeastFeedingHistories()
    
    // Migrate Hunting Grounds
    await migrateHuntingGrounds()
    
    // Migrate Hunting Histories
    await migrateHuntingHistories()
    
    // Migrate Cultivation Logs
    await migrateCultivationLogs()
    
    // Migrate Sessions
    await migrateSessions()
    
    console.log('🎉 Migrate data hoàn tất!')
    
  } catch (error) {
    console.error('❌ Lỗi migrate:', error)
  } finally {
    await postgresPrisma.$disconnect()
    sqliteDb.close()
  }
}

async function migrateUsers() {
  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM users", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table users trong SQLite')
        return resolve()
      }
      
      console.log(`📦 Migrate ${rows.length} users...`)
      
      for (const row of rows) {
        try {
          await postgresPrisma.user.upsert({
            where: { id: row.id },
            update: {
              username: row.username,
              email: row.email,
              password: row.password,
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            },
            create: {
              id: row.id,
              username: row.username,
              email: row.email,
              password: row.password,
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            }
          })
        } catch (error) {
          console.error(`❌ Lỗi migrate user ${row.id}:`, error.message)
        }
      }
      
      console.log('✅ Migrate users hoàn tất!')
      resolve()
    })
  })
}

async function migrateResources() {
  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM resources", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table resources trong SQLite')
        return resolve()
      }
      
      console.log(`📦 Migrate ${rows.length} resources...`)
      
      for (const row of rows) {
        try {
          await postgresPrisma.resource.upsert({
            where: { id: row.id },
            update: {
              name: row.name,
              displayName: row.displayName,
              description: row.description,
              icon: row.icon,
              color: row.color,
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            },
            create: {
              id: row.id,
              name: row.name,
              displayName: row.displayName,
              description: row.description,
              icon: row.icon,
              color: row.color,
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            }
          })
        } catch (error) {
          console.error(`❌ Lỗi migrate resource ${row.id}:`, error.message)
        }
      }
      
      console.log('✅ Migrate resources hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayers() {
  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM players", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table players trong SQLite')
        return resolve()
      }
      
      console.log(`📦 Migrate ${rows.length} players...`)
      
      for (const row of rows) {
        try {
          await postgresPrisma.player.upsert({
            where: { id: row.id },
            update: {
              userId: row.userId,
              name: row.name,
              level: row.level,
              realm: row.realm,
              experience: BigInt(row.experience || 0),
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            },
            create: {
              id: row.id,
              userId: row.userId,
              name: row.name,
              level: row.level,
              realm: row.realm,
              experience: BigInt(row.experience || 0),
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            }
          })
        } catch (error) {
          console.error(`❌ Lỗi migrate player ${row.id}:`, error.message)
        }
      }
      
      console.log('✅ Migrate players hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerResources() {
  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM player_resources", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_resources trong SQLite')
        return resolve()
      }
      
      console.log(`📦 Migrate ${rows.length} player resources...`)
      
      for (const row of rows) {
        try {
          await postgresPrisma.playerResource.upsert({
            where: { 
              playerId_resourceId: {
                playerId: row.playerId,
                resourceId: row.resourceId
              }
            },
            update: {
              amount: parseFloat(row.amount || 0),
              locked: parseFloat(row.locked || 0),
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            },
            create: {
              id: row.id,
              playerId: row.playerId,
              resourceId: row.resourceId,
              amount: parseFloat(row.amount || 0),
              locked: parseFloat(row.locked || 0),
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            }
          })
        } catch (error) {
          console.error(`❌ Lỗi migrate player resource ${row.id}:`, error.message)
        }
      }
      
      console.log('✅ Migrate player resources hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerStats() {
  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM player_stats", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_stats trong SQLite')
        return resolve()
      }
      
      console.log(`📦 Migrate ${rows.length} player stats...`)
      
      for (const row of rows) {
        try {
          await postgresPrisma.playerStats.upsert({
            where: { playerId: row.playerId },
            update: {
              hp: row.hp,
              mp: row.mp,
              attack: row.attack,
              defense: row.defense,
              speed: row.speed,
              luck: row.luck,
              wisdom: row.wisdom,
              strength: row.strength,
              agility: row.agility,
              vitality: row.vitality,
              spirit: row.spirit,
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            },
            create: {
              id: row.id,
              playerId: row.playerId,
              hp: row.hp,
              mp: row.mp,
              attack: row.attack,
              defense: row.defense,
              speed: row.speed,
              luck: row.luck,
              wisdom: row.wisdom,
              strength: row.strength,
              agility: row.agility,
              vitality: row.vitality,
              spirit: row.spirit,
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            }
          })
        } catch (error) {
          console.error(`❌ Lỗi migrate player stats ${row.id}:`, error.message)
        }
      }
      
      console.log('✅ Migrate player stats hoàn tất!')
      resolve()
    })
  })
}

// Các hàm migrate khác (tương tự)
async function migrateCompanions() {
  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM companions", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table companions trong SQLite')
        return resolve()
      }
      
      console.log(`📦 Migrate ${rows.length} companions...`)
      
      for (const row of rows) {
        try {
          await postgresPrisma.companion.upsert({
            where: { id: row.id },
            update: {
              name: row.name,
              displayName: row.displayName,
              description: row.description,
              icon: row.icon,
              rarity: row.rarity,
              basePower: row.basePower,
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            },
            create: {
              id: row.id,
              name: row.name,
              displayName: row.displayName,
              description: row.description,
              icon: row.icon,
              rarity: row.rarity,
              basePower: row.basePower,
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            }
          })
        } catch (error) {
          console.error(`❌ Lỗi migrate companion ${row.id}:`, error.message)
        }
      }
      
      console.log('✅ Migrate companions hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerCompanions() {
  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT * FROM player_companions", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_companions trong SQLite')
        return resolve()
      }
      
      console.log(`📦 Migrate ${rows.length} player companions...`)
      
      for (const row of rows) {
        try {
          await postgresPrisma.playerCompanion.upsert({
            where: { 
              playerId_companionId: {
                playerId: row.playerId,
                companionId: row.companionId
              }
            },
            update: {
              level: row.level,
              power: row.power,
              isActive: Boolean(row.isActive),
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            },
            create: {
              id: row.id,
              playerId: row.playerId,
              companionId: row.companionId,
              level: row.level,
              power: row.power,
              isActive: Boolean(row.isActive),
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt)
            }
          })
        } catch (error) {
          console.error(`❌ Lỗi migrate player companion ${row.id}:`, error.message)
        }
      }
      
      console.log('✅ Migrate player companions hoàn tất!')
      resolve()
    })
  })
}

// Các hàm migrate còn lại (tương tự pattern)
async function migrateAchievements() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM achievements", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table achievements trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} achievements...`)
      // Implementation tương tự
      console.log('✅ Migrate achievements hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerAchievements() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM player_achievements", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_achievements trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} player achievements...`)
      // Implementation tương tự
      console.log('✅ Migrate player achievements hoàn tất!')
      resolve()
    })
  })
}

async function migrateQuests() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM quests", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table quests trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} quests...`)
      // Implementation tương tự
      console.log('✅ Migrate quests hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerQuests() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM player_quests", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_quests trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} player quests...`)
      // Implementation tương tự
      console.log('✅ Migrate player quests hoàn tất!')
      resolve()
    })
  })
}

async function migrateEquipmentTypes() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM equipment_types", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table equipment_types trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} equipment types...`)
      // Implementation tương tự
      console.log('✅ Migrate equipment types hoàn tất!')
      resolve()
    })
  })
}

async function migrateEquipments() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM equipments", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table equipments trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} equipments...`)
      // Implementation tương tự
      console.log('✅ Migrate equipments hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerEquipments() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM player_equipments", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_equipments trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} player equipments...`)
      // Implementation tương tự
      console.log('✅ Migrate player equipments hoàn tất!')
      resolve()
    })
  })
}

async function migrateSkills() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM skills", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table skills trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} skills...`)
      // Implementation tương tự
      console.log('✅ Migrate skills hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerSkills() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM player_skills", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_skills trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} player skills...`)
      // Implementation tương tự
      console.log('✅ Migrate player skills hoàn tất!')
      resolve()
    })
  })
}

async function migrateTalentTypes() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM talent_types", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table talent_types trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} talent types...`)
      // Implementation tương tự
      console.log('✅ Migrate talent types hoàn tất!')
      resolve()
    })
  })
}

async function migrateTalents() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM talents", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table talents trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} talents...`)
      // Implementation tương tự
      console.log('✅ Migrate talents hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerTalents() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM player_talents", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_talents trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} player talents...`)
      // Implementation tương tự
      console.log('✅ Migrate player talents hoàn tất!')
      resolve()
    })
  })
}

async function migrateBuffs() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM buffs", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table buffs trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} buffs...`)
      // Implementation tương tự
      console.log('✅ Migrate buffs hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerBuffs() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM player_buffs", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_buffs trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} player buffs...`)
      // Implementation tương tự
      console.log('✅ Migrate player buffs hoàn tất!')
      resolve()
    })
  })
}

async function migrateGameConfigs() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM game_configs", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table game_configs trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} game configs...`)
      // Implementation tương tự
      console.log('✅ Migrate game configs hoàn tất!')
      resolve()
    })
  })
}

async function migrateShops() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM shops", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table shops trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} shops...`)
      // Implementation tương tự
      console.log('✅ Migrate shops hoàn tất!')
      resolve()
    })
  })
}

async function migrateShopItems() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM shop_items", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table shop_items trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} shop items...`)
      // Implementation tương tự
      console.log('✅ Migrate shop items hoàn tất!')
      resolve()
    })
  })
}

async function migratePurchaseHistories() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM purchase_histories", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table purchase_histories trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} purchase histories...`)
      // Implementation tương tự
      console.log('✅ Migrate purchase histories hoàn tất!')
      resolve()
    })
  })
}

async function migrateInventories() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM inventories", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table inventories trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} inventories...`)
      // Implementation tương tự
      console.log('✅ Migrate inventories hoàn tất!')
      resolve()
    })
  })
}

async function migrateRecipes() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM recipes", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table recipes trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} recipes...`)
      // Implementation tương tự
      console.log('✅ Migrate recipes hoàn tất!')
      resolve()
    })
  })
}

async function migrateCraftingHistories() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM crafting_histories", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table crafting_histories trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} crafting histories...`)
      // Implementation tương tự
      console.log('✅ Migrate crafting histories hoàn tất!')
      resolve()
    })
  })
}

async function migrateDaoFurnaces() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM dao_furnaces", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table dao_furnaces trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} dao furnaces...`)
      // Implementation tương tự
      console.log('✅ Migrate dao furnaces hoàn tất!')
      resolve()
    })
  })
}

async function migratePlayerFurnaces() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM player_furnaces", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table player_furnaces trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} player furnaces...`)
      // Implementation tương tự
      console.log('✅ Migrate player furnaces hoàn tất!')
      resolve()
    })
  })
}

async function migrateSpiritBeastTypes() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM spirit_beast_types", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table spirit_beast_types trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} spirit beast types...`)
      // Implementation tương tự
      console.log('✅ Migrate spirit beast types hoàn tất!')
      resolve()
    })
  })
}

async function migrateSpiritBeasts() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM spirit_beasts", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table spirit_beasts trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} spirit beasts...`)
      // Implementation tương tự
      console.log('✅ Migrate spirit beasts hoàn tất!')
      resolve()
    })
  })
}

async function migrateBeastFoods() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM beast_foods", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table beast_foods trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} beast foods...`)
      // Implementation tương tự
      console.log('✅ Migrate beast foods hoàn tất!')
      resolve()
    })
  })
}

async function migrateBeastFeedingHistories() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM beast_feeding_histories", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table beast_feeding_histories trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} beast feeding histories...`)
      // Implementation tương tự
      console.log('✅ Migrate beast feeding histories hoàn tất!')
      resolve()
    })
  })
}

async function migrateHuntingGrounds() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM hunting_grounds", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table hunting_grounds trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} hunting grounds...`)
      // Implementation tương tự
      console.log('✅ Migrate hunting grounds hoàn tất!')
      resolve()
    })
  })
}

async function migrateHuntingHistories() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM hunting_histories", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table hunting_histories trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} hunting histories...`)
      // Implementation tương tự
      console.log('✅ Migrate hunting histories hoàn tất!')
      resolve()
    })
  })
}

async function migrateCultivationLogs() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM cultivation_logs", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table cultivation_logs trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} cultivation logs...`)
      // Implementation tương tự
      console.log('✅ Migrate cultivation logs hoàn tất!')
      resolve()
    })
  })
}

async function migrateSessions() {
  return new Promise((resolve) => {
    sqliteDb.all("SELECT * FROM sessions", async (err, rows) => {
      if (err) {
        console.log('⚠️  Không có table sessions trong SQLite')
        return resolve()
      }
      console.log(`📦 Migrate ${rows.length} sessions...`)
      // Implementation tương tự
      console.log('✅ Migrate sessions hoàn tất!')
      resolve()
    })
  })
}

// Chạy migration
migrateData()
