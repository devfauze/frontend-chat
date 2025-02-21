"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push("/login");
    }, [router]);

    return <div className="p-4 text-center">Redirecionando...</div>;
}
