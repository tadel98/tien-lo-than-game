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
const stats_get = eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const playerId = query.playerId;
    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu ID ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        stats: true,
        equipments: {
          include: {
            equipment: {
              include: {
                type: true
              }
            }
          },
          where: {
            isEquipped: true
          }
        },
        skills: {
          include: {
            skill: true
          },
          where: {
            isLearned: true
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
    const baseStats = player.stats || {
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
    let totalStats = { ...baseStats };
    for (const playerEquipment of player.equipments) {
      if (playerEquipment.equipment.stats) {
        try {
          const equipmentStats = JSON.parse(playerEquipment.equipment.stats);
          for (const [stat, value] of Object.entries(equipmentStats)) {
            if (totalStats[stat] !== void 0) {
              totalStats[stat] += Number(value) * (1 + playerEquipment.enhancement * 0.1);
            }
          }
        } catch (e) {
          console.error("Error parsing equipment stats:", e);
        }
      }
    }
    const combatPower = Math.floor(
      totalStats.attack * 2 + totalStats.defense * 1.5 + totalStats.speed * 1.2 + totalStats.hp * 0.1 + totalStats.mp * 0.05 + totalStats.luck * 0.8 + totalStats.wisdom * 0.6 + totalStats.strength * 0.7 + totalStats.agility * 0.9 + totalStats.vitality * 0.5 + totalStats.spirit * 0.4
    );
    return {
      success: true,
      data: {
        player: {
          ...player,
          experience: player.experience.toString()
        },
        stats: {
          base: baseStats,
          total: totalStats,
          combatPower
          // Sức Mạnh Chiến Đấu
        },
        equipment: player.equipments.map((pe) => ({
          ...pe,
          equipment: {
            ...pe.equipment,
            stats: pe.equipment.stats ? JSON.parse(pe.equipment.stats) : {}
          }
        })),
        skills: player.skills.map((ps) => ({
          ...ps,
          skill: {
            ...ps.skill,
            effects: ps.skill.effects ? JSON.parse(ps.skill.effects) : {},
            requirements: ps.skill.requirements ? JSON.parse(ps.skill.requirements) : {}
          }
        }))
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
