import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();

    // 1. Create a Default Agent
    const agentEmail = "rajesh.k@homeconnect.in";
    let agent = await User.findOne({ email: agentEmail });

    if (!agent) {
        agent = await User.create({
            name: "Rajesh Khanna",
            email: agentEmail,
            password: "password123", // In a real app, hash this!
            role: "agent",
            phone: "+91 98765 43210",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        });
        console.log("Agent Created:", agent);
    }

    // 2. Create Initial Properties
    const count = await Property.countDocuments();
    if (count === 0) {
        const properties = [
            {
                title: "Luxury Villa with Pool",
                price: "₹12.5 Cr",
                location: "Juhu, Mumbai",
                description: "Experience the epitome of luxury in this stunning Juhu villa. Featuring 5 spacious bedrooms, a private pool, and direct beach access.",
                beds: 5,
                baths: 4,
                area: "4,500 sqft",
                type: "Villa",
                address: "123 Juhu Tara Road, Mumbai, Maharashtra 400049",
                agentId: agent._id,
                image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Modern Downtown Loft",
                price: "₹3.5 Cr",
                location: "Bandra West, Mumbai",
                description: "A chic, modern loft in the heart of Bandra. Walking distance to cafes and nightlife.",
                beds: 2,
                baths: 2,
                area: "1,800 sqft",
                type: "Apartment",
                address: "45 Hill Road, Bandra West, Mumbai, Maharashtra 400050",
                agentId: agent._id,
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Cozy Suburban Home",
                price: "₹85 Lakhs",
                location: "Koramangala, Bangalore",
                description: "Perfect for young families. This cozy home in Koramangala is close to tech parks and schools.",
                beds: 3,
                baths: 2,
                area: "2,200 sqft",
                type: "House",
                address: "88 5th Block, Koramangala, Bangalore, Karnataka 560034",
                agentId: agent._id,
                image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        ];

        await Property.insertMany(properties);
        return NextResponse.json({ message: "Database Seeded Successfully", properties });
    }

    return NextResponse.json({ message: "Database already seeded" });
}
