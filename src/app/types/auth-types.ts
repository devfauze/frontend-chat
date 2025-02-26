import {ReactNode} from "react";
import {User} from "@/app/types/user-types";
import {Message} from "@/app/types/message-types";

export interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export interface AuthContextProps {
    user: User | null;
    messages: Message[];
    typingUsers: Record<number, string>;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (full_name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateTypingUsers: (callback: (prev: Record<number, string>) => Record<number, string>) => void;
}