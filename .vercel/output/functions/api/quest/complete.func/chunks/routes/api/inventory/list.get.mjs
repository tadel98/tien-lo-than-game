import { PrismaClient } from '@prisma/client';
import { e as eventHandler, g as getQuery, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

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
