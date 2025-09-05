import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
const login_post = eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, password } = body;
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu t\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\u1EADt kh\u1EA9u"
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      },
      include: {
        player: true
      }
    });
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "T\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng"
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: "T\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng"
      });
    }
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
    return {
      success: true,
      message: "\u0110\u0103ng nh\u1EADp th\xE0nh c\xF4ng",
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

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
