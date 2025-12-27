import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        const { reviews } = await request.json();

        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
            return NextResponse.json({ error: "No reviews provided" }, { status: 400 });
        }

        const prompt = `Analyze the following agent reviews and provide a summary of sentiment and key insights.
        Reviews:
        ${reviews.map((r, i) => `${i + 1}. ${r}`).join('\n')}

        Return a JSON object with:
        - sentimentScore: (number 0-100, where 100 is extremely positive)
        - sentimentLabel: (string "Positive", "Negative", or "Neutral")
        - topCompliments: (array of strings, max 3)
        - topComplaints: (array of strings, max 3)
        - summary: (string, a 1-sentence summary of overall reputation)`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an expert real estate performance analyst. Return only JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(response.choices[0].message.content);

        return NextResponse.json(analysis);

    } catch (error) {
        console.error("AI Sentiment Error:", error);
        return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
    }
}
