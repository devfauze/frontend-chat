export interface Message {
    id: number;
    userId: number;
    content: string;
    createdAt: string;
    user?: { fullName: string };
}

export interface ChatMessageProps {
    msg: Message;
    isUserMessage: boolean;
}