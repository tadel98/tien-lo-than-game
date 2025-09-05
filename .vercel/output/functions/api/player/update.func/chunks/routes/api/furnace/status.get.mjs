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
const status_get = eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const playerId = query.playerId;
    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu ID ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const playerFurnaces = await prisma.playerFurnace.findMany({
      where: { playerId },
      include: {
        furnace: true
      }
    });
    const recipes = await prisma.recipe.findMany({
      where: { isActive: true },
      orderBy: [
        { category: "asc" },
        { level: "asc" }
      ]
    });
    const recentCrafting = await prisma.craftingHistory.findMany({
      where: { playerId },
      include: {
        recipe: true
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });
    return {
      success: true,
      data: {
        furnaces: playerFurnaces,
        recipes,
        recentCrafting
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
