"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

interface User {
    id: number;
    full_name: string;
    email: string;
}

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (full_name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

let socket: Socket | null = null;

const connectWebSocket = (token: string) => {
    if (socket) {
        socket.disconnect();
    }

    socket = io("ws://localhost:3333", {
        auth: { token }
    });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            connectWebSocket(token);
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await axios.post("http://localhost:3333/login", { email, password });

            if (data.token) {
                document.cookie = `token=${data.token}; path=/`;
                localStorage.setItem("token", data.token.hash);
                localStorage.setItem("user", JSON.stringify(data.user));

                setUser(data.user);

                if (socket) {
                    socket.disconnect();
                    socket = null;
                }

                connectWebSocket(data.token.hash);
            }
        } catch (error) {
            console.error("❌ Erro ao fazer login:", error);
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

            if (socket) {
                socket.disconnect();
                socket = null;
            }

            setUser(null);
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
