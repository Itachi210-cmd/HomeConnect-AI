import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

// GET: Fetch all properties
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filters = {};

        // Basic filtering support (can be expanded)
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const agentId = searchParams.get('agentId');

        if (type) filters.type = type;
        if (status) filters.status = status;
        if (agentId) filters.agentId = agentId;

        const properties = await prisma.property.findMany({
            where: filters,
            include: {
                agent: {
                    select: { name: true, email: true, image: true, phone: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON strings back to arrays
        const parsedProperties = properties.map(prop => ({
            ...prop,
            images: prop.images ? JSON.parse(prop.images) : [],
            features: prop.features ? JSON.parse(prop.features) : []
        }));

        return NextResponse.json(parsedProperties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
    }
}

// POST: Create a new property
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Agents and Admins can create properties
        if (session.user.role !== 'AGENT' && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden: Agents only" }, { status: 403 });
        }

        const data = await request.json();

        // Find the user's DB ID based on session email (safer)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const newProperty = await prisma.property.create({
            data: {
                title: data.title,
                description: data.description,
                price: parseFloat(data.price), // Ensure number
                location: data.location,
                address: data.address,
                type: data.type,
                status: data.status,
                beds: parseInt(data.beds) || 0,
                baths: parseInt(data.baths) || 0,
                area: parseFloat(data.area) || 0,
                images: JSON.stringify(data.images || []),
                features: JSON.stringify(data.features || []),
                additionalDetails: data.additionalDetails || "",
                agentId: user.id
            }
        });

        return NextResponse.json({
            ...newProperty,
            images: JSON.parse(newProperty.images),
            features: JSON.parse(newProperty.features)
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
    }
}
