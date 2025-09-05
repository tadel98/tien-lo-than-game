import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, readBody, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const toggle_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, talentId, isActive } = body;
    if (!playerId || !talentId || typeof isActive !== "boolean") {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const playerTalent = await prisma.playerTalent.findUnique({
      where: {
        playerId_talentId: {
          playerId,
          talentId
        }
      }
    });
    if (!playerTalent || !playerTalent.isUnlocked) {
      throw createError({
        statusCode: 404,
        statusMessage: "Thi\xEAn ph\xFA ch\u01B0a \u0111\u01B0\u1EE3c m\u1EDF kh\xF3a"
      });
    }
    const updatedPlayerTalent = await prisma.playerTalent.update({
      where: { id: playerTalent == null ? void 0 : playerTalent.id },
      data: { isActive },
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
      message: `${isActive ? "K\xEDch ho\u1EA1t" : "T\u1EAFt"} thi\xEAn ph\xFA ${updatedPlayerTalent.talent.displayName}`,
      data: {
        ...updatedPlayerTalent,
        talent: {
          ...updatedPlayerTalent.talent,
          effects: updatedPlayerTalent.talent.effects ? JSON.parse(updatedPlayerTalent.talent.effects) : {},
          requirements: updatedPlayerTalent.talent.requirements ? JSON.parse(updatedPlayerTalent.talent.requirements) : {}
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

export { toggle_post as default };
//# sourceMappingURL=toggle.post.mjs.map
