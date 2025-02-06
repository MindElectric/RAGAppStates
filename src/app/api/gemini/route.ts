import { streamText, Message, smoothStream, createDataStreamResponse, } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getRelevantContent } from "../../../../actions/actions";



const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || "",
})

export const dynamic = 'force-dynamic';

const TEMPLATE = `\n\n
Eres un asistente chatbot.
Entiendes solamente en español, si el usuario no escribe en el idioma Español, responde que no conoces el idioma.
Responda en Español.
Responde las preguntas del usuario máximo 60 palabras.
Responda las preguntas del usuario en función del contexto proporcionado de una manera verbosa. Si la respuesta no está en el contexto, responda cortésmente que no tienes esa información disponible en tu base de datos.:

`


export async function POST(req: Request) {
    try {
        const { messages }: { messages: Message[] } = await req.json();
        const lastMessage = messages.pop();

        if (!lastMessage) {
            return new Response("No messages provided", { status: 400 });
        }

        // load a JSON OBJECT
        return createDataStreamResponse({
            execute: async (dataStream) => {
                const relevantContent = await getRelevantContent(lastMessage.content);
                // for (const content of relevantContent) {
                //     const responseText = `State: ${content.state}\nNickname: ${content.nickname}\nCapital: ${content.capital_city}\nWebsite: ${content.website}`;

                //     dataStream.writeData({
                //         type: "state_info",
                //         text: responseText // Send as a formatted string
                //     });
                // }
                lastMessage!.content =
                    lastMessage!.content +
                    TEMPLATE +
                    relevantContent.join("\n");

                const result = streamText({
                    model: google('gemini-1.5-flash-8b'),
                    messages: [...messages, lastMessage],
                    temperature: 0.6,
                    experimental_transform: smoothStream(),
                    onFinish: async ({ }) => {
                        dataStream.writeMessageAnnotation({ sources: relevantContent });
                    }
                });
                result.mergeIntoDataStream(dataStream)
            }
        })



    } catch (e: any) {
        return Response.json({ error: e.message }, { status: e.status ?? 500 });
    }


}