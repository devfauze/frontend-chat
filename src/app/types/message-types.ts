import {RefObject} from "react";

export interface Message {
    id: number;
    userId: number;
    content: string;
    createdAt: string;
    user?: { fullName: string };
}

export interface ChatMessagesProps {
    messages: Message[];
    userId?: string;
    messagesEndRef: RefObject<HTMLDivElement>;
}