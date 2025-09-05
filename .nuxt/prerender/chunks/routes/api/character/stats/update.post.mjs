import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, readBody, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const update_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, stats } = body;
    if (!playerId || !stats) {
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
    const updatedStats = await prisma.playerStats.upsert({
      where: { playerId },
      update: stats,
      create: {
        playerId,
        ...stats
      }
    });
    return {
      success: true,
      message: "C\u1EADp nh\u1EADt thu\u1ED9c t\xEDnh th\xE0nh c\xF4ng",
      data: updatedStats
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { update_post as default };
//# sourceMappingURL=update.post.mjs.map
