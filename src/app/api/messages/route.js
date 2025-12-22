
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const otherUserId = searchParams.get('userId'); // The person we are chatting with

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get the current user's DB ID
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!otherUserId) {
            // If no user specified, return all messages for this user grouped by conversation?
            // Actually, let's just return all messages for now to keep it simple
            // In a real app, you'd want /api/conversations
            return NextResponse.json({ error: "userId parameter required" }, { status: 400 });
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUser.id, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUser.id }
                ]
            },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { name: true, image: true } },
                property: { select: { title: true } }
            }
        });

        return NextResponse.json(messages);

    } catch (error) {
        console.error("Fetch Messages Error:", error);
        return NextResponse.json({ error: "Failed to fetch messages", details: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const { content, receiverId, propertyId } = data;

        if (!content || !receiverId) {
            return NextResponse.json({ error: "Missing content or receiverId" }, { status: 400 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: currentUser.id,
                receiverId,
                propertyId: propertyId || null,
                isRead: false
            },
            include: {
                sender: { select: { name: true } }
            }
        });

        // Create notification for receiver
        await prisma.notification.create({
            data: {
                userId: receiverId,
                type: 'MESSAGE',
                title: 'New Message',
                message: `${currentUser.name} sent you a message: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
                link: '/messages'
            }
        });

        return NextResponse.json(message, { status: 201 });

    } catch (error) {
        console.error("Send Message Error:", error);
        return NextResponse.json({ error: "Failed to send message", details: error.message }, { status: 500 });
    }
}
