import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, getQuery, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const topPlayers_get = eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const limit = parseInt(query.limit) || 20;
    const type = query.type || "level";
    let players;
    let orderBy;
    switch (type) {
      case "combat_power":
        orderBy = { level: "desc" };
        break;
      case "experience":
        orderBy = { experience: "desc" };
        break;
      case "level":
      default:
        orderBy = { level: "desc" };
        break;
    }
    players = await prisma.player.findMany({
      take: limit,
      orderBy,
      include: {
        stats: true,
        equipments: {
          where: { isEquipped: true },
          include: {
            equipment: {
              include: {
                type: true
              }
            }
          }
        },
        resources: {
          include: {
            resource: true
          }
        }
      }
    });
    const rankedPlayers = players.map((player, index) => {
      var _a, _b, _c, _d;
      let combatPower = 0;
      const combatPowerResource = (_a = player.resources) == null ? void 0 : _a.find((r) => r.resource.name === "suc_manh_chien_dau");
      if (combatPowerResource) {
        combatPower = Number(combatPowerResource.amount) || 0;
      } else if (player.stats) {
        const baseStats = player.stats;
        const totalStats = {
          strength: baseStats.strength + baseStats.strength * 0.1 * player.level,
          agility: baseStats.agility + baseStats.agility * 0.1 * player.level,
          intelligence: baseStats.intelligence + baseStats.intelligence * 0.1 * player.level,
          vitality: baseStats.vitality + baseStats.vitality * 0.1 * player.level
        };
        let equipmentBonus = 0;
        if (player.equipments) {
          player.equipments.forEach((equipment) => {
            var _a2, _b2, _c2, _d2;
            if (equipment.equipment) {
              equipmentBonus += ((_a2 = equipment.equipment.stats) == null ? void 0 : _a2.strength) || 0;
              equipmentBonus += ((_b2 = equipment.equipment.stats) == null ? void 0 : _b2.agility) || 0;
              equipmentBonus += ((_c2 = equipment.equipment.stats) == null ? void 0 : _c2.intelligence) || 0;
              equipmentBonus += ((_d2 = equipment.equipment.stats) == null ? void 0 : _d2.vitality) || 0;
            }
          });
        }
        combatPower = Math.floor(
          (totalStats.strength + totalStats.agility + totalStats.intelligence + totalStats.vitality) * 10 + equipmentBonus * 5 + player.level * 100
        );
      }
      const huyenLucResource = (_b = player.resources) == null ? void 0 : _b.find((r) => r.resource.name === "huyen_luc");
      const linhThachResource = (_c = player.resources) == null ? void 0 : _c.find((r) => r.resource.name === "linh_thach");
      return {
        rank: index + 1,
        id: player.id,
        name: player.name,
        level: player.level,
        realm: player.realm,
        experience: Number(player.experience),
        combatPower,
        resources: {
          huyenLuc: huyenLucResource ? Number(huyenLucResource.amount) : 0,
          linhThach: linhThachResource ? Number(linhThachResource.amount) : 0
        },
        stats: player.stats ? {
          strength: player.stats.strength,
          agility: player.stats.agility,
          intelligence: player.stats.intelligence,
          vitality: player.stats.vitality
        } : null,
        equipmentCount: ((_d = player.equipments) == null ? void 0 : _d.length) || 0,
        lastActive: player.updatedAt
      };
    });
    if (type === "combat_power") {
      rankedPlayers.sort((a, b) => b.combatPower - a.combatPower);
      rankedPlayers.forEach((player, index) => {
        player.rank = index + 1;
      });
    }
    return {
      success: true,
      data: {
        ranking: rankedPlayers,
        type,
        total: rankedPlayers.length,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  } catch (error) {
    console.error("Ranking error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i l\u1EA5y b\u1EA3ng x\u1EBFp h\u1EA1ng"
    });
  }
});

export { topPlayers_get as default };
//# sourceMappingURL=top-players.get.mjs.map
