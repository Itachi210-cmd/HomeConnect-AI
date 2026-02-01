import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';

// GET: List all users
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // createdAt might not exist in your schema based on previous files, 
                // so we'll omit it for now or check schema.prisma if needed.
                // Assuming basic fields for now.
            },
            orderBy: { id: 'desc' }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH: Update user role
export async function PATCH(request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, role } = await request.json();

        if (!userId || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Optional: Prevent changing own role to avoid locking oneself out
        if (session.user.email === (await prisma.user.findUnique({ where: { id: userId } }))?.email) {
            // Allow it, but maybe warn? For now, we'll allow it.
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: role.toUpperCase() }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Update role error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
