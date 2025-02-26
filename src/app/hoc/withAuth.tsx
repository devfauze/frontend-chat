import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth(Component: React.FC) {
    return function AuthenticatedComponent(props: any) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push("/login");
            }
        }, [user, loading, router]);

        if (loading || !user) return <p>Carregando...</p>;

        return <Component {...props} />;
    };
}
