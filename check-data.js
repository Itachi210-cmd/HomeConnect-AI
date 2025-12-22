require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
const pool = require('mariadb').createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3306,
    connectionLimit: 5,
    database: 'homeconnect'
})

const adapter = new PrismaMariaDb(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🔍 Checking Database Data...\n')

    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({ select: { id: true, name: true, role: true } })

    console.log(`👤 Total Users: ${userCount}`)
    console.table(users)

    const propertyCount = await prisma.property.count()
    const properties = await prisma.property.findMany({ select: { id: true, title: true, price: true } })

    console.log(`\n🏠 Total Properties: ${propertyCount}`)
    console.table(properties)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
