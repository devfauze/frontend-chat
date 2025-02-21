"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useRouter } from "next/navigation";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    async function login(email: string, password: string) {
        try {
            const res = await fetch("http://localhost:3333/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error("Credenciais inválidas");
            }

            const data = await res.json();
            localStorage.setItem("token", data.token.hash);
            setUser(data.user);
            router.push("/chat");
        } catch (err) {
            console.error("Erro ao fazer login:", err);
        }
    }


    async function register(full_name: string, email: string, password: string) {
        try {
            await api.post("/register", { full_name, email, password });
            await login(email, password);
        } catch (error) {
            console.error("Erro ao registrar", error);
        }
    }

    async function logout() {
        try {
            await api.post("/logout");
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Erro ao fazer logout", error);
        }
    }

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
