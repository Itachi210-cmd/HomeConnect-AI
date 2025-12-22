import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // 1. User Growth (Daily for last 7 days)
        const users = await prisma.user.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true, role: true }
        });

        const labels = [];
        const buyerData = [];
        const agentData = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
            labels.push(dateStr);

            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));

            const buyers = users.filter(u =>
                new Date(u.createdAt) >= dayStart &&
                new Date(u.createdAt) <= dayEnd &&
                (u.role === 'BUYER' || u.role === 'buyer')
            ).length;

            const agents = users.filter(u =>
                new Date(u.createdAt) >= dayStart &&
                new Date(u.createdAt) <= dayEnd &&
                (u.role === 'AGENT' || u.role === 'agent')
            ).length;

            buyerData.push(buyers);
            agentData.push(agents);
        }

        // 2. Property Distribution by Location
        const propertyLocations = await prisma.property.groupBy({
            by: ['location'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        });

        const locationLabels = propertyLocations.map(l => l.location);
        const locationCounts = propertyLocations.map(l => l._count.id);

        // 3. Price Range Distribution
        const allProperties = await prisma.property.findMany({
            select: { price: true }
        });

        const priceRanges = {
            '< 50L': 0,
            '50L - 1Cr': 0,
            '1Cr - 3Cr': 0,
            '3Cr+': 0
        };

        allProperties.forEach(p => {
            if (p.price < 5000000) priceRanges['< 50L']++;
            else if (p.price < 10000000) priceRanges['50L - 1Cr']++;
            else if (p.price < 30000000) priceRanges['1Cr - 3Cr']++;
            else priceRanges['3Cr+']++;
        });

        // 4. Most Viewed Properties (Mocking view count as we don't have it in schema yet, or using ID as proxy)
        const mostViewed = await prisma.property.findMany({
            take: 3,
            orderBy: { id: 'desc' },
            include: { agent: { select: { name: true } } }
        });

        return NextResponse.json({
            growth: {
                labels,
                buyerData,
                agentData
            },
            locations: {
                labels: locationLabels,
                counts: locationCounts
            },
            priceDistribution: {
                labels: Object.keys(priceRanges),
                data: Object.values(priceRanges)
            },
            mostViewed: mostViewed.map(p => ({
                id: p.id,
                title: p.title,
                location: p.location,
                views: Math.floor(Math.random() * 2000) + 500, // Mocked for now
                image: p.images ? JSON.parse(p.images)[0] : "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
            }))
        });
    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
