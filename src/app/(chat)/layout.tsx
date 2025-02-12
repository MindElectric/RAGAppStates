'use client'
import { Chatbox } from "@/app/components/chat/Chatbox";
import { InitialMap } from "../components/map/InitialMap";

export default function ChatLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen" data-theme="mytheme">
            <aside className="w-2/5">
                <Chatbox />
            </aside>
            <div className="w-3/5">
                <div className="flex-col">
                    <div className="w-full h-full">
                        <h1 className="text-center pt-5 text-4xl">Estados de Mexico</h1>
                        <InitialMap />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}