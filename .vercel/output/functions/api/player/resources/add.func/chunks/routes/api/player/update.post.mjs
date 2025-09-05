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
const update_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, level, realm, experience } = body;
    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu ID ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const updatedPlayer = await prisma.player.update({
      where: {
        id: playerId
      },
      data: {
        ...level && { level },
        ...realm && { realm },
        ...experience && { experience: BigInt(experience) }
      }
    });
    return {
      success: true,
      message: "C\u1EADp nh\u1EADt th\xF4ng tin ng\u01B0\u1EDDi ch\u01A1i th\xE0nh c\xF4ng",
      data: {
        ...updatedPlayer,
        experience: updatedPlayer.experience.toString()
      }
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
