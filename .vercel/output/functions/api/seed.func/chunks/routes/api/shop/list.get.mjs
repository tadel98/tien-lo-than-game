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
