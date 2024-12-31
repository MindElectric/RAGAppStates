import { streamText, Message } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";


const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || "",
})

export const runtime = 'edge';

const generateId = () => Math.random().toString(36).slice(2, 15);

const buildGoogleGenAIPrompt = (messages: Message[]): Message[] => [
    {
        id: generateId(),
        role: 'user',
        content: "You are a helpful assistant for the states of the world"
    },
    ...messages.map((message) => ({
        id: generateId(),
        role: message.role,
        content: message.content
    }))
]

export async function POST(req: Request) {
    const { messages } = await req.json();

    const stream = await streamText({
        model: google("gemini-1.0-pro"),
        messages: buildGoogleGenAIPrompt(messages),
        temperature: 0.5
    });

    return stream.toDataStreamResponse();
}