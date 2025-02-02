import { Chatbox } from "@/app/components/chat/Chatbox";

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
                <div className="flex-col">{children}</div>
            </div>
        </div>
    );
}