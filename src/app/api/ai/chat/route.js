
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    // Default header for OpenRouter
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'HomeConnect',
    },
});

export async function POST(request) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
        }

        const systemMessage = {
            role: "system",
            content: `You are a helpful and knowledgeable Real Estate Assistant for "HomeConnect".
            
            Your goal is to assist users with:
            - Finding properties (ask for their preferences like location, budget, bedrooms).
            - Explaining real estate terms.
            - Guiding them through the buying/selling process.
            - Navigation of the HomeConnect platform.

            Key Information about HomeConnect:
            - We have properties in major Indian cities (Mumbai, Bangalore, etc.).
            - We offer AI-driven matchmaking and property descriptions.
            - We have a team of verified agents.

            Tone: Professional, friendly, and concise. Use emojis sparingly.
            Refuse to answer questions unrelated to real estate or HomeConnect.
            `
        };

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [systemMessage, ...messages],
        });

        const reply = completion.choices[0].message;

        return NextResponse.json({ message: reply });

    } catch (error) {
        console.error("AI Chat Error Details:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
            apiKeyPresent: !!process.env.OPENROUTER_API_KEY
        });
        return NextResponse.json({
            error: "Failed to process chat",
            details: error.message
        }, { status: 500 });
    }
}
