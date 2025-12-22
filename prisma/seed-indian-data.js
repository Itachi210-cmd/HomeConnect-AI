const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Indian Luxury Properties & Admin User...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Default Users
    const agent = await prisma.user.upsert({
        where: { email: 'agent@homeconnect.in' },
        update: { password: hashedPassword },
        create: {
            id: 'agent_default',
            name: 'Rajesh Khanna',
            email: 'agent@homeconnect.in',
            password: hashedPassword,
            role: 'AGENT',
            phone: '+91 98765 43210',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
        },
    });

    const buyer = await prisma.user.upsert({
        where: { email: 'buyer@homeconnect.in' },
        update: { password: hashedPassword },
        create: {
            id: 'buyer_default',
            name: 'Amit Sharma',
            email: 'buyer@homeconnect.in',
            password: hashedPassword,
            role: 'BUYER',
            phone: '+91 91234 56789',
        },
    });

    const admin = await prisma.user.upsert({
        where: { email: 'admin@homeconnect.in' },
        update: { password: hashedPassword },
        create: {
            id: 'admin_default',
            name: 'System Administrator',
            email: 'admin@homeconnect.in',
            password: hashedPassword,
            role: 'ADMIN',
            phone: '+91 00000 00000',
        },
    });

    console.log(`Users seeded: Agent, Buyer, and Admin (${admin.email})`);

    // 2. Create Indian Properties
    const properties = [
        {
            id: 'prop_mumbai_1',
            title: "Antilia View Penthouse",
            description: "A breathtaking penthouse overlooking the Mumbai skyline and the Arabian Sea. Features bespoke Italian marble, private infinity pool, and 24/7 concierge.",
            price: 450000000,
            location: "Altamount Road, Mumbai",
            address: "B-42, Altamount Luxury Towers, Mumbai 400026",
            type: "Penthouse",
            status: "For Sale",
            beds: 5,
            baths: 6,
            area: 8500,
            lat: 18.9680,
            lng: 72.8090,
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1600566753086-00f18fb6f3ea?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200"
            ]),
            features: JSON.stringify(["Infinity Pool", "Private Lift", "Helipad Access", "Sea View"]),
            agentId: agent.id
        },
        {
            id: 'prop_delhi_1',
            title: "Lutyens' Delhi Estate",
            description: "One of the most prestigious addresses in India. A sprawling colonial-style bungalow with 2 acres of manicured lawns and state-of-the-art security.",
            price: 1200000000,
            location: "Lutyens, Delhi",
            address: "12 Prithviraj Road, Lutyens Delhi 110011",
            type: "Bungalow",
            status: "For Sale",
            beds: 8,
            baths: 10,
            area: 25000,
            lat: 28.6000,
            lng: 77.2200,
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1577083165350-16c9f88b4a25?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1600566753004-7027969c54e1?auto=format&fit=crop&w=1200"
            ]),
            features: JSON.stringify(["2-Acre Lawn", "Heritage Site", "Ballroom", "Staff Quarters"]),
            agentId: agent.id
        },
        {
            id: 'prop_blr_1',
            title: "Silicon Valley Luxury Villa",
            description: "A modern smart-home villa in the heart of Bangalore's tech hub. Energy efficient, featuring a sound-proof home theater and a vertical garden.",
            price: 150000000,
            location: "Indiranagar, Bangalore",
            address: "1024 100ft Road, Indiranagar, Bangalore 560038",
            type: "Villa",
            status: "For Sale",
            beds: 4,
            baths: 4,
            area: 4200,
            lat: 12.9716,
            lng: 77.6412,
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200"
            ]),
            features: JSON.stringify(["Smart Home", "Vertical Garden", "Solar Powered", "Home Theater"]),
            agentId: agent.id
        },
        {
            id: 'prop_gurgaon_1',
            title: "Sky Mansion Premiere",
            description: "A ultra-luxury duplex in Gurgaon with private lift and 360-degree views of the city. Ultra-modern amenities and absolute privacy.",
            price: 320000000,
            location: "DLF Phase 5, Gurgaon",
            address: "Tower A, Sky Mansions, Gurgaon 122002",
            type: "Duplex",
            status: "For Sale",
            beds: 4,
            baths: 5,
            area: 6000,
            lat: 28.4595,
            lng: 77.0266,
            images: JSON.stringify([
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1600607687937-45a9285095ee?auto=format&fit=crop&w=1200",
                "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1200"
            ]),
            features: JSON.stringify(["Private Lift", "Sky Garden", "Valet Parking", "Clubhouse Access"]),
            agentId: agent.id
        }
    ];

    for (const p of properties) {
        await prisma.property.upsert({
            where: { id: p.id },
            update: p,
            create: p
        });
    }

    console.log('Seeding complete! Admin user is admin@homeconnect.in / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
