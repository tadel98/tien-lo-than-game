import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const syncCombatPower_post = eventHandler(async (event) => {
  var _a;
  try {
    const players = await prisma.player.findMany({
      where: {
        stats: {
          isNot: null
        }
      },
      include: {
        stats: true,
        resources: {
          include: {
            resource: true
          }
        }
      }
    });
    const combatPowerResource = await prisma.resource.findFirst({
      where: { name: "suc_manh_chien_dau" }
    });
    if (!combatPowerResource) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y resource s\u1EE9c m\u1EA1nh chi\u1EBFn \u0111\u1EA5u"
      });
    }
    let updatedCount = 0;
    const results = [];
    for (const player of players) {
      if (!player.stats) continue;
      const stats = player.stats;
      const basePower = (stats.hp || 0) + (stats.mp || 0) + (stats.attack || 0) + (stats.defense || 0) + (stats.speed || 0) + (stats.luck || 0) + (stats.wisdom || 0) + (stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0);
      const mainStatsBonus = ((stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)) * 2;
      const newCombatPower = Math.floor(basePower * 10 + mainStatsBonus);
      const oldCombatPower = ((_a = player.resources.find((r) => r.resource.name === "suc_manh_chien_dau")) == null ? void 0 : _a.amount) || 0;
      await prisma.playerResource.upsert({
        where: {
          playerId_resourceId: {
            playerId: player.id,
            resourceId: combatPowerResource.id
          }
        },
        update: {
          amount: newCombatPower
        },
        create: {
          playerId: player.id,
          resourceId: combatPowerResource.id,
          amount: newCombatPower
        }
      });
      updatedCount++;
      results.push({
        playerId: player.id,
        playerName: player.name,
        oldCombatPower: Number(oldCombatPower),
        newCombatPower,
        difference: newCombatPower - Number(oldCombatPower)
      });
    }
    return {
      success: true,
      data: {
        updatedCount,
        totalPlayers: players.length,
        results: results.slice(0, 10),
        // Chỉ trả về 10 kết quả đầu tiên
        message: `\u0110\xE3 c\u1EADp nh\u1EADt s\u1EE9c m\u1EA1nh chi\u1EBFn \u0111\u1EA5u cho ${updatedCount} ng\u01B0\u1EDDi ch\u01A1i`
      }
    };
  } catch (error) {
    console.error("Sync combat power error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i \u0111\u1ED3ng b\u1ED9 s\u1EE9c m\u1EA1nh chi\u1EBFn \u0111\u1EA5u"
    });
  }
});

export { syncCombatPower_post as default };
//# sourceMappingURL=sync-combat-power.post.mjs.map
