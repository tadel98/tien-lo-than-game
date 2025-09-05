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
const companions_get = eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const playerId = query.playerId;
    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu ID ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const playerCompanions = await prisma.playerCompanion.findMany({
      where: {
        playerId
      },
      include: {
        companion: true
      }
    });
    return {
      success: true,
      data: playerCompanions
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { companions_get as default };
//# sourceMappingURL=companions.get.mjs.map
