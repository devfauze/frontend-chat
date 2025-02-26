"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, UserPlus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AuthCard } from "../components/AuthCard";

export default function RegisterPage() {
    const { register } = useAuth();
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
            setError("Erro ao criar conta. Tente novamente.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
            <AuthCard title="Criar Conta" subtitle="Preencha os dados para se registrar">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input type="text" icon={<User />} placeholder="Nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <Input type="email" icon={<Mail />} placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" icon={<Lock />} placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700">
                        <UserPlus className="w-5 h-5" /> Criar Conta
                    </Button>
                </form>
            </AuthCard>
        </div>
    );
}
