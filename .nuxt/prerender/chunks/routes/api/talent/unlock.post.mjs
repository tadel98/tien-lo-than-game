import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, readBody, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const unlock_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, talentId } = body;
    if (!playerId || !talentId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const talent = await prisma.talent.findUnique({
      where: { id: talentId },
      include: {
        type: true
      }
    });
    if (!talent) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y thi\xEAn ph\xFA"
      });
    }
    if (talent.requirements) {
      try {
        const requirements = JSON.parse(talent.requirements);
        const player = await prisma.player.findUnique({
          where: { id: playerId }
        });
        if (player && requirements.level && player.level < requirements.level) {
          throw createError({
            statusCode: 400,
            statusMessage: `C\u1EA7n c\u1EA5p ${requirements.level} \u0111\u1EC3 m\u1EDF kh\xF3a thi\xEAn ph\xFA n\xE0y`
          });
        }
        if (requirements.realm && player && player.realm !== requirements.realm) {
          throw createError({
            statusCode: 400,
            statusMessage: `C\u1EA7n c\u1EA3nh gi\u1EDBi ${requirements.realm} \u0111\u1EC3 m\u1EDF kh\xF3a thi\xEAn ph\xFA n\xE0y`
          });
        }
      } catch (e) {
        console.error("Error parsing talent requirements:", e);
      }
    }
    const existingTalent = await prisma.playerTalent.findUnique({
      where: {
        playerId_talentId: {
          playerId,
          talentId
        }
      }
    });
    if (existingTalent && existingTalent.isUnlocked) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u0110\xE3 m\u1EDF kh\xF3a thi\xEAn ph\xFA n\xE0y r\u1ED3i"
      });
    }
    if (talent.cost > 0) {
      const playerResource = await prisma.playerResource.findFirst({
        where: {
          playerId,
          resource: {
            name: "tien_ngoc"
            // Sử dụng Tiên Ngọc để mở khóa
          }
        }
      });
      if (!playerResource || Number(playerResource.amount) < talent.cost) {
        throw createError({
          statusCode: 400,
          statusMessage: `Kh\xF4ng \u0111\u1EE7 Ti\xEAn Ng\u1ECDc \u0111\u1EC3 m\u1EDF kh\xF3a (c\u1EA7n ${talent.cost})`
        });
      }
      await prisma.playerResource.update({
        where: { id: playerResource == null ? void 0 : playerResource.id },
        data: {
          amount: Number(playerResource.amount) - talent.cost
        }
      });
    }
    const playerTalent = await prisma.playerTalent.upsert({
      where: {
        playerId_talentId: {
          playerId,
          talentId
        }
      },
      update: {
        isUnlocked: true,
        unlockedAt: /* @__PURE__ */ new Date()
      },
      create: {
        playerId,
        talentId,
        isUnlocked: true,
        unlockedAt: /* @__PURE__ */ new Date()
      },
      include: {
        talent: {
          include: {
            type: true
          }
        }
      }
    });
    return {
      success: true,
      message: `\u0110\xE3 m\u1EDF kh\xF3a thi\xEAn ph\xFA ${talent.displayName}`,
      data: {
        ...playerTalent,
        talent: {
          ...playerTalent.talent,
          effects: playerTalent.talent.effects ? JSON.parse(playerTalent.talent.effects) : {},
          requirements: playerTalent.talent.requirements ? JSON.parse(playerTalent.talent.requirements) : {}
        }
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { unlock_post as default };
//# sourceMappingURL=unlock.post.mjs.map
