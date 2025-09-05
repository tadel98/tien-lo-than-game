import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, readBody, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const purchase_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { playerId, shopId, itemId, quantity = 1 } = body;
    if (!playerId || !shopId || !itemId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
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
    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const shopItem = await prisma.shopItem.findFirst({
      where: {
        id: itemId,
        shopId,
        isActive: true
      },
      include: {
        shop: true
      }
    });
    if (!shopItem) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y item trong c\u1EEDa h\xE0ng"
      });
    }
    if (player.level < shopItem.level) {
      throw createError({
        statusCode: 400,
        statusMessage: `C\u1EA7n c\u1EA5p \u0111\u1ED9 ${shopItem.level} \u0111\u1EC3 mua item n\xE0y`
      });
    }
    if (shopItem.stock !== -1 && shopItem.stock < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: "Kh\xF4ng \u0111\u1EE7 h\xE0ng trong kho"
      });
    }
    const totalCost = shopItem.price * quantity;
    const currencyResource = player.resources.find((r) => r.resource.name === shopItem.currency);
    if (!currencyResource || Number(currencyResource.amount) < totalCost) {
      throw createError({
        statusCode: 400,
        statusMessage: `Kh\xF4ng \u0111\u1EE7 ${shopItem.currency} \u0111\u1EC3 mua`
      });
    }
    await prisma.$transaction(async (tx) => {
      await tx.playerResource.update({
        where: { id: currencyResource == null ? void 0 : currencyResource.id },
        data: {
          amount: Number(currencyResource.amount) - totalCost
        }
      });
      if (shopItem.stock !== -1) {
        await tx.shopItem.update({
          where: { id: shopItem == null ? void 0 : shopItem.id },
          data: {
            stock: shopItem.stock - quantity
          }
        });
      }
      const existingItem = await tx.inventory.findFirst({
        where: {
          playerId,
          itemId: shopItem.itemId
        }
      });
      if (existingItem && shopItem.stackable) {
        await tx.inventory.update({
          where: { id: existingItem == null ? void 0 : existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity
          }
        });
      } else {
        await tx.inventory.create({
          data: {
            playerId,
            itemType: shopItem.itemType,
            itemId: shopItem.itemId,
            name: shopItem.name,
            quantity,
            stackable: shopItem.stackable
          }
        });
      }
      await tx.purchaseHistory.create({
        data: {
          playerId,
          shopId,
          itemId: shopItem == null ? void 0 : shopItem.id,
          itemName: shopItem.displayName,
          quantity,
          price: shopItem.price,
          currency: shopItem.currency,
          totalCost
        }
      });
    });
    return {
      success: true,
      message: "Mua h\xE0ng th\xE0nh c\xF4ng",
      data: {
        item: shopItem.displayName,
        quantity,
        totalCost,
        currency: shopItem.currency
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { purchase_post as default };
//# sourceMappingURL=purchase.post.mjs.map
