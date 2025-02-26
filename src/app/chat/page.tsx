"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { ChatHeader } from "../components/ChatHeader";
import { ChatMessages } from "../components/ChatMessages";
import { ChatInput } from "../components/ChatInput";
import { Message } from "@/app/types/message-types";

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
        <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4">
            <div className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden bg-gray-800">
                <ChatHeader onLogout={logout} />
                <ChatMessages messages={messages} userId={user?.id} />
                <ChatInput value={input} onChange={setInput} onSend={sendMessage} />
            </div>
        </div>
    );
}
