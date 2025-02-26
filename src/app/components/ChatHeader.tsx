import { MessageCircle, LogOut } from "lucide-react";

interface ChatHeaderProps {
    onLogout: () => void;
}

export function ChatHeader({ onLogout }: ChatHeaderProps) {
    return (
        <div className="bg-gray-900 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-gray-200" />
                <h2 className="text-lg font-semibold text-gray-200">Chat</h2>
            </div>
            <button
                onClick={onLogout}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm transition-all"
            >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
            </button>
        </div>
    );
}
