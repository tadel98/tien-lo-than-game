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
const upgrade_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, talentId } = body;
    if (!playerId || !talentId) {
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
      },
      include: {
        talent: true
      }
    });
    if (!playerTalent || !playerTalent.isUnlocked) {
      throw createError({
        statusCode: 404,
        statusMessage: "Thi\xEAn ph\xFA ch\u01B0a \u0111\u01B0\u1EE3c m\u1EDF kh\xF3a"
      });
    }
    if (playerTalent.level >= playerTalent.talent.maxLevel) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\xEAn ph\xFA \u0111\xE3 \u0111\u1EA1t c\u1EA5p t\u1ED1i \u0111a"
      });
    }
    const upgradeCost = playerTalent.talent.cost * playerTalent.level;
    if (upgradeCost > 0) {
      const playerResource = await prisma.playerResource.findFirst({
        where: {
          playerId,
          resource: {
            name: "tien_ngoc"
          }
        }
      });
      if (!playerResource || Number(playerResource.amount) < upgradeCost) {
        throw createError({
          statusCode: 400,
          statusMessage: `Kh\xF4ng \u0111\u1EE7 Ti\xEAn Ng\u1ECDc \u0111\u1EC3 n\xE2ng c\u1EA5p (c\u1EA7n ${upgradeCost})`
        });
      }
      await prisma.playerResource.update({
        where: { id: playerResource?.id },
        data: {
          amount: Number(playerResource.amount) - upgradeCost
        }
      });
    }
    const updatedPlayerTalent = await prisma.playerTalent.update({
      where: { id: playerTalent?.id },
      data: {
        level: playerTalent.level + 1
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
      message: `\u0110\xE3 n\xE2ng c\u1EA5p ${updatedPlayerTalent.talent.displayName} l\xEAn c\u1EA5p ${updatedPlayerTalent.level}`,
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

export { upgrade_post as default };
//# sourceMappingURL=upgrade.post.mjs.map
