
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Checking DB Data ---");

    const users = await prisma.user.findMany();
    console.log(`Users found: ${users.length}`);
    users.forEach(u => console.log(` - ${u.name} (${u.role}) ID: ${u.id}`));

    const properties = await prisma.property.findMany();
    console.log(`Properties found: ${properties.length}`);
    properties.forEach(p => console.log(` - ${p.title} ID: ${p.id}`));

    if (properties.length === 0 || users.length === 0) {
        console.log("!!! MISSING DATA !!!");
        console.log("We need at least 1 Agent, 1 Buyer, and 1 Property.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
