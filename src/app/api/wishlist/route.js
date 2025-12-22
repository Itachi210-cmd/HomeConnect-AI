import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Fetch user's wishlist
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || "buyer_default"; // Fallback for demo

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                savedProperties: {
                    include: {
                        agent: { select: { name: true, image: true } }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Parse images and features if they are strings
        const parsedProperties = user.savedProperties.map(prop => ({
            ...prop,
            images: prop.images ? JSON.parse(prop.images) : [],
            features: prop.features ? JSON.parse(prop.features) : []
        }));

        return NextResponse.json(parsedProperties);

    } catch (error) {
        console.error("Wishlist GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
    }
}

// POST: Toggle property in wishlist
export async function POST(request) {
    try {
        const { propertyId, userId = "buyer_default" } = await request.json();

        if (!propertyId) {
            return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
        }

        // Check if already in wishlist
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { savedProperties: { select: { id: true } } }
        });

        const isSaved = user.savedProperties.some(p => p.id === propertyId);

        let updatedUser;
        if (isSaved) {
            // Remove
            updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    savedProperties: {
                        disconnect: { id: propertyId }
                    }
                }
            });
        } else {
            // Add
            updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    savedProperties: {
                        connect: { id: propertyId }
                    }
                }
            });
        }

        return NextResponse.json({
            saved: !isSaved,
            message: isSaved ? "Removed from wishlist" : "Added to wishlist"
        });

    } catch (error) {
        console.error("Wishlist POST Error:", error);
        return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
    }
}
