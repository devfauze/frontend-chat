"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, UserPlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AuthCard } from "../components/AuthCard";

export default function RegisterPage() {
    const { register, loading } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await register(fullName, email, password);
            router.push("/chat");
        } catch {
            setError("Erro ao registrar. Tente novamente.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <AuthCard title="Crie sua conta" subtitle="Preencha os campos abaixo para se registrar">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                    <Input type="text" icon={<User />} placeholder="Seu nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <Input type="email" icon={<Mail />} placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" icon={<Lock />} placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <Button type="submit" className="bg-green-600 text-white hover:bg-green-700" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                        {loading ? "Criando conta..." : "Registrar"}
                    </Button>
                </form>

                <p className="mt-4 text-sm text-gray-600 text-center">
                    Já tem uma conta?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">Faça login</a>
                </p>
            </AuthCard>
        </div>
    );
}
