import { Send } from "lucide-react";
import { getSocket } from "@/app/services/socket";
import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ChatInputProps } from "@/app/types/chat-types";

export default function ChatInput({ input, setInput, sendMessage, currentRoom }: ChatInputProps) {
    const socket = getSocket();
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const { user } = useAuth();

    const handleTyping = useCallback(() => {
        if (!socket || !user) return;

        socket.emit("typing", { userId: user.id, fullName: user.full_name, room: currentRoom });

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            socket.emit("stopTyping", { userId: user.id, room: currentRoom });
        }, 2000);
    }, [socket, user, currentRoom]);

    return (
        <div className="p-4 bg-white border-t border-gray-200 shadow-md">
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder={`Digite sua mensagem em ${currentRoom}...`}
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
        </div>
    );
}
