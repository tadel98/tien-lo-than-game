import { PrismaClient } from '@prisma/client';
import { e as eventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const prisma = new PrismaClient();
const updateCombatPower_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, levelGain } = body;
    if (!playerId || !levelGain) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        stats: true,
        resources: {
          include: {
            resource: true
          }
        }
      }
    });
    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const pointsPerLevel = calculatePointsPerLevel(player.level);
    const totalPoints = pointsPerLevel * levelGain;
    const currentStats = player.stats || {
      hp: 100,
      mp: 50,
      attack: 10,
      defense: 5,
      speed: 8,
      luck: 5,
      wisdom: 5,
      strength: 5,
      agility: 5,
      vitality: 5,
      spirit: 5
    };
    const updatedStats = distributePoints(currentStats, totalPoints);
    await prisma.playerStats.upsert({
      where: { playerId },
      update: updatedStats,
      create: {
        playerId,
        ...updatedStats
      }
    });
    const newCombatPower = calculateCombatPower(updatedStats);
    const combatPowerResource = await prisma.resource.findFirst({
      where: { name: "suc_manh_chien_dau" }
    });
    if (combatPowerResource) {
      await prisma.playerResource.upsert({
        where: {
          playerId_resourceId: {
            playerId,
            resourceId: combatPowerResource.id
          }
        },
        update: {
          amount: newCombatPower
        },
        create: {
          playerId,
          resourceId: combatPowerResource.id,
          amount: newCombatPower
        }
      });
    }
    const oldCombatPower = player.resources.find((r) => r.resource.name === "suc_manh_chien_dau")?.amount || 0;
    return {
      success: true,
      data: {
        levelGain,
        pointsGained: totalPoints,
        oldStats: currentStats,
        newStats: updatedStats,
        combatPower: newCombatPower,
        combatPowerIncrease: newCombatPower - Number(oldCombatPower)
      }
    };
  } catch (error) {
    console.error("Update combat power error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i c\u1EADp nh\u1EADt s\u1EE9c m\u1EA1nh chi\u1EBFn \u0111\u1EA5u"
    });
  }
});
function calculatePointsPerLevel(level) {
  return 5 + Math.floor(level / 10);
}
function distributePoints(currentStats, totalPoints) {
  const stats = { ...currentStats };
  const statKeys = ["hp", "mp", "attack", "defense", "speed", "luck", "wisdom", "strength", "agility", "vitality", "spirit"];
  for (let i = 0; i < totalPoints; i++) {
    const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
    stats[randomStat] = (stats[randomStat] || 0) + 1;
  }
  return stats;
}
function calculateCombatPower(stats) {
  if (!stats) return 0;
  const basePower = (stats.hp || 0) + (stats.mp || 0) + (stats.attack || 0) + (stats.defense || 0) + (stats.speed || 0) + (stats.luck || 0) + (stats.wisdom || 0) + (stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0);
  const mainStatsBonus = ((stats.strength || 0) + (stats.agility || 0) + (stats.vitality || 0) + (stats.spirit || 0)) * 2;
  return Math.floor(basePower * 10 + mainStatsBonus);
}

export { updateCombatPower_post as default };
//# sourceMappingURL=update-combat-power.post.mjs.map
