
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

// GET: Fetch single property
export async function GET(request, { params }) {
    try {
        const { id } = await params;
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
    let requestData;
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        requestData = await request.json();

        // Verify ownership
        const existingProperty = await prisma.property.findUnique({ where: { id } });
        if (!existingProperty) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        // Check ownership or admin
        if (existingProperty.agentId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Only include fields that exist in the model
        const cleanedData = {
            title: requestData.title || existingProperty.title,
            description: requestData.description || existingProperty.description,
            price: parseFloat(requestData.price) || existingProperty.price,
            location: requestData.location || existingProperty.location,
            address: requestData.address || existingProperty.address,
            type: requestData.type || existingProperty.type,
            status: requestData.status || existingProperty.status,
            beds: parseInt(requestData.beds) || 0,
            baths: parseInt(requestData.baths) || 0,
            area: parseFloat(requestData.area) || 0,
            additionalDetails: requestData.additionalDetails ?? existingProperty.additionalDetails,
        };

        // Handle JSON strings
        if (requestData.images) {
            cleanedData.images = JSON.stringify(Array.isArray(requestData.images) ? requestData.images : [requestData.images]);
        }
        if (requestData.features) {
            cleanedData.features = JSON.stringify(Array.isArray(requestData.features) ? requestData.features : [requestData.features]);
        }

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: cleanedData
        });

        return NextResponse.json({
            ...updatedProperty,
            images: JSON.parse(updatedProperty.images || "[]"),
            features: JSON.parse(updatedProperty.features || "[]")
        });

    } catch (error) {
        console.error("Critical API Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
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
