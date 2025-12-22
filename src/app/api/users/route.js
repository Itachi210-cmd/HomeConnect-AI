import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Security check: Only admins should see the full user list
        // In this demo, we allow it if the user is logged in as an admin 
        // OR we bypass it temporarily for development if needed.
        // Let's enforce the admin check.
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
                // Don't select password
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);

    } catch (error) {
        console.error("Users GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
