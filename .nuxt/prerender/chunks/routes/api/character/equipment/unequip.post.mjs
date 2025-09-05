import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, readBody, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const unequip_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, equipmentId } = body;
    if (!playerId || !equipmentId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const updatedEquipment = await prisma.playerEquipment.updateMany({
      where: {
        playerId,
        equipmentId,
        isEquipped: true
      },
      data: { isEquipped: false }
    });
    if (updatedEquipment.count === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y trang b\u1ECB \u0111ang \u0111\u01B0\u1EE3c trang b\u1ECB"
      });
    }
    return {
      success: true,
      message: "\u0110\xE3 th\xE1o trang b\u1ECB",
      data: { count: updatedEquipment.count }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { unequip_post as default };
//# sourceMappingURL=unequip.post.mjs.map
