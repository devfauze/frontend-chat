import {ReactNode} from "react";
import {User} from "@/app/types/user-types";

export interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export interface AuthContextProps {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (full_name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
