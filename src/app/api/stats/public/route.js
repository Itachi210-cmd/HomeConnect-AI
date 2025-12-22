import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const propertyCount = await prisma.property.count();
        const userCount = await prisma.user.count({
            where: { role: 'BUYER' }
        });

        // Get unique cities
        const properties = await prisma.property.findMany({
            select: { location: true }
        });

        const cities = new Set();
        properties.forEach(p => {
            const city = p.location.split(',').pop().trim();
            cities.add(city);
        });

        return NextResponse.json({
            propertiesSold: Math.floor(propertyCount * 0.4) + 120, // Proxy for sold properties
            activeListings: propertyCount,
            citiesCovered: cities.size,
            happyClients: userCount + 500
        });
    } catch (error) {
        console.error("Public Stats API Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
