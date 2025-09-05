import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, readBody, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const complete_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, questId } = body;
    if (!playerId || !questId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const playerQuest = await prisma.playerQuest.findFirst({
      where: {
        playerId,
        questId
      },
      include: {
        quest: true
      }
    });
    if (!playerQuest) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y nhi\u1EC7m v\u1EE5 c\u1EE7a ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    if (playerQuest.status !== "in_progress") {
      throw createError({
        statusCode: 400,
        statusMessage: "Nhi\u1EC7m v\u1EE5 kh\xF4ng \u0111ang \u0111\u01B0\u1EE3c th\u1EF1c hi\u1EC7n"
      });
    }
    const quest = playerQuest.quest;
    const now = /* @__PURE__ */ new Date();
    let updateData = {
      status: "completed",
      completedAt: now,
      lastCompletedAt: now
    };
    if (quest.isRepeatable && quest.repeatInterval) {
      const cooldownUntil = new Date(now.getTime() + quest.repeatInterval * 60 * 1e3);
      updateData.cooldownUntil = cooldownUntil;
      updateData.status = "cooldown";
    }
    await prisma.playerQuest.update({
      where: { id: playerQuest.id },
      data: updateData
    });
    const rewards = JSON.parse(quest.rewards);
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
    if (rewards.experience) {
      const newExp = Number(player.experience) + Number(rewards.experience);
      await prisma.player.update({
        where: { id: playerId },
        data: { experience: newExp }
      });
    }
    if (rewards.resources) {
      for (const [resourceName, amount] of Object.entries(rewards.resources)) {
        const resource = await prisma.resource.findFirst({
          where: { name: resourceName }
        });
        if (resource) {
          const playerResource = await prisma.playerResource.findFirst({
            where: {
              playerId,
              resourceId: resource.id
            }
          });
          if (playerResource) {
            await prisma.playerResource.update({
              where: { id: playerResource.id },
              data: {
                amount: Number(playerResource.amount) + Number(amount)
              }
            });
          } else {
            await prisma.playerResource.create({
              data: {
                playerId,
                resourceId: resource.id,
                amount: Number(amount)
              }
            });
          }
        }
      }
    }
    let levelUp = false;
    let newLevel = player.level;
    if (rewards.experience) {
      const newExp = Number(player.experience) + Number(rewards.experience);
      for (let level = player.level + 1; level <= 1e3; level++) {
        const requiredExp = Math.pow(level, 2) * 1440;
        if (newExp >= requiredExp) {
          newLevel = level;
          levelUp = true;
        } else {
          break;
        }
      }
      if (levelUp) {
        await prisma.player.update({
          where: { id: playerId },
          data: {
            level: newLevel,
            experience: newExp
          }
        });
      }
    }
    return {
      success: true,
      data: {
        quest: {
          ...quest,
          playerStatus: {
            status: "completed",
            progress: JSON.parse(playerQuest.progress),
            startedAt: playerQuest.startedAt,
            completedAt: /* @__PURE__ */ new Date()
          }
        },
        rewards,
        levelUp,
        newLevel: levelUp ? newLevel : player.level
      }
    };
  } catch (error) {
    console.error("Complete quest error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i ho\xE0n th\xE0nh nhi\u1EC7m v\u1EE5"
    });
  }
});

export { complete_post as default };
//# sourceMappingURL=complete.post.mjs.map
