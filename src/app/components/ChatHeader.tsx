import { LogOut, MessageCircle } from "lucide-react";

interface ChatHeaderProps {
    logout: () => void;
}

export default function ChatHeader({ logout }: ChatHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
                <MessageCircle className="w-7 h-7 text-white" />
                <h2 className="text-xl font-semibold text-white tracking-wide">Chat</h2>
            </div>
            <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white text-sm font-medium shadow-sm"
            >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
            </button>
        </div>
    );
}
