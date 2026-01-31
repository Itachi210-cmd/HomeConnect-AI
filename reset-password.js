
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]
    const newPassword = process.argv[3] || 'admin123'

    if (!email) {
        console.error('Please provide an email address: node reset-password.js <email> [newPassword]')
        process.exit(1)
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const user = await prisma.user.update({
            where: { email: email },
            data: { password: hashedPassword },
        })
        console.log(`Success! Password for ${user.email} has been reset to: ${newPassword}`)
    } catch (error) {
        console.error(`Error: User with email ${email} not found or database error.`)
        console.error(error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
