
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Fetch all leads (for logged-in agent/admin)
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { user } = session;

        // Optional: Filter leads by status
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const where = {};
        if (status) where.status = status;

        // If agent, only show leads assigned to them or generated from their properties
        // For now, simpler logic: Agents see all leads (or filter by their propertyId if we had that link fully established)
        // As per schema: Lead has `propertyId` and `agentId` (optional)

        if (user.role === 'AGENT') {
            // Show leads where this agent is assigned OR leads for properties owned by this agent
            // Since we don't have complex assignment yet, we will fetch leads for properties owned by this agent.

            // 1. Get properties owned by agent
            // const agentProperties = await prisma.property.findMany({ where: { agentId: user.id }, select: { id: true } });
            // const propertyIds = agentProperties.map(p => p.id);

            // where.propertyId = { in: propertyIds };

            // Simplified for Phase 2: Show ALL leads to any agent/admin for visibility, 
            // OR better: show leads specifically linked to agent.
            // Let's implement: Leads linked to properties owned by the agent.
            const agentProperties = await prisma.property.findMany({
                where: { agentId: user.id },
                select: { id: true }
            });
            const propertyIds = agentProperties.map(p => p.id);

            if (propertyIds.length > 0) {
                where.propertyId = { in: propertyIds };
            } else {
                // Agent has no properties, so no leads? 
                // Or maybe show global leads if they are unassigned?
                // Let's return empty for now to be safe.
                return NextResponse.json([]);
            }
        }

        const leads = await prisma.lead.findMany({
            where,
            include: {
                property: {
                    select: { title: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(leads);

    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}

// POST: Create a new lead (Public access - from Contact Form)
export async function POST(request) {
    try {
        const data = await request.json();

        // Basic Validation
        if (!data.name || !data.email || !data.phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if propertyId is provided (Inquiry from Property Page)
        // If not, it's a general contact form lead (Inquiry from Contact Page) - propertyId is optional in schema?
        // Let's check schema. leads table has `propertyId` as optional? 
        // Wait, let's proceed safely. If propertyId exists, link it.

        const newLead = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message || "I am interested in this property.",
                status: "NEW", // Default status
                propertyId: data.propertyId || null
            }
        });

        return NextResponse.json(newLead, { status: 201 });

    } catch (error) {
        console.error("Error creating lead:", error);
        return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
    }
}
