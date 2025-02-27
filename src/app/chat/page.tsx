"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import ChatRooms from "../components/ChatRooms";
import { Message } from "@/app/types/message-types";
import { connectSocket, getSocket } from "@/app/services/socket";
import {withAuth} from "@/app/hoc/withAuth";

const rooms = ["Geral", "Trabalho", "Jogos", "Estudos"];

function Chat() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [currentRoom, setCurrentRoom] = useState("Geral");
    const messagesEndRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!user) router.push("/login");
    }, [user, router]);

    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        let socket = getSocket();
        if (!socket) {
            socket = connectSocket(token);
            setSocket(socket);
        }

        socket.emit("leaveRoom", currentRoom);
        socket.emit("joinRoom", currentRoom);

        socket.off("messages").on("messages", setMessages);
        socket.off("message").on("message", (message: Message) => setMessages((prev) => [...prev, message]));

        socket.on("userTyping", ({ fullName }) => {
            setTypingUsers((prev) => {
                if (!prev.includes(fullName)) return [...prev, fullName];
                return prev;
            });
        });

        socket.on("userStoppedTyping", ({ fullName }) => {
            setTypingUsers((prev) => prev.filter((name) => name !== fullName));
        });

        return () => {
            socket.emit("leaveRoom", currentRoom);
            socket.off("userTyping");
            socket.off("userStoppedTyping");
        };
    }, [user, currentRoom]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        if (query.length < 2) return;

        try {
            const response = await fetch(`http://localhost:3333/messages/search?query=${query}&room=${currentRoom}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        }
    };

    const sendMessage = () => {
        const socket = getSocket();
        if (!input.trim() || !socket) return;

        const messageData = {
            content: input,
            room: currentRoom,
            userId: user?.id,
        };

        socket.emit("message", messageData);
        setInput("");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
                <ChatHeader logout={logout} />

                <div className="p-2 bg-gradient-to-r from-gray-800 to-gray-700 flex">
                    <input
                        type="text"
                        placeholder="Buscar mensagens..."
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);
                            handleSearch(value);
                        }}
                        className="w-full p-2 text-white bg-gray-700 hover:bg-gray-600 rounded-l focus:outline-none"
                    />
                    <button onClick={() => handleSearch(search)} className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-r">
                        🔍
                    </button>
                </div>

                <ChatRooms
                    rooms={rooms}
                    currentRoom={currentRoom}
                    onSelectRoom={(room) => {
                        setCurrentRoom(room);
                        setSearch("");
                        setSearchResults([]);
                    }}
                />

                <ChatMessages
                    messages={searchResults.length > 0 ? searchResults : messages}
                    userId={user?.id?.toString()}
                    messagesEndRef={messagesEndRef}
                />

                <div className="bg-gray-50 h-5">
                    {typingUsers.length > 0 && (
                        <p className="bg-white text-sm text-gray-500 px-4 ">
                            {typingUsers.join(', ')} {typingUsers.length > 1 ? 'estão' : 'está'} digitando...
                        </p>
                    )}
                </div>

                <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} currentRoom={currentRoom} />
            </div>
        </div>
    );
}

export default withAuth(Chat);
