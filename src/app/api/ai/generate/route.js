
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    // Default header for OpenRouter
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000', // Optional
        'X-Title': 'HomeConnect', // Optional
    },
});

export async function POST(request) {
    try {
        const data = await request.json();
        const { title, location, type, features, beds, baths, area } = data;

        if (!title || !location) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Construct the prompt
        const prompt = `
      You are a professional real estate copywriter. Write a compelling and attractive property description for a listing with the following details:
      
      - Title: ${title}
      - Type: ${type}
      - Location: ${location}
      - Specifications: ${beds} Beds, ${baths} Baths, ${area} sqft
      - Key Features: ${features.join(', ')}
      
      The description should be engaging, highlighting the lifestyle and key selling points. Keep it under 200 words. Use emojis sparingly.
    `;

        const completion = await openai.chat.completions.create({
            model: "microsoft/phi-3-mini-128k-instruct:free", // Use a more reliable free model
            messages: [
                { role: "system", content: "You are a helpful real estate assistant." },
                { role: "user", content: prompt }
            ],
        });

        const generatedText = completion.choices[0].message.content;

        return NextResponse.json({ description: generatedText });

    } catch (error) {
        console.error("AI Generation Error Details:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
            apiKeyPresent: !!process.env.OPENROUTER_API_KEY
        });
        return NextResponse.json({
            error: "Failed to generate description",
            details: error.message
        }, { status: 500 });
    }
}
