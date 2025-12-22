
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        console.log("Attempting DB connection...");
        // Try a simple query
        const userCount = await prisma.user.count();
        console.log("DB Connection Successful. User count:", userCount);
        return NextResponse.json({ status: 'ok', userCount });
    } catch (error) {
        console.error("DB Connection Failed:", error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            details: JSON.stringify(error, null, 2)
        }, { status: 500 });
    }
}
