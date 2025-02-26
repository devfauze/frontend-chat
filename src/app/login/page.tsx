"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AuthCard } from "../components/AuthCard";

export default function LoginPage() {
    const { login, loading } = useAuth();
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <AuthCard title="Bem-vindo!" subtitle="Entre para continuar">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                    <Input type="email" icon={<Mail />} placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" icon={<Lock />} placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>

                <p className="mt-4 text-sm text-gray-600 text-center">
                    Ainda não tem uma conta?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">Registre-se</a>
                </p>
            </AuthCard>
        </div>
    );
}
