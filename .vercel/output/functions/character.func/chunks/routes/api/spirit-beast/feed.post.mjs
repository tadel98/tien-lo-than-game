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
const feed_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, beastId, foodId, quantity = 1 } = body;
    if (!playerId || !beastId || !foodId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
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
    const beast = await prisma.spiritBeast.findFirst({
      where: {
        id: beastId,
        playerId
      },
      include: {
        type: true
      }
    });
    if (!beast) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y linh th\xFA"
      });
    }
    const food = await prisma.beastFood.findUnique({
      where: { id: foodId }
    });
    if (!food) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y th\u1EE9c \u0103n"
      });
    }
    const totalCost = food.price * quantity;
    const currencyResource = player.resources.find((r) => r.resource.name === food.currency);
    if (!currencyResource || Number(currencyResource.amount) < totalCost) {
      throw createError({
        statusCode: 400,
        statusMessage: `Kh\xF4ng \u0111\u1EE7 ${food.currency} \u0111\u1EC3 mua th\u1EE9c \u0103n`
      });
    }
    const effects = JSON.parse(food.effects);
    const currentStats = JSON.parse(beast.stats);
    const newStats = { ...currentStats };
    const newHappiness = Math.min(100, beast.happiness + (effects.happiness || 0) * quantity);
    const newHunger = Math.min(100, beast.hunger + (effects.hunger || 0) * quantity);
    const newHealth = Math.min(100, beast.health + (effects.health || 0) * quantity);
    for (const [stat, value] of Object.entries(effects)) {
      if (stat !== "happiness" && stat !== "hunger" && stat !== "health" && typeof value === "number") {
        newStats[stat] = (newStats[stat] || 0) + value * quantity;
      }
    }
    await prisma.$transaction(async (tx) => {
      await tx.playerResource.update({
        where: { id: currencyResource?.id },
        data: {
          amount: Number(currencyResource.amount) - totalCost
        }
      });
      await tx.spiritBeast.update({
        where: { id: beastId },
        data: {
          stats: JSON.stringify(newStats),
          happiness: newHappiness,
          hunger: newHunger,
          health: newHealth,
          lastFedAt: /* @__PURE__ */ new Date()
        }
      });
      await tx.beastFeedingHistory.create({
        data: {
          playerId,
          beastId,
          foodId,
          quantity,
          effects: JSON.stringify(effects)
        }
      });
    });
    return {
      success: true,
      message: "Cho \u0103n th\xE0nh c\xF4ng!",
      data: {
        beast: beast.name,
        food: food.displayName,
        quantity,
        effects: {
          happiness: newHappiness - beast.happiness,
          hunger: newHunger - beast.hunger,
          health: newHealth - beast.health,
          stats: newStats
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

export { feed_post as default };
//# sourceMappingURL=feed.post.mjs.map
