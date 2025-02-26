import { LogOut, MessageCircle } from "lucide-react";

interface ChatHeaderProps {
    logout: () => void;
}

export default function ChatHeader({ logout }: ChatHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-white" />
                <h2 className="text-lg font-semibold text-white">Chat</h2>
            </div>
            <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
            >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
            </button>
        </div>
    );
}
