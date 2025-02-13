'use client';
import { useEffect } from "react";
import { useChat } from "ai/react";
import { ChatText } from "./ChatText";
import { useMessageStore } from "@/store/chat/store";
export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, append } = useChat({
        api: "/api/gemini",
        onError: (error) => console.error(error),
    });

    const mapMessage = useMessageStore((state) => state.message);

    useEffect(() => {
        if (mapMessage) {
            append({ content: mapMessage, role: "user" }); // Add map message to AI chat
        }
    }, [mapMessage]);

    return (
        <>
            <div className="flex flex-col w-full h-screen">
                <div className="flex flex-col flex-grow w-full overflow-y-scroll">
                    {messages.map(m => (
                        <div key={m.id} className="whitespace-pre-wrap mb-4 mx-5">
                            <ChatText message={m.content} role={m.role} />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center bg-box w-full z-20 pt-2">
                    <form onSubmit={handleSubmit} className="w-full flex justify-center">
                        <input
                            className=" w-full max-w-md p-2 mb-5 border border-gray-300 rounded shadow-xl text-white"
                            value={input}
                            placeholder="Say something..."
                            onChange={handleInputChange}
                        />
                    </form>
                </div>
            </div>

        </>
    );
}
