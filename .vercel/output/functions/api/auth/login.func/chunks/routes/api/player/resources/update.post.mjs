import { PrismaClient } from '@prisma/client';
import { e as eventHandler, r as readBody, c as createError } from '../../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const prisma = new PrismaClient();
const update_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, resourceId, amount, locked } = body;
    if (!playerId || !resourceId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const updatedResource = await prisma.playerResource.upsert({
      where: {
        playerId_resourceId: {
          playerId,
          resourceId
        }
      },
      update: {
        ...amount !== void 0 && { amount },
        ...locked !== void 0 && { locked }
      },
      create: {
        playerId,
        resourceId,
        amount: amount || 0,
        locked: locked || 0
      }
    });
    return {
      success: true,
      message: "C\u1EADp nh\u1EADt t\xE0i nguy\xEAn th\xE0nh c\xF4ng",
      data: updatedResource
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
