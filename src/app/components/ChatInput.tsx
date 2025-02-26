import { Send } from "lucide-react";
import { getSocket } from "@/app/services/socket";
import { useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {ChatInputProps} from "@/app/types/chat-types";

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
        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
                type="text"
                className="flex-1 px-4 py-2 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    handleTyping();
                }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
                className="px-4 py-2 bg-gray-900 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-1"
                onClick={sendMessage}
            >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
            </button>
        </div>
    );
}
