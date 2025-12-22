const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Seeding Connected Test Data (Buyer & Agent)...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Ensure Agent exists
    const agent = await prisma.user.upsert({
        where: { email: 'agent@homeconnect.in' },
        update: { password: hashedPassword },
        create: {
            id: 'agent_test_id',
            name: 'Rajesh Khanna',
            email: 'agent@homeconnect.in',
            password: hashedPassword,
            role: 'AGENT',
            phone: '+91 98765 43210',
        },
    });

    // 2. Ensure Buyer exists
    const buyer = await prisma.user.upsert({
        where: { email: 'buyer@homeconnect.in' },
        update: { password: hashedPassword },
        create: {
            id: 'buyer_test_id',
            name: 'Amit Sharma',
            email: 'buyer@homeconnect.in',
            password: hashedPassword,
            role: 'BUYER',
            phone: '+91 91234 56789',
        },
    });

    // 3. Create properties for the Agent if they don't exist
    const property = await prisma.property.upsert({
        where: { id: 'prop_test_1' },
        update: { agentId: agent.id },
        create: {
            id: 'prop_test_1',
            title: "Sea-Facing Luxury Apartment",
            description: "Modern luxury apartment with stunning sea views.",
            price: 55000000,
            location: "Worli, Mumbai",
            address: "Worli Sea Face, Mumbai 400018",
            type: "Apartment",
            status: "For Sale",
            beds: 3,
            baths: 3,
            area: 2200,
            images: JSON.stringify(["https://images.unsplash.com/photo-1545324418-f1d3ac597347"]),
            features: JSON.stringify(["Sea View", "Smart Home", "Gym"]),
            agentId: agent.id
        }
    });

    // 4. Create Leads (Buyer inquiring about Agent's property)
    await prisma.lead.createMany({
        data: [
            {
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
                message: "Hi, I am interested in the Sea-Facing Luxury Apartment. Can we connect?",
                status: "NEW",
                propertyId: property.id,
                agentId: agent.id,
                buyerId: buyer.id
            },
            {
                name: "Sneha Reddy",
                email: "sneha@example.com",
                phone: "+91 88888 77777",
                message: "I saw your listing on HomeConnect. Is it still available?",
                status: "FOLLOWUP",
                propertyId: property.id,
                agentId: agent.id
            }
        ]
    });

    // 5. Create Appointments
    await prisma.appointment.createMany({
        data: [
            {
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
                status: 'CONFIRMED',
                notes: 'Morning viewing at 10 AM.',
                propertyId: property.id,
                buyerId: buyer.id,
                agentId: agent.id
            },
            {
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
                status: 'PENDING',
                notes: 'Requested a weekend slot.',
                propertyId: property.id,
                buyerId: buyer.id,
                agentId: agent.id
            }
        ]
    });

    // 6. Create Messages (Thread between Buyer and Agent)
    await prisma.message.createMany({
        data: [
            {
                content: "Hello Rajesh, I'm interested in the Worli apartment.",
                senderId: buyer.id,
                receiverId: agent.id,
                propertyId: property.id,
            },
            {
                content: "Hello Amit! Sure, I'd be happy to show it to you. When are you free?",
                senderId: agent.id,
                receiverId: buyer.id,
                propertyId: property.id,
            },
            {
                content: "How about this Tuesday morning?",
                senderId: buyer.id,
                receiverId: agent.id,
                propertyId: property.id,
            }
        ]
    });

    console.log('\n✅ Connected Test Data Seeded!');
    console.log('------------------------------');
    console.log('Buyer Login: buyer@homeconnect.in / password123');
    console.log('Agent Login: agent@homeconnect.in / password123');
    console.log('------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
