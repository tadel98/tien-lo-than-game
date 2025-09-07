const globalForPrisma = globalThis || {}

let prisma

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma
} else {
  // Use dynamic import to avoid esbuild @ symbol issues
  const prismaModule = require('@prisma/client')
  prisma = new prismaModule.PrismaClient()
  globalForPrisma.prisma = prisma
}

module.exports = { prisma }
