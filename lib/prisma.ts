import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

console.log("Initializing Prisma Client... Env: " + process.env.NODE_ENV);

if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL is seemingly missing in this environment.");
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
