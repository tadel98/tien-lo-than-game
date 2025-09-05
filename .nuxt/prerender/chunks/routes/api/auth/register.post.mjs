import bcrypt from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/bcryptjs/index.js';
import jwt from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/jsonwebtoken/index.js';
import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, readBody, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const register_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, email, password, playerName } = body;
    if (!username || !email || !password || !playerName) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c"
      });
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: "T\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c email \u0111\xE3 t\u1ED3n t\u1EA1i"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        player: {
          create: {
            name: playerName,
            level: 1,
            realm: "Ph\xE0m c\u1EA3nh",
            experience: 0
          }
        }
      },
      include: {
        player: true
      }
    });
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)
        // 7 days
      }
    });
    await initializePlayerResources(user.player.id);
    return {
      success: true,
      message: "\u0110\u0103ng k\xFD th\xE0nh c\xF4ng",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        player: user.player ? {
          ...user.player,
          experience: user.player.experience.toString()
        } : null
      },
      token
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});
async function initializePlayerResources(playerId) {
  const resources = await prisma.resource.findMany();
  const playerResources = resources.map((resource) => ({
    playerId,
    resourceId: resource.id,
    amount: 0,
    locked: 0
  }));
  await prisma.playerResource.createMany({
    data: playerResources
  });
}

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
