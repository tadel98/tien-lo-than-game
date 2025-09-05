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
const start_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, cultivationType = "basic" } = body;
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
    const huyenLucResource = player.resources.find((r) => r.resource.name === "huyen_luc");
    const huyenLucAmount = huyenLucResource ? Number(huyenLucResource.amount) : 0;
    if (huyenLucAmount < 100) {
      throw createError({
        statusCode: 400,
        statusMessage: "Kh\xF4ng \u0111\u1EE7 S\u1EE9c M\u1EA1nh Chi\u1EBFn \u0110\u1EA5u \u0111\u1EC3 tu luy\u1EC7n (c\u1EA7n \xEDt nh\u1EA5t 100)"
      });
    }
    const experienceGain = calculateExperienceGain(player.level, cultivationType);
    const resourceCost = calculateResourceCost(cultivationType);
    const newExperience = BigInt(player.experience) + BigInt(experienceGain);
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        experience: newExperience,
        level: calculateNewLevel(Number(newExperience))
      }
    });
    if (huyenLucResource) {
      await prisma.playerResource.update({
        where: { id: huyenLucResource.id },
        data: {
          amount: Number(huyenLucResource.amount) - resourceCost.huyenLuc
        }
      });
    }
    if (resourceCost.rewards) {
      for (const [resourceName, amount] of Object.entries(resourceCost.rewards)) {
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
    }
    return {
      success: true,
      message: "Tu luy\u1EC7n th\xE0nh c\xF4ng",
      data: {
        player: {
          ...updatedPlayer,
          experience: updatedPlayer.experience.toString()
        },
        experienceGain,
        resourceCost,
        newLevel: updatedPlayer.level
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});
function calculateExperienceGain(level, cultivationType) {
  const baseExp = 100;
  const levelMultiplier = Math.floor(level / 10) + 1;
  const typeMultiplier = cultivationType === "advanced" ? 2 : 1;
  return Math.floor(baseExp * levelMultiplier * typeMultiplier);
}
function calculateResourceCost(cultivationType) {
  const costs = {
    basic: {
      huyenLuc: 100,
      // Sức Mạnh Chiến Đấu (Huyền Lực)
      rewards: {
        linh_thach: 50
      }
    },
    advanced: {
      huyenLuc: 500,
      // Sức Mạnh Chiến Đấu (Huyền Lực)
      rewards: {
        linh_thach: 200,
        nguyen_thach: 100
      }
    }
  };
  return costs[cultivationType] || costs.basic;
}
function calculateNewLevel(experience) {
  return Math.floor(Math.sqrt(experience / 1e3)) + 1;
}

export { start_post as default };
//# sourceMappingURL=start.post.mjs.map
