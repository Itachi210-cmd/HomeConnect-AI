import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
        }

        // Increment the view count
        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                views: {
                    increment: 1
                }
            },
            select: {
                id: true,
                views: true
            }
        });

        return NextResponse.json({
            success: true,
            views: updatedProperty.views
        });

    } catch (error) {
        console.error("Increment View Error:", error);
        return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 });
    }
}
