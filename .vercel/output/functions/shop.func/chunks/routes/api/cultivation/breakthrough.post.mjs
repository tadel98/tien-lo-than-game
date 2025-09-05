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
const breakthrough_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId } = body;
    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu ID ng\u01B0\u1EDDi ch\u01A1i"
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
    const currentLevel = player.level;
    const currentExp = Number(player.experience);
    const nextLevelExp = calculateNextLevelExp(currentLevel);
    if (currentExp < nextLevelExp) {
      throw createError({
        statusCode: 400,
        statusMessage: "Ch\u01B0a \u0111\u1EE7 kinh nghi\u1EC7m \u0111\u1EC3 \u0111\u1ED9t ph\xE1"
      });
    }
    const breakthroughCost = calculateBreakthroughCost(currentLevel);
    const tienNgocResource = player.resources.find((r) => r.resource.name === "tien_ngoc");
    const linhThachResource = player.resources.find((r) => r.resource.name === "linh_thach");
    if (!tienNgocResource || Number(tienNgocResource.amount) < breakthroughCost.tienNgoc) {
      throw createError({
        statusCode: 400,
        statusMessage: "Kh\xF4ng \u0111\u1EE7 Ti\xEAn Ng\u1ECDc \u0111\u1EC3 \u0111\u1ED9t ph\xE1"
      });
    }
    if (!linhThachResource || Number(linhThachResource.amount) < breakthroughCost.linhThach) {
      throw createError({
        statusCode: 400,
        statusMessage: "Kh\xF4ng \u0111\u1EE7 Linh Th\u1EA1ch \u0111\u1EC3 \u0111\u1ED9t ph\xE1"
      });
    }
    const newLevel = currentLevel + 1;
    const newRealm = calculateRealm(newLevel);
    const oldRealm = calculateRealm(currentLevel);
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        level: newLevel,
        realm: newRealm
      }
    });
    try {
      const combatPowerResponse = await $fetch("/api/character/update-combat-power", {
        method: "POST",
        body: {
          playerId,
          levelGain: 1
          // Đột phá tăng 1 level
        }
      });
      console.log("Combat power updated after breakthrough:", combatPowerResponse.data.combatPowerIncrease);
    } catch (err) {
      console.error("Error updating combat power after breakthrough:", err);
    }
    await prisma.playerResource.update({
      where: { id: tienNgocResource.id },
      data: {
        amount: Number(tienNgocResource.amount) - breakthroughCost.tienNgoc
      }
    });
    await prisma.playerResource.update({
      where: { id: linhThachResource.id },
      data: {
        amount: Number(linhThachResource.amount) - breakthroughCost.linhThach
      }
    });
    const rewards = calculateBreakthroughRewards(newLevel);
    for (const [resourceName, amount] of Object.entries(rewards)) {
      const resource = await prisma.resource.findFirst({
        where: { name: resourceName }
      });
      if (resource) {
        const playerResource = await prisma.playerResource.findFirst({
          where: {
            playerId,
            resourceId: resource.id
          }
        });
        if (playerResource) {
          await prisma.playerResource.update({
            where: { id: playerResource.id },
            data: {
              amount: Number(playerResource.amount) + Number(amount)
            }
          });
        }
      }
    }
    return {
      success: true,
      message: "\u0110\u1ED9t ph\xE1 th\xE0nh c\xF4ng!",
      data: {
        player: {
          ...updatedPlayer,
          experience: updatedPlayer.experience.toString()
        },
        breakthrough: {
          oldLevel: currentLevel,
          newLevel,
          oldRealm,
          newRealm,
          isRealmChange: oldRealm !== newRealm,
          rewards
        }
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});
function calculateNextLevelExp(level) {
  return Math.pow(level, 2) * 1440;
}
function calculateRealm(level) {
  if (level < 10) return "Ph\xE0m c\u1EA3nh";
  if (level < 50) return "Luy\u1EC7n Kh\xED c\u1EA3nh";
  if (level < 100) return "Tr\xFAc C\u01A1 c\u1EA3nh";
  if (level < 200) return "Kim \u0110an c\u1EA3nh";
  if (level < 500) return "Nguy\xEAn Anh c\u1EA3nh";
  if (level < 1e3) return "H\xF3a Th\u1EA7n c\u1EA3nh";
  return "H\u1EE3p Th\u1EC3 c\u1EA3nh";
}
function calculateBreakthroughCost(level) {
  const baseTienNgoc = 1e3;
  const baseLinhThach = 5e3;
  const levelMultiplier = Math.floor(level / 10) + 1;
  return {
    tienNgoc: baseTienNgoc * levelMultiplier,
    linhThach: baseLinhThach * levelMultiplier
  };
}
function calculateBreakthroughRewards(level) {
  const baseRewards = {
    tien_ngoc: 10,
    linh_thach: 1e3,
    nguyen_thach: 500
  };
  const levelMultiplier = Math.floor(level / 10) + 1;
  const rewards = {};
  for (const [resource, amount] of Object.entries(baseRewards)) {
    rewards[resource] = amount * levelMultiplier;
  }
  return rewards;
}

export { breakthrough_post as default };
//# sourceMappingURL=breakthrough.post.mjs.map
