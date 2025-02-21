"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            router.push("/chat");
        } catch (err) {
            setError("Credenciais inválidas.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl transform transition-all hover:shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Bem-vindo</h2>
                    <p className="text-gray-500 mt-2">Faça login para continuar</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Seu e-mail"
                            className="w-full pl-12 pr-4 py-3 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="Sua senha"
                            className="w-full pl-12 pr-4 py-3 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                        <LogIn className="w-5 h-5" />
                        Entrar
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Não tem uma conta?{' '}
                        <a
                            href="/register"
                            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                        >
                            Cadastre-se
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}