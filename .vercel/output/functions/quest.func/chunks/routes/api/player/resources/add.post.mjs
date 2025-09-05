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
const add_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, resourceName, amount } = body;
    if (!playerId || !resourceName || !amount) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const resource = await prisma.resource.findFirst({
      where: { name: resourceName }
    });
    if (!resource) {
      throw createError({
        statusCode: 404,
        statusMessage: `Kh\xF4ng t\xECm th\u1EA5y t\xE0i nguy\xEAn ${resourceName}`
      });
    }
    const playerResource = await prisma.playerResource.findFirst({
      where: {
        playerId,
        resourceId: resource.id
      }
    });
    if (!playerResource) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y t\xE0i nguy\xEAn c\u1EE7a ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const newAmount = Number(playerResource.amount) + Number(amount);
    const updatedResource = await prisma.playerResource.update({
      where: { id: playerResource.id },
      data: {
        amount: newAmount
      }
    });
    return {
      success: true,
      message: `\u0110\xE3 th\xEAm ${amount} ${resource.displayName}`,
      data: updatedResource
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { add_post as default };
//# sourceMappingURL=add.post.mjs.map
