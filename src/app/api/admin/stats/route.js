import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [userCount, propertyCount, appointmentCount, leadCount] = await Promise.all([
            prisma.user.count(),
            prisma.property.count(),
            prisma.appointment.count(),
            prisma.lead.count()
        ]);

        // Get some recent activity
        const recentProperties = await prisma.property.findMany({
            take: 5,
            orderBy: { id: 'desc' }, // Assuming higher ID is newer or use createdAt if available
            include: { agent: { select: { name: true } } }
        });

        const recentAppointments = await prisma.appointment.findMany({
            take: 5,
            orderBy: { id: 'desc' },
            include: {
                property: { select: { title: true } },
                buyer: { select: { name: true } },
                agent: { select: { name: true } }
            }
        });

        return NextResponse.json({
            stats: {
                totalUsers: userCount,
                totalProperties: propertyCount,
                totalAppointments: appointmentCount,
                totalLeads: leadCount
            },
            recentProperties: recentProperties.map(p => ({
                ...p,
                images: p.images ? JSON.parse(p.images) : [],
                features: p.features ? JSON.parse(p.features) : []
            })),
            recentAppointments
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
