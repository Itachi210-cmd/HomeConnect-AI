import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const data = await request.json();
        const { date, propertyId, buyerId, agentId, notes } = data;

        if (!date || !propertyId || !buyerId || !agentId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const appointment = await prisma.appointment.create({
            data: {
                date: new Date(date),
                propertyId,
                buyerId,
                agentId,
                notes,
                status: 'PENDING'
            },
            include: {
                property: { select: { title: true } },
                buyer: { select: { name: true } }
            }
        });

        // Notify Agent
        await prisma.notification.create({
            data: {
                userId: agentId,
                type: 'APPOINTMENT',
                title: 'New Viewing Request',
                message: `${appointment.buyer.name} requested a viewing for ${appointment.property.title} on ${new Date(date).toLocaleDateString()}.`,
                link: '/agent/dashboard'
            }
        });

        return NextResponse.json(appointment);

    } catch (error) {
        console.error("Booking Error:", error);
        return NextResponse.json({
            error: "Failed to book appointment",
            details: error.message,
            code: error.code
        }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const role = searchParams.get('role'); // 'BUYER' or 'AGENT'

        if (!userId || !role) {
            return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
        }

        const where = role === 'AGENT' ? { agentId: userId } : { buyerId: userId };

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                property: {
                    select: { title: true, location: true, images: true, price: true }
                },
                buyer: {
                    select: { name: true, email: true, phone: true }
                },
                agent: {
                    select: { name: true, email: true, phone: true }
                }
            },
            orderBy: { date: 'asc' }
        });

        return NextResponse.json(appointments);

    } catch (error) {
        console.error("Fetch Appointments Error:", error);
        return NextResponse.json({
            error: "Failed to fetch appointments",
            details: error.message
        }, { status: 500 });
    }
}
