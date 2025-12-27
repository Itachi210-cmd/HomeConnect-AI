
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

// PUT: Update Lead Status
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await request.json();

        // Verify lead exists
        const existingLead = await prisma.lead.findUnique({ where: { id } });
        if (!existingLead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

        // Update
        const updatedLead = await prisma.lead.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message,
                status: data.status
            }
        });

        return NextResponse.json(updatedLead);

    } catch (error) {
        console.error("Error updating lead:", error);
        return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
    }
}

// DELETE: Remove Lead
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = params.id;

        await prisma.lead.delete({ where: { id } });

        return NextResponse.json({ message: "Lead deleted successfully" });

    } catch (error) {
        console.error("Error deleting lead:", error);
        return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
    }
}
