"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import ChatRooms from "../components/ChatRooms";
import { Message } from "@/app/types/message-types";
import { connectSocket, getSocket } from "@/app/services/socket";
import { withAuth } from "@/app/hoc/withAuth";

const rooms = ["Geral", "Trabalho", "Jogos", "Estudos"];

function Chat() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [currentRoom, setCurrentRoom] = useState("Geral");
    const messagesEndRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Message[]>([]);
    const [page, setPage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [hasMoreSearch, setHasMoreSearch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const limit = 10;

    useEffect(() => {
        if (!user) router.push("/login");
    }, [user, router]);

    useEffect(() => {
        if (!user) return;

        setPage(1);
        setMessages([]);
        setHasMore(true);
        fetchMessages(1);

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

    const fetchMessages = async (pageToFetch: number) => {
        if (!user || isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/messages?room=${currentRoom}&page=${pageToFetch}&limit=${limit}`
            );
            const data = await response.json();

            if (Array.isArray(data.data)) {
                if (data.data.length < limit) {
                    setHasMore(false);
                }

                if (pageToFetch === 1) {
                    setMessages(data.data);
                } else {
                    setMessages(prev => {
                        if (Array.isArray(prev)) {
                            return [...data.data, ...prev];
                        }
                        return data.data;
                    });
                }
            } else {
                console.error("A resposta não contém um array de mensagens", data);
            }

            setPage(pageToFetch);
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        if (query.length < 2) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/search?query=${query}&room=${currentRoom}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        }
    };

    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current || isLoading) return;

        const { scrollTop } = messagesContainerRef.current;

        if (scrollTop < 50) {
            if (search && hasMoreSearch) {
                handleSearch(search);
            } else if (!search && hasMore) {
                fetchMessages(page + 1);
            }
        }
    }, [page, searchPage, isLoading, search, hasMore, hasMoreSearch]);

    useEffect(() => {
        const messagesContainer = messagesContainerRef.current;
        if (messagesContainer) {
            messagesContainer.addEventListener('scroll', handleScroll);
            return () => messagesContainer.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    useEffect(() => {
        if (page === 1 || messages.length === 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, page]);

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

    const clearSearch = () => {
        setSearch("");
        setSearchResults([]);
        setSearchPage(1);
        setHasMoreSearch(true);
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
                        clearSearch();
                    }}
                />

                <div
                    ref={messagesContainerRef}
                    className="h-96 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                >
                    {isLoading && page > 1 && (
                        <div className="text-center text-gray-500 py-2">Carregando mensagens...</div>
                    )}

                    <ChatMessages
                        messages={searchResults.length > 0 ? searchResults : messages}
                        userId={user?.id?.toString()}
                        messagesEndRef={messagesEndRef}
                    />

                    {!isLoading && search && searchResults.length === 0 && (
                        <div className="text-center text-gray-500 py-2">Nenhuma mensagem encontrada</div>
                    )}
                </div>

                <div className="bg-gray-50 h-5">
                    {typingUsers.length > 0 && (
                        <p className="bg-white text-sm text-gray-500 px-4">
                            {typingUsers.join(', ')} {typingUsers.length > 1 ? 'estão' : 'está'} digitando...
                        </p>
                    )}
                </div>

                <ChatInput
                    input={input}
                    setInput={setInput}
                    sendMessage={sendMessage}
                    currentRoom={currentRoom}
                />
            </div>
        </div>
    );
}

export default withAuth(Chat);
