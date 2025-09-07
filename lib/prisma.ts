const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

let prisma: any

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma
} else {
  const { PrismaClient } = require('@prisma/client')
  prisma = new PrismaClient()
  globalForPrisma.prisma = prisma
}

export { prisma }
