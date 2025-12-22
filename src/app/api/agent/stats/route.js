import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const agentId = searchParams.get('agentId');

        if (!agentId) {
            return NextResponse.json({ error: "Missing agentId" }, { status: 400 });
        }

        // 1. Total Properties
        const totalProperties = await prisma.property.count({
            where: { agentId }
        });

        // 2. Active Appointments
        const activeAppointments = await prisma.appointment.count({
            where: {
                agentId,
                status: 'PENDING'
            }
        });

        // 3. Closed/Completed Deals (Mocked as COMPLETED appointments)
        const closedDeals = await prisma.appointment.count({
            where: {
                agentId,
                status: 'COMPLETED'
            }
        });

        // 4. Total Leads
        const totalLeads = await prisma.lead.count({
            where: { agentId }
        });

        // 5. Recent Leads for the list
        const recentLeads = await prisma.lead.findMany({
            where: { agentId },
            take: 4,
            orderBy: { createdAt: 'desc' },
            include: {
                property: { select: { title: true } }
            }
        });

        // 6. Listing Performance (Views vs Leads per property)
        const listingPerformance = await prisma.property.findMany({
            where: { agentId },
            select: {
                id: true,
                title: true,
                views: true,
                _count: {
                    select: { leads: true }
                }
            },
            orderBy: { views: 'desc' },
            take: 5
        });

        return NextResponse.json({
            stats: [
                { label: 'My Listings', value: totalProperties.toString(), icon: 'home' },
                { label: 'Pending Visits', value: activeAppointments.toString(), icon: 'calendar' },
                { label: 'Closed Deals', value: closedDeals.toString(), icon: 'check' },
                { label: 'Total Leads', value: totalLeads.toString(), icon: 'users' },
            ],
            recentLeads,
            performance: listingPerformance.map(p => ({
                id: p.id,
                title: p.title,
                views: p.views,
                leads: p._count.leads,
                conversion: p.views > 0 ? ((p._count.leads / p.views) * 100).toFixed(1) : 0
            }))
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
    }
}
