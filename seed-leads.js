
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Leads for ALL Agents...')

    // Fetch ALL agents
    const agents = await prisma.user.findMany({
        where: { role: 'AGENT' }
    });

    if (agents.length === 0) {
        console.log("No agents found. Creating leads for all users instead.");
        const users = await prisma.user.findMany();
        if (users.length > 0) agents.push(...users);
    }

    console.log(`Found ${agents.length} agents/users to assign leads to.`);

    const sampleLeads = [
        {
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            phone: "+91 98765 43210",
            message: "Interested in the 3BHK Apartment in Juhu.",
            status: "New"
        },
        {
            name: "Priya Patel",
            email: "priya.p@example.com",
            phone: "+91 98765 43211",
            message: "Looking for a villa near Bangalore.",
            status: "New"
        },
        {
            name: "Amit Kumar",
            email: "amit.k@example.com",
            phone: "+91 98765 43212",
            message: "Can we schedule a visit next week?",
            status: "Contacted"
        },
        {
            name: "Sneha Reddy",
            email: "sneha.r@example.com",
            phone: "+91 98765 43213",
            message: "Pre-approved for loan, ready to buy.",
            status: "Qualified"
        },
        {
            name: "Vikram Singh",
            email: "vikram.s@example.com",
            phone: "+91 98765 43214",
            message: "Deal finalized for the Penthouse.",
            status: "Closed"
        }
    ];

    for (const agent of agents) {
        console.log(`\nAssigning leads to Agent: ${agent.name} (${agent.id})`);
        for (const leadData of sampleLeads) {
            // Check if lead already exists for this agent to avoid duplicates on re-run
            const exists = await prisma.lead.findFirst({
                where: {
                    email: leadData.email,
                    agentId: agent.id
                }
            });

            if (!exists) {
                const createdLead = await prisma.lead.create({
                    data: { ...leadData, agentId: agent.id }
                })
                console.log(`  -> Created: ${createdLead.name} [${createdLead.status}]`)
            } else {
                console.log(`  -> Skipped (Exists): ${leadData.name}`)
            }
        }
    }

    console.log('\n✅ Seeding completed for all agents.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
