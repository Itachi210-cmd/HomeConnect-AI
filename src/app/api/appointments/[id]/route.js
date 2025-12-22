import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const { status } = await request.json();

        if (!id || !status) {
            return NextResponse.json({ error: "Missing appointment ID or status" }, { status: 400 });
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status },
            include: {
                property: { select: { title: true } },
                buyerId: true // This is already in the model, but let's ensure we have access to it or the relation
            }
        });

        // Notify Buyer
        await prisma.notification.create({
            data: {
                userId: appointment.buyerId,
                type: 'APPOINTMENT',
                title: `Appointment ${status === 'CONFIRMED' ? 'Confirmed' : 'Rejected'}`,
                message: `Your viewing request for ${appointment.property.title} has been ${status.toLowerCase()}.`,
                link: '/buyer/dashboard'
            }
        });

        return NextResponse.json(appointment);

    } catch (error) {
        console.error("Update Status Error:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
