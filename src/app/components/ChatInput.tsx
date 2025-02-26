import { Send } from "lucide-react";
import { getSocket } from "@/app/services/socket";
import { useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ChatInputProps } from "@/app/types/chat-types";

export default function ChatInput({ input, setInput, sendMessage }: ChatInputProps) {
    const socket = getSocket();
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const { user } = useAuth();

    const handleTyping = () => {
        if (!socket || !user) return;

        socket.emit("typing", { userId: user.id, fullName: user.full_name });

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            socket.emit("stop_typing", { userId: user.id });
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, []);

    return (
        <div className="p-4 bg-white border-t border-gray-200 flex gap-3 items-center shadow-md">
            <input
                type="text"
                className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    handleTyping();
                }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
                className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all flex items-center gap-2 shadow-md"
                onClick={sendMessage}
            >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Enviar</span>
            </button>
        </div>
    );
}
