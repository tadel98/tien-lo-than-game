import { PrismaClient } from '@prisma/client';
import { e as eventHandler, g as getQuery, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

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
      let combatPower = 0;
      const combatPowerResource = player.resources?.find((r) => r.resource.name === "suc_manh_chien_dau");
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
            if (equipment.equipment) {
              equipmentBonus += equipment.equipment.stats?.strength || 0;
              equipmentBonus += equipment.equipment.stats?.agility || 0;
              equipmentBonus += equipment.equipment.stats?.intelligence || 0;
              equipmentBonus += equipment.equipment.stats?.vitality || 0;
            }
          });
        }
        combatPower = Math.floor(
          (totalStats.strength + totalStats.agility + totalStats.intelligence + totalStats.vitality) * 10 + equipmentBonus * 5 + player.level * 100
        );
      }
      const huyenLucResource = player.resources?.find((r) => r.resource.name === "huyen_luc");
      const linhThachResource = player.resources?.find((r) => r.resource.name === "linh_thach");
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
        equipmentCount: player.equipments?.length || 0,
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
