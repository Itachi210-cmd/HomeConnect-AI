const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Create Agents
    const agent1 = await prisma.user.upsert({
        where: { email: 'rajesh.k@homeconnect.in' },
        update: {},
        create: {
            name: 'Rajesh Khanna',
            email: 'rajesh.k@homeconnect.in',
            role: 'AGENT',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
    })

    // 2. Create Buyer
    const buyer1 = await prisma.user.upsert({
        where: { email: 'amit.buyer@example.com' },
        update: {},
        create: {
            name: 'Amit Buyer',
            email: 'amit.buyer@example.com',
            role: 'BUYER',
        },
    })

    // 3. Create Properties
    await prisma.property.create({
        data: {
            title: 'Luxury Sea View Apartment',
            description: 'A stunning 3BHK apartment with a direct view of the Arabian Sea.',
            price: 25000000,
            location: 'Juhu, Mumbai',
            type: 'Apartment',
            status: 'For Sale',
            beds: 3,
            baths: 3,
            area: 1800,
            agentId: agent1.id,
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]),
            features: JSON.stringify(["Sea View", "Gym", "Pool", "Parking"])
        },
    })

    console.log('✅ Seeding finished.')
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
