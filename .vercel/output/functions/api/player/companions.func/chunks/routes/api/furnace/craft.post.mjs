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
const craft_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, recipeId, quantity = 1 } = body;
    if (!playerId || !recipeId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        inventory: true
      }
    });
    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId }
    });
    if (!recipe) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y c\xF4ng th\u1EE9c"
      });
    }
    const materials = JSON.parse(recipe.materials);
    const result = JSON.parse(recipe.result);
    for (const [materialName, requiredAmount] of Object.entries(materials)) {
      const totalRequired = Number(requiredAmount) * quantity;
      const inventoryItem = player.inventory.find((item) => item.name === materialName);
      if (!inventoryItem || inventoryItem.quantity < totalRequired) {
        throw createError({
          statusCode: 400,
          statusMessage: `Kh\xF4ng \u0111\u1EE7 nguy\xEAn li\u1EC7u: ${materialName} (c\u1EA7n ${totalRequired}, c\xF3 ${inventoryItem?.quantity || 0})`
        });
      }
    }
    const craftResult = await prisma.$transaction(async (tx) => {
      for (const [materialName, requiredAmount] of Object.entries(materials)) {
        const totalRequired = Number(requiredAmount) * quantity;
        const inventoryItem = player.inventory.find((item) => item.name === materialName);
        await tx.inventory.update({
          where: { id: inventoryItem.id },
          data: {
            quantity: inventoryItem.quantity - totalRequired
          }
        });
      }
      for (const [resultName, resultAmount] of Object.entries(result)) {
        const totalResult = Number(resultAmount) * quantity;
        const existingItem = player.inventory.find((item) => item.name === resultName);
        if (existingItem) {
          await tx.inventory.update({
            where: { id: existingItem.id },
            data: {
              quantity: existingItem.quantity + totalResult
            }
          });
        } else {
          await tx.inventory.create({
            data: {
              playerId,
              name: resultName,
              quantity: totalResult,
              type: "crafted"
            }
          });
        }
      }
      await tx.craftingHistory.create({
        data: {
          playerId,
          recipeId,
          quantity,
          materials: JSON.stringify(materials),
          result: JSON.stringify(result),
          createdAt: /* @__PURE__ */ new Date()
        }
      });
      return {
        success: true,
        message: "Ch\u1EBF t\u1EA1o th\xE0nh c\xF4ng",
        materials,
        result,
        quantity
      };
    });
    return craftResult;
  } catch (error) {
    console.error("Craft error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i ch\u1EBF t\u1EA1o"
    });
  }
});

export { craft_post as default };
//# sourceMappingURL=craft.post.mjs.map
