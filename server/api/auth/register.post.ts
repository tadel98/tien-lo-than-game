import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError, getQuery, getRouterParam } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    console.log('Register API called with method:', event.method)
    
    const body = await readBody(event)
    console.log('Request body:', { username: body.username, email: body.email, playerName: body.playerName })
    
    const { username, email, password, playerName } = body

    // Validate input
    if (!username || !email || !password || !playerName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tên đăng nhập hoặc email đã tồn tại'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and player
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        player: {
          create: {
            name: playerName,
            level: 1,
            realm: 'Phàm cảnh',
            experience: 0
          }
        }
      },
      include: {
        player: true
      }
    })

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

    // Initialize player resources
    await initializePlayerResources(user.player!.id)

    return {
      success: true,
      message: 'Đăng ký thành công',
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
    console.error('Register error:', error)
    
    // Return error response instead of throwing
    return {
      success: false,
      error: error.message || 'Lỗi server',
      statusCode: error.statusCode || 500
    }
  }
})

async function initializePlayerResources(playerId: string) {
  // Get all resources
  const resources = await prisma.resource.findMany()
  
  // Create player resources
  const playerResources = resources.map(resource => ({
    playerId,
    resourceId: resource.id,
    amount: 0,
    locked: 0
  }))

  await prisma.playerResource.createMany({
    data: playerResources
  })
}
