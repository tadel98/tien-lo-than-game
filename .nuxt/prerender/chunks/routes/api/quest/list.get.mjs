import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, getQuery, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const list_get = eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const playerId = query.playerId;
    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu ID ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const quests = await prisma.quest.findMany({
      orderBy: { difficulty: "asc" }
    });
    const playerQuests = await prisma.playerQuest.findMany({
      where: { playerId },
      include: {
        quest: true
      }
    });
    const playerQuestMap = /* @__PURE__ */ new Map();
    playerQuests.forEach((pq) => {
      playerQuestMap.set(pq.questId, pq);
    });
    const questsWithStatus = quests.map((quest) => {
      const playerQuest = playerQuestMap.get(quest.id);
      if (quest.isRepeatable && playerQuest) {
        const now = /* @__PURE__ */ new Date();
        const cooldownUntil = playerQuest.cooldownUntil ? new Date(playerQuest.cooldownUntil) : null;
        if (cooldownUntil && now >= cooldownUntil) {
          return {
            ...quest,
            playerStatus: {
              status: "available",
              progress: {},
              startedAt: null,
              completedAt: null,
              lastCompletedAt: playerQuest.lastCompletedAt,
              cooldownUntil: null,
              canRepeat: true
            }
          };
        } else if (cooldownUntil) {
          return {
            ...quest,
            playerStatus: {
              status: "cooldown",
              progress: {},
              startedAt: null,
              completedAt: null,
              lastCompletedAt: playerQuest.lastCompletedAt,
              cooldownUntil: playerQuest.cooldownUntil,
              canRepeat: false,
              cooldownRemaining: Math.max(0, Math.ceil((cooldownUntil.getTime() - now.getTime()) / 1e3))
            }
          };
        }
      }
      return {
        ...quest,
        playerStatus: playerQuest ? {
          status: playerQuest.status,
          progress: playerQuest.progress ? JSON.parse(playerQuest.progress) : {},
          startedAt: playerQuest.startedAt,
          completedAt: playerQuest.completedAt,
          lastCompletedAt: playerQuest.lastCompletedAt,
          cooldownUntil: playerQuest.cooldownUntil,
          canRepeat: quest.isRepeatable
        } : {
          status: "available",
          progress: {},
          startedAt: null,
          completedAt: null,
          lastCompletedAt: null,
          cooldownUntil: null,
          canRepeat: quest.isRepeatable
        }
      };
    });
    return {
      success: true,
      data: {
        quests: questsWithStatus,
        total: quests.length
      }
    };
  } catch (error) {
    console.error("Quest list error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i l\u1EA5y danh s\xE1ch nhi\u1EC7m v\u1EE5"
    });
  }
});

export { list_get as default };
//# sourceMappingURL=list.get.mjs.map
