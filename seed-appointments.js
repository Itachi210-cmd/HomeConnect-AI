
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking for appointments...");
    const appointments = await prisma.appointment.findMany();
    console.log(`Found ${appointments.length} appointments.`);

    if (appointments.length === 0) {
        console.log("Seeding test appointment...");

        // Ensure agent exists
        let agent = await prisma.user.findFirst({ where: { id: 'agent_default' } });
        if (!agent) {
            agent = await prisma.user.create({
                data: {
                    id: 'agent_default',
                    name: 'Default Agent',
                    email: 'agent@homeconnect.in',
                    role: 'AGENT'
                }
            });
            console.log("Created default agent.");
        }

        // Ensure buyer exists
        let buyer = await prisma.user.findFirst({ where: { id: 'user_2pXyZ123' } });
        if (!buyer) {
            buyer = await prisma.user.create({
                data: {
                    id: 'user_2pXyZ123',
                    name: 'Test Buyer',
                    email: 'buyer@test.com',
                    role: 'BUYER'
                }
            });
            console.log("Created test buyer.");
        }

        // Ensure property exists
        let property = await prisma.property.findFirst();
        if (!property) {
            property = await prisma.property.create({
                data: {
                    title: "Test Property",
                    description: "A test property",
                    price: 10000000,
                    location: "Mumbai",
                    type: "Apartment",
                    status: "For Sale",
                    beds: 2,
                    baths: 2,
                    area: 1200,
                    agentId: agent.id
                }
            });
            console.log("Created test property.");
        }

        // Create Appointment
        await prisma.appointment.create({
            data: {
                date: new Date(),
                propertyId: property.id,
                buyerId: buyer.id,
                agentId: agent.id,
                notes: "Please show me the property immediately.",
                status: "PENDING"
            }
        });
        console.log("Seeded pending appointment.");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
