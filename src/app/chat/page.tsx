"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import { Message } from "@/app/types/message-types";
import { withAuth } from "../hoc/withAuth";

function Chat() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

    useEffect(() => {
        if (!user) router.push("/login");
    }, [user, router]);

    useEffect(() => {
        if (!user || socket) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const newSocket = io("http://localhost:3333", {
            auth: { token },
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        newSocket.on("messages", setMessages);
        newSocket.on("message", (message: Message) => setMessages((prev) => [...prev, message]));

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !socket) return;
        socket.emit("message", input);
        setInput("");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
                <ChatHeader logout={logout} />
                <ChatMessages messages={messages} userId={user?.id?.toString()} messagesEndRef={messagesEndRef} />
                <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
            </div>
        </div>
    );
}

export default withAuth(Chat);
