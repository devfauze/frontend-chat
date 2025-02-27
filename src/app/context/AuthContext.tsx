"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { connectSocket, getSocket } from "@/app/services/socket";
import {User} from "@/app/types/user-types";
import {Message} from "@/app/types/message-types";
import {AuthContextProps} from "@/app/types/auth-types";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [typingUsers, setTypingUsers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            setLoading(false);
            return;
        }

        setUser(JSON.parse(storedUser));

        const existingSocket = getSocket();
        if (existingSocket) {
            existingSocket.disconnect();
        }

        connectWebSocket(token);
        setLoading(false);
    }, []);

    const connectWebSocket = (token: string) => {
        const socket = connectSocket(token);

        socket.on("messages", (msgs: Message[]) => {
            setMessages(msgs.map((msg) => ({ ...msg, createdAt: format(new Date(msg.createdAt), "HH:mm") })));
        });

        socket.on("message", (msg: Message) => {
            let formattedTimestamp = "Horário desconhecido";

            if (msg.createdAt) {
                const date = new Date(msg.createdAt);
                if (!isNaN(date.getTime())) {
                    formattedTimestamp = format(date, "HH:mm");
                }
            }

            setMessages((prev) => [...prev, { ...msg, createdAt: formattedTimestamp }]);
        });

        socket.on("typing", ({ userId, fullName }) => {
            setTypingUsers((prev) => ({ ...prev, [userId]: fullName }));
        });

        socket.on("stop_typing", ({ userId }) => {
            setTypingUsers((prev) => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });
        });
    };

    const updateTypingUsers = (callback: (prev: Record<number, string>) => Record<number, string>) => {
        setTypingUsers(callback);
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:3333/login", { email, password });

            if (data.token) {
                document.cookie = `token=${data.token}; path=/`;
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setUser(data.user);

                const existingSocket = getSocket();
                if (existingSocket) {
                    existingSocket.disconnect();
                }

                connectWebSocket(data.token);
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (full_name: string, email: string, password: string) => {
        try {
            await axios.post("http://localhost:3333/register", { full_name, email, password });
            await login(email, password);
        } catch (error) {
            console.error("Erro ao registrar:", error);
        }
    };

    const logout = async () => {
        try {
            document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            const socket = getSocket();
            if (socket) {
                socket.disconnect();
            }

            setUser(null);
            setMessages([]);
            setTypingUsers({});

        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, messages, typingUsers, loading, login, register, logout, updateTypingUsers }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}
