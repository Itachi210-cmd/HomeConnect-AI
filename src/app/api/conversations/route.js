
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get all messages where user is either sender or receiver
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUser.id },
                    { receiverId: currentUser.id }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, name: true, image: true, role: true } },
                receiver: { select: { id: true, name: true, image: true, role: true } }
            }
        });

        // Group by user
        const conversations = [];
        const seenUsers = new Set();

        messages.forEach(msg => {
            const otherUser = msg.senderId === currentUser.id ? msg.receiver : msg.sender;
            if (!seenUsers.has(otherUser.id)) {
                seenUsers.add(otherUser.id);
                conversations.push({
                    user: otherUser,
                    lastMessage: msg.content,
                    lastMessageDate: msg.createdAt,
                    unreadCount: 0 // Placeholder
                });
            }
        });

        return NextResponse.json(conversations);

    } catch (error) {
        console.error("Fetch Conversations Error:", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}
