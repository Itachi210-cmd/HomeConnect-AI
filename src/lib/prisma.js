
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: ['error', 'warn'],
    })
}

const globalForPrisma = global

const prisma = globalForPrisma.prisma || prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
