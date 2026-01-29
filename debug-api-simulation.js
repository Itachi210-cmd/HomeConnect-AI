
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Get the first agent
    const agent = await prisma.user.findFirst({ where: { role: 'AGENT' } })
    if (!agent) {
        console.log("No agent found!")
        return
    }
    console.log(`Checking leads for Agent: ${agent.name} (${agent.id})`)

    // 2. Simulate the query logic from the API
    const agentProperties = await prisma.property.findMany({
        where: { agentId: agent.id },
        select: { id: true }
    });
    const propertyIds = agentProperties.map(p => p.id);

    const where = {
        OR: [
            { propertyId: { in: propertyIds } },
            { agentId: agent.id }
        ]
    };

    const leads = await prisma.lead.findMany({
        where,
        include: { property: { select: { title: true } } }
    });

    console.log(`Found ${leads.length} leads for this agent.`)
    leads.forEach(l => console.log(`- ${l.name} (${l.status}) [AgentID: ${l.agentId}]`))

    // 3. Check for ORPHAN leads (assigned to NO ONE)
    const orphanLeads = await prisma.lead.findMany({
        where: { agentId: null, propertyId: null }
    })
    console.log(`\nOrphan Leads (Hidden from specific agents): ${orphanLeads.length}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
