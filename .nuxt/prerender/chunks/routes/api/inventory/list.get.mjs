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
    const inventory = await prisma.inventory.findMany({
      where: { playerId },
      orderBy: [
        { itemType: "asc" },
        { name: "asc" }
      ]
    });
    const groupedInventory = inventory.reduce((acc, item) => {
      if (!acc[item.itemType]) {
        acc[item.itemType] = [];
      }
      acc[item.itemType].push(item);
      return acc;
    }, {});
    return {
      success: true,
      data: {
        inventory,
        grouped: groupedInventory
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { list_get as default };
//# sourceMappingURL=list.get.mjs.map
