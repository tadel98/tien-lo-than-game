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
const hunt_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, groundId } = body;
    if (!playerId || !groundId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    });
    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const ground = await prisma.huntingGround.findUnique({
      where: { id: groundId }
    });
    if (!ground) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y khu s\u0103n b\u1EAFn"
      });
    }
    const baseValue = Number(ground.baseValue);
    const calculatedStats = {
      strength: baseValue + player.level * 0.1,
      agility: baseValue + player.level * 0.1,
      intelligence: baseValue + player.level * 0.1
    };
    const successRate = Math.min(0.8, 0.3 + player.level * 0.01);
    const isSuccess = Math.random() < successRate;
    let capturedBeast = null;
    if (isSuccess) {
      const beastType = await prisma.spiritBeastType.findFirst({
        where: {
          level: {
            lte: player.level
          }
        },
        orderBy: {
          level: "desc"
        }
      });
      if (beastType) {
        capturedBeast = await prisma.spiritBeast.create({
          data: {
            playerId,
            typeId: beastType.id,
            name: beastType.name,
            level: 1,
            experience: 0,
            stats: JSON.stringify(calculatedStats),
            isActive: false,
            isFighting: false
          }
        });
      }
    }
    const rewards = {
      experience: Math.floor(Math.random() * 100) + 50,
      resources: {
        linh_thach: Math.floor(Math.random() * 10) + 5
      }
    };
    const dropRates = JSON.parse(ground.dropRates || "{}");
    for (const [item, rate] of Object.entries(dropRates)) {
      if (Math.random() < Number(rate)) {
        rewards.additional = rewards.additional || {};
        rewards.additional[item] = Math.floor(Math.random() * 3) + 1;
      }
    }
    await prisma.huntingHistory.create({
      data: {
        playerId,
        groundId,
        capturedBeastId: capturedBeast?.id || null,
        isSuccess,
        rewards: JSON.stringify(rewards),
        createdAt: /* @__PURE__ */ new Date()
      }
    });
    return {
      success: true,
      message: isSuccess ? "B\u1EAFt \u0111\u01B0\u1EE3c linh th\xFA!" : "Kh\xF4ng b\u1EAFt \u0111\u01B0\u1EE3c linh th\xFA",
      capturedBeast,
      rewards,
      isSuccess
    };
  } catch (error) {
    console.error("Hunt error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i s\u0103n b\u1EAFn"
    });
  }
});

export { hunt_post as default };
//# sourceMappingURL=hunt.post.mjs.map
