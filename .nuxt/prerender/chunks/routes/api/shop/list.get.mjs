import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, getQuery, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const list_get = eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const category = query.category;
    const shops = await prisma.shop.findMany({
      where: {
        isActive: true,
        ...category && { category }
      },
      include: {
        items: {
          where: {
            isActive: true
          },
          orderBy: {
            level: "asc"
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });
    return {
      success: true,
      data: shops
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
