"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import { Message } from "@/app/types/message-types";
import { withAuth } from "../hoc/withAuth";
import {connectSocket, getSocket} from "@/app/services/socket";

function Chat() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [socket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const { typingUsers } = useAuth();
    const { updateTypingUsers } = useAuth();

    useEffect(() => {
        if (!user) router.push("/login");
    }, [user, router]);

    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const socket = connectSocket(token);

        socket.on("messages", setMessages);
        socket.on("message", (message: Message) => setMessages((prev) => [...prev, message]));

        socket.on("typing", ({ userId, fullName }) => {
            updateTypingUsers((prev) => ({ ...prev, [userId]: fullName }));
        });

        socket.on("stop_typing", ({ userId }) => {
            updateTypingUsers((prev) => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });
        });

        return () => {
            socket.disconnect();
            socket.off("typing");
            socket.off("stop_typing");
        };
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        const socket = getSocket();
        if (!input.trim() || !socket) return;

        socket.emit("message", input);
        setInput("");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
                <ChatHeader logout={logout} />
                <ChatMessages messages={messages} userId={user?.id?.toString()} messagesEndRef={messagesEndRef} />

                <div className="text-gray-500 text-sm bg-white px-4 h-3">
                    {Object.values(typingUsers).length > 0 &&
                        `${Object.values(typingUsers).join(", ")} está digitando...`}
                </div>

                <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
            </div>
        </div>
    );
}

export default withAuth(Chat);
