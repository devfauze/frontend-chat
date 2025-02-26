import { Message } from "@/app/types/message-types";

interface ChatMessagesProps {
    messages: Message[];
    userId?: number;
}

export function ChatMessages({ messages, userId }: ChatMessagesProps) {
    return (
        <div className="h-96 overflow-y-auto p-4 bg-gray-700 flex flex-col gap-3">
            {messages.map((msg) => {
                const isUserMessage = msg.userId === userId;

                return (
                    <div
                        key={msg.id}
                        className={`max-w-[75%] p-3 rounded-xl text-sm shadow-md ${
                            isUserMessage
                                ? "bg-blue-500 text-white self-end"
                                : "bg-gray-300 text-gray-900 self-start"
                        }`}
                    >
                        {!isUserMessage && (
                            <p className="text-xs font-semibold text-gray-800 mb-1">
                                {msg.user?.fullName || "Usuário desconhecido"}
                            </p>
                        )}
                        <p>{msg.content}</p>
                    </div>
                );
            })}
        </div>
    );
}
