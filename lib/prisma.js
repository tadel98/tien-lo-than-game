const globalForPrisma = global || globalThis || {}

let prisma

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma
} else {
  try {
    // Use dynamic import to avoid esbuild @ symbol issues
    const prismaModule = require('@prisma/client')
    prisma = new prismaModule.PrismaClient()
    globalForPrisma.prisma = prisma
  } catch (error) {
    console.error('Error creating Prisma client:', error)
    // Fallback: create new instance
    const prismaModule = require('@prisma/client')
    prisma = new prismaModule.PrismaClient()
  }
}

module.exports = { prisma }
