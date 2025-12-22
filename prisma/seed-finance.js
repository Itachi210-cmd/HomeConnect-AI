const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Finance & Analytics data...');

    // 1. Get some existing users and properties
    const users = await prisma.user.findMany({ take: 10 });
    const properties = await prisma.property.findMany({ take: 5 });

    if (users.length === 0 || properties.length === 0) {
        console.log('❌ No users or properties found. Please seed basic data first.');
        return;
    }

    // 2. Create Payments
    const paymentTypes = ['SUBSCRIPTION', 'COMMISSION'];
    const statuses = ['COMPLETED', 'PENDING'];

    console.log('Creating payments...');
    for (let i = 0; i < 20; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const prop = properties[Math.floor(Math.random() * properties.length)];
        const type = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];

        await prisma.payment.create({
            data: {
                amount: type === 'SUBSCRIPTION' ? Math.floor(Math.random() * 5000) + 999 : Math.floor(Math.random() * 500000) + 50000,
                type,
                status: statuses[0],
                userId: user.id,
                propertyId: type === 'COMMISSION' ? prop.id : null,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) // Last 30 days
            }
        });
    }

    // 3. Update User createdAt dates for growth trends (SQLite doesn't support mass update well, so we do it individually)
    console.log('Updating user signup dates for trends...');
    for (const user of users) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
            }
        });
    }

    console.log('✅ Finance seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
