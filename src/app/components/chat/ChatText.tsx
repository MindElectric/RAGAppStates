import { clsx } from "clsx"
export const ChatText = ({ message, role }: { message: string, role: string }) => {
    const upper = `${role.charAt(0).toUpperCase()}${role.substring(1)}`
    return (
        <div className={clsx("daisy-chat", role === "user" ? "daisy-chat-end" : "daisy-chat-start")}>
            <div className="daisy-chat-header opacity-50 p-1">{upper}</div>
            <div className={clsx("daisy-chat-bubble", role === "user" ? "daisy-chat-bubble-primary" : "daisy-chat-bubble-info")}>
                {message}
            </div>
        </div>
    )
}
