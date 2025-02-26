"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { MessageCircle, LogOut, Send } from 'lucide-react';

interface Message {
    id: number;
    userId: number;
    content: string;
    createdAt: string;
    user?: { fullName: string };
}

export default function Chat() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    useEffect(() => {
        if (!user) return;

        const newSocket = io("http://localhost:3333", {
            auth: { token: localStorage.getItem("token") },
        });

        newSocket.on("messages", (loadedMessages: Message[]) => {
            setMessages(loadedMessages);
        });

        newSocket.on("message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const sendMessage = () => {
        if (input.trim()) {
            socket?.emit("message", input);
            setInput("");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-600 p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 text-white" />
                            <h2 className="text-lg font-semibold text-white">Chat</h2>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                        </button>
                    </div>
                </div>

                <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2">
                    {messages.map((msg) => {
                        const isUserMessage = msg.userId !== user?.id;
                        const messageContent = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);

                        return (
                            <div
                                key={msg.id}
                                className={`max-w-[75%] p-3 rounded-lg shadow-sm transition-shadow ${
                                    isUserMessage
                                        ? "bg-gray-300 text-black self-start"
                                        : "bg-blue-500 text-white self-end"
                                }`}
                            >
                                {isUserMessage && (
                                    <p className="text-sm font-semibold text-gray-700">
                                        {msg.user?.fullName ? `${msg.user.fullName}:` : "Usuário desconhecido:"}
                                    </p>
                                )}
                                <p>{messageContent}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                            placeholder="Digite sua mensagem..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
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
                </div>
            </div>
        </div>
    );
}
