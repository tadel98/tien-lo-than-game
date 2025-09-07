import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const { prisma } = require('../../../lib/prisma')
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

export default eventHandler(async (event) => {
  try {
    console.log('Login API called with method:', event.method)
    
    const body = await readBody(event)
    console.log('Login request body:', { username: body.username })
    
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu tên đăng nhập hoặc mật khẩu'
      })
    }

    // Find user
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
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Tên đăng nhập hoặc mật khẩu không đúng'
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Tên đăng nhập hoặc mật khẩu không đúng'
      })
    }

    // Create session token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    return {
      success: true,
      message: 'Đăng nhập thành công',
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
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Return error response instead of throwing
    return {
      success: false,
      error: error.message || 'Lỗi server',
      statusCode: error.statusCode || 500
    }
  }
})
