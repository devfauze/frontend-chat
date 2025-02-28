import { ChatMessagesProps } from "@/app/types/message-types";
import { format } from "date-fns";

export default function ChatMessages({ messages, userId, messagesEndRef }: ChatMessagesProps) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Nenhuma mensagem ainda. Seja o primeiro a enviar!
                <div ref={messagesEndRef} />
            </div>
        );
    }

    return (
        <>
            {messages.map((msg) => {
                const isUserMessage = msg.userId !== Number(userId);
                const messageContent = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
                const formattedTimestamp = msg.createdAt ? format(new Date(msg.createdAt), "HH:mm") : "";

                return (
                    <div
                        key={msg.id}
                        className={`max-w-[80%] p-3 rounded-xl shadow-md transition-all ${
                            isUserMessage ? "bg-gray-200 text-gray-900 self-start" : "bg-blue-500 text-white self-end"
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            {isUserMessage && (
                                <p className="text-sm font-semibold text-gray-700">
                                    {msg.user?.fullName ? `${msg.user.fullName}:` : "Usuário desconhecido:"}
                                </p>
                            )}
                            {formattedTimestamp && <span className="text-xs text-gray-500">{formattedTimestamp}</span>}
                        </div>
                        <p className="text-sm leading-relaxed">{messageContent}</p>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </>
    );
}

