import { Chatbox } from "@/app/(chat)/components/Chatbox";

export default function ChatLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center items-center h-screen" data-theme="mytheme">
            <aside className="w-2/5">
                <Chatbox />
            </aside>
            <div className="w-3/5">
                <h1>{children}</h1>
            </div>
        </div>
    );
}