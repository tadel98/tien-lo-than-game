// Simple Prisma client for Vercel
let prisma

try {
  const { PrismaClient } = require('@prisma/client')
  prisma = new PrismaClient()
} catch (error) {
  console.error('Error creating Prisma client:', error)
  // Create a mock prisma for fallback
  prisma = {
    user: { findFirst: () => Promise.reject(new Error('Prisma not available')) },
    session: { create: () => Promise.reject(new Error('Prisma not available')) }
  }
}

module.exports = { prisma }
