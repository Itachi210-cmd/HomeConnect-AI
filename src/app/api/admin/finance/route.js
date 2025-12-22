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
        // Attempt to fetch real payments. If model doesn't exist yet, we'll return empty/mock.
        let payments = [];
        try {
            payments = await prisma.payment.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, email: true } }
                }
            });
        } catch (e) {
            console.warn("Payment model not accessible yet. Returning empty list.");
        }

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
        const subscriptionRevenue = payments
            .filter(p => p.type === 'SUBSCRIPTION')
            .reduce((sum, p) => sum + p.amount, 0);
        const commissionRevenue = payments
            .filter(p => p.type === 'COMMISSION')
            .reduce((sum, p) => sum + p.amount, 0);

        return NextResponse.json({
            stats: {
                totalRevenue,
                subscriptionRevenue,
                commissionRevenue,
                growth: 12 // Placeholder for now
            },
            transactions: payments.map(p => ({
                id: p.id,
                user: p.user?.name || "Unknown",
                email: p.user?.email || "",
                amount: p.amount,
                type: p.type,
                status: p.status,
                date: p.createdAt
            }))
        });
    } catch (error) {
        console.error("Finance API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
