import { PrismaClient } from '@prisma/client';
import { e as eventHandler, r as readBody, c as createError, $ as $fetch } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const prisma = new PrismaClient();
const autoCultivate_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, expGain = 1e3 } = body;
    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu playerId"
      });
    }
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
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
    const newExp = Number(player.experience) + Number(expGain);
    const currentLevel = player.level;
    let newLevel = currentLevel;
    let levelUp = false;
    let levelGain = 0;
    for (let level = currentLevel + 1; level <= 1e3; level++) {
      const requiredExp = Math.pow(level, 2) * 1440;
      if (newExp >= requiredExp) {
        newLevel = level;
        levelUp = true;
        levelGain = level - currentLevel;
      } else {
        break;
      }
    }
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        experience: newExp,
        level: newLevel,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    if (levelUp) {
      try {
        const combatPowerResponse = await $fetch("/api/character/update-combat-power", {
          method: "POST",
          body: {
            playerId,
            levelGain
          }
        });
        console.log("Combat power updated:", combatPowerResponse.data.combatPowerIncrease);
      } catch (err) {
        console.error("Error updating combat power:", err);
      }
    }
    await prisma.cultivationLog.create({
      data: {
        playerId,
        type: "auto_cultivation",
        description: `Tu luy\u1EC7n t\u1EF1 \u0111\u1ED9ng +${expGain} EXP`,
        expGained: Number(expGain),
        levelGained: levelGain,
        timestamp: /* @__PURE__ */ new Date()
      }
    });
    return {
      success: true,
      data: {
        player: {
          id: updatedPlayer.id,
          name: updatedPlayer.name,
          level: updatedPlayer.level,
          experience: Number(updatedPlayer.experience),
          realm: updatedPlayer.realm
        },
        cultivation: {
          expGained: Number(expGain),
          levelUp,
          levelGain,
          newLevel: updatedPlayer.level,
          newExp: Number(updatedPlayer.experience)
        }
      }
    };
  } catch (error) {
    console.error("Auto cultivation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i tu luy\u1EC7n t\u1EF1 \u0111\u1ED9ng"
    });
  }
});

export { autoCultivate_post as default };
//# sourceMappingURL=auto-cultivate.post.mjs.map
