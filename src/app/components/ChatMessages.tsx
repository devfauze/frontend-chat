import { ChatMessagesProps } from "@/app/types/message-types";
import { format } from "date-fns";

export default function ChatMessages({ messages, userId, messagesEndRef }: ChatMessagesProps) {
    return (
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2">
            {messages.map((msg) => {
                const isUserMessage = msg.userId !== Number(userId);
                const messageContent = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
                const formattedTimestamp = msg.createdAt ? format(new Date(msg.createdAt), "HH:mm") : "";

                return (
                    <div
                        key={msg.id}
                        className={`max-w-[80%] p-3 rounded-lg shadow-sm transition-shadow ${
                            isUserMessage ? "bg-gray-300 text-black self-start" : "bg-blue-500 text-white self-end"
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            {isUserMessage && (
                                <p className="text-sm font-semibold text-gray-700">
                                    {msg.user?.fullName ? `${msg.user.fullName}:` : "Usuário desconhecido:"}
                                </p>
                            )}
                            {formattedTimestamp && <span className="text-xs text-gray-500">{formattedTimestamp}</span>}
                        </div>
                        <p>{messageContent}</p>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}
