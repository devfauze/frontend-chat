"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AuthCard } from "../components/AuthCard";

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
        } catch {
            setError("Credenciais inválidas.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <AuthCard title="Bem-vindo" subtitle="Faça login para continuar">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input type="email" icon={<Mail />} placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" icon={<Lock />} placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">
                        <LogIn className="w-5 h-5" /> Entrar
                    </Button>
                </form>
            </AuthCard>
        </div>
    );
}
