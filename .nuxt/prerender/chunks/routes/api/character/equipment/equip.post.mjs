import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, readBody, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const equip_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, equipmentId } = body;
    if (!playerId || !equipmentId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const playerEquipment = await prisma.playerEquipment.findFirst({
      where: {
        playerId,
        equipmentId
      },
      include: {
        equipment: {
          include: {
            type: true
          }
        }
      }
    });
    if (!playerEquipment) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y trang b\u1ECB"
      });
    }
    if (playerEquipment.equipment.requirements) {
      try {
        const requirements = JSON.parse(playerEquipment.equipment.requirements);
        const player = await prisma.player.findUnique({
          where: { id: playerId }
        });
        if (player && requirements.level && player.level < requirements.level) {
          throw createError({
            statusCode: 400,
            statusMessage: `C\u1EA7n c\u1EA5p ${requirements.level} \u0111\u1EC3 trang b\u1ECB`
          });
        }
      } catch (e) {
        console.error("Error parsing equipment requirements:", e);
      }
    }
    const currentEquipped = await prisma.playerEquipment.findFirst({
      where: {
        playerId,
        isEquipped: true,
        equipment: {
          type: {
            slot: playerEquipment.equipment.type.slot
          }
        }
      }
    });
    if (currentEquipped) {
      await prisma.playerEquipment.update({
        where: { id: currentEquipped == null ? void 0 : currentEquipped.id },
        data: { isEquipped: false }
      });
    }
    const updatedEquipment = await prisma.playerEquipment.update({
      where: { id: playerEquipment == null ? void 0 : playerEquipment.id },
      data: { isEquipped: true }
    });
    return {
      success: true,
      message: `\u0110\xE3 trang b\u1ECB ${playerEquipment.equipment.displayName}`,
      data: updatedEquipment
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { equip_post as default };
//# sourceMappingURL=equip.post.mjs.map
