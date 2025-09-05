import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, getQuery, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

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
