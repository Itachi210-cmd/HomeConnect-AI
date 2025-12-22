
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET: Fetch single property
export async function GET(request, { params }) {
    try {
        const id = params.id;
        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                agent: {
                    select: { name: true, email: true, image: true, phone: true }
                }
            }
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        const parsedProperty = {
            ...property,
            images: property.images ? JSON.parse(property.images) : [],
            features: property.features ? JSON.parse(property.features) : []
        };

        return NextResponse.json(parsedProperty);
    } catch (error) {
        console.error("Error fetching property:", error);
        return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
    }
}

// PUT: Update property
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = params.id;
        const data = await request.json();

        // Verify ownership
        const existingProperty = await prisma.property.findUnique({ where: { id } });
        if (!existingProperty) return NextResponse.json({ error: "Property not found" }, { status: 404 });

        // Check if user is the owner or an admin
        // Note: session.user.id provided by callbacks
        if (existingProperty.agentId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                price: parseFloat(data.price),
                location: data.location,
                address: data.address,
                type: data.type,
                status: data.status,
                beds: parseInt(data.beds),
                baths: parseInt(data.baths),
                area: parseFloat(data.area),
                images: JSON.stringify(data.images || []),
                features: JSON.stringify(data.features || []),
            }
        });

        return NextResponse.json({
            ...updatedProperty,
            images: JSON.parse(updatedProperty.images),
            features: JSON.parse(updatedProperty.features)
        });

    } catch (error) {
        console.error("Error updating property:", error);
        return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
    }
}

// DELETE: Delete property
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = params.id;

        // Verify ownership
        const existingProperty = await prisma.property.findUnique({ where: { id } });
        if (!existingProperty) return NextResponse.json({ error: "Property not found" }, { status: 404 });

        if (existingProperty.agentId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.property.delete({ where: { id } });

        return NextResponse.json({ message: "Property deleted successfully" });

    } catch (error) {
        console.error("Error deleting property:", error);
        return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
    }
}

// PATCH: Partial update (e.g., status toggle)
export async function PATCH(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const id = params.id;
        const body = await request.json();

        const existingProperty = await prisma.property.findUnique({ where: { id } });
        if (!existingProperty) return NextResponse.json({ error: "Property not found" }, { status: 404 });

        if (existingProperty.agentId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: body
        });

        return NextResponse.json(updatedProperty);
    } catch (error) {
        console.error("Error patching property:", error);
        return NextResponse.json({ error: "Failed to patch property" }, { status: 500 });
    }
}
