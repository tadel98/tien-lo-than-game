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
    const { playerId, questId } = body;
    if (!playerId || !questId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const quest = await prisma.quest.findUnique({
      where: { id: questId }
    });
    if (!quest) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y nhi\u1EC7m v\u1EE5"
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
    if (player.level < quest.level) {
      throw createError({
        statusCode: 400,
        statusMessage: `C\u1EA7n level ${quest.level} \u0111\u1EC3 nh\u1EADn nhi\u1EC7m v\u1EE5 n\xE0y`
      });
    }
    const existingPlayerQuest = await prisma.playerQuest.findFirst({
      where: {
        playerId,
        questId
      }
    });
    if (existingPlayerQuest) {
      if (existingPlayerQuest.status === "in_progress") {
        throw createError({
          statusCode: 400,
          statusMessage: "Nhi\u1EC7m v\u1EE5 \u0111ang \u0111\u01B0\u1EE3c th\u1EF1c hi\u1EC7n"
        });
      }
      if (existingPlayerQuest.status === "completed") {
        throw createError({
          statusCode: 400,
          statusMessage: "Nhi\u1EC7m v\u1EE5 \u0111\xE3 ho\xE0n th\xE0nh"
        });
      }
    }
    const playerQuest = await prisma.playerQuest.upsert({
      where: {
        playerId_questId: {
          playerId,
          questId
        }
      },
      update: {
        status: "in_progress",
        startedAt: /* @__PURE__ */ new Date(),
        progress: JSON.stringify({})
      },
      create: {
        playerId,
        questId,
        status: "in_progress",
        startedAt: /* @__PURE__ */ new Date(),
        progress: JSON.stringify({})
      }
    });
    return {
      success: true,
      data: {
        quest: {
          ...quest,
          playerStatus: {
            status: playerQuest.status,
            progress: JSON.parse(playerQuest.progress),
            startedAt: playerQuest.startedAt,
            completedAt: playerQuest.completedAt
          }
        }
      }
    };
  } catch (error) {
    console.error("Start quest error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i b\u1EAFt \u0111\u1EA7u nhi\u1EC7m v\u1EE5"
    });
  }
});

export { start_post as default };
//# sourceMappingURL=start.post.mjs.map
