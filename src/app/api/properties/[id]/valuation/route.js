
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Fetch the target property
        const property = await prisma.property.findUnique({
            where: { id },
            include: { agent: { select: { name: true } } }
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        // 2. Fetch "neighbor" properties for context (same type and location prefix)
        const locationPrefix = property.location.split(',')[0].trim();
        const neighbors = await prisma.property.findMany({
            where: {
                type: property.type,
                location: { contains: locationPrefix },
                NOT: { id: property.id }
            },
            take: 5,
            select: {
                title: true,
                price: true,
                area: true,
                beds: true,
                baths: true
            }
        });

        // 3. Construct AI Prompt
        const prompt = `
            You are a real estate valuation expert. Calculate the "Fair Market Value" for the following property:
            
            TARGET PROPERTY:
            - Title: ${property.title}
            - Type: ${property.type}
            - Price: ${property.price}
            - Location: ${property.location}
            - Area: ${property.area} sqft
            - Beds: ${property.beds}
            - Baths: ${property.baths}
            - Description: ${property.description}
            
            COMPARABLE PROPERTIES (NEIGHBORS):
            ${neighbors.map(n => `- ${n.title}: ${n.price} (Area: ${n.area}, Beds: ${n.beds})`).join('\n')}
            
            Return ONLY a JSON object with:
            1. "marketValue": (Number) The estimated value.
            2. "notes": (String, max 200 chars) Briefly explain why based on square footage, amenities, or local trends.
            3. "priceConfidence": (String) High, Medium, or Low.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a professional real estate analyst." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);

        // 4. Update the DB
        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                marketValue: result.marketValue,
                valuationNotes: result.notes
            }
        });

        return NextResponse.json({
            marketValue: updatedProperty.marketValue,
            valuationNotes: updatedProperty.valuationNotes,
            priceConfidence: result.priceConfidence
        });

    } catch (error) {
        console.error("Valuation Error:", error);
        return NextResponse.json({
            error: "Failed to generate valuation",
            message: error.message
        }, { status: 500 });
    }
}
