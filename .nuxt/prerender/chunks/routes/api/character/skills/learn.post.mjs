import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, readBody, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const learn_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, skillId } = body;
    if (!playerId || !skillId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const skill = await prisma.skill.findUnique({
      where: { id: skillId }
    });
    if (!skill) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y k\u1EF9 n\u0103ng"
      });
    }
    if (skill.requirements) {
      try {
        const requirements = JSON.parse(skill.requirements);
        const player = await prisma.player.findUnique({
          where: { id: playerId }
        });
        if (player && requirements.level && player.level < requirements.level) {
          throw createError({
            statusCode: 400,
            statusMessage: `C\u1EA7n c\u1EA5p ${requirements.level} \u0111\u1EC3 h\u1ECDc k\u1EF9 n\u0103ng n\xE0y`
          });
        }
      } catch (e) {
        console.error("Error parsing skill requirements:", e);
      }
    }
    const existingSkill = await prisma.playerSkill.findUnique({
      where: {
        playerId_skillId: {
          playerId,
          skillId
        }
      }
    });
    if (existingSkill) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u0110\xE3 h\u1ECDc k\u1EF9 n\u0103ng n\xE0y r\u1ED3i"
      });
    }
    const playerSkill = await prisma.playerSkill.create({
      data: {
        playerId,
        skillId,
        isLearned: true,
        learnedAt: /* @__PURE__ */ new Date()
      },
      include: {
        skill: true
      }
    });
    return {
      success: true,
      message: `\u0110\xE3 h\u1ECDc k\u1EF9 n\u0103ng ${skill.displayName}`,
      data: playerSkill
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { learn_post as default };
//# sourceMappingURL=learn.post.mjs.map
