
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- USERS ---')
    const users = await prisma.user.findMany({
        select: { id: true, name: true, role: true, email: true }
    })
    console.table(users)

    console.log('\n--- LEADS ---')
    const leads = await prisma.lead.findMany({
        select: { id: true, name: true, status: true, agentId: true, propertyId: true }
    })
    console.table(leads)

    console.log('\n--- PROPERTIES ---')
    const properties = await prisma.property.findMany({
        select: { id: true, title: true, agentId: true }
    })
    console.table(properties)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
