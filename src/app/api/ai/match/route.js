
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
    const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'HomeConnect',
        },
    });
    try {
        const data = await request.json();
        const { preferences, properties } = data;

        if (!preferences || !properties || properties.length === 0) {
            return NextResponse.json({ error: "Missing preferences or properties" }, { status: 400 });
        }

        // Limit to 5 properties at a time to save tokens/latency
        const limitedProps = properties.slice(0, 5);

        const prompt = `
      Act as a real estate matching expert. Compare the User Preferences with the provided Property List.
      
      User Preferences:
      - Budget: ${preferences.minPrice || 'Any'} to ${preferences.maxPrice || 'Any'}
      - Beds: ${preferences.beds || 'Any'}
      - Baths: ${preferences.baths || 'Any'}
      - Type: ${preferences.type || 'Any'}
      - Keywords: ${preferences.search || 'None'}

      Property List:
      ${JSON.stringify(limitedProps.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            type: p.type,
            features: p.features,
            location: p.location
        })))}

      For EACH property, calculate a "match_score" (0-100) and a brief 1-sentence "reason".
      Return ONLY a JSON object mapping property IDs to their result, like:
      {
        "123": { "score": 85, "reason": "Great price and correct location." },
        "456": { "score": 40, "reason": "Over budget." }
      }
    `;

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                { role: "system", content: "You are a JSON-only API. Return only valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);

        return NextResponse.json(result);

    } catch (error) {
        console.error("AI Match Error:", error);
        return NextResponse.json({ error: "Failed to calculate matches" }, { status: 500 });
    }
}
