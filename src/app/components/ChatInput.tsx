import { Send } from "lucide-react";

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
    return (
        <div className="p-4 bg-gray-900 border-t border-gray-800">
            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 px-4 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Digite sua mensagem..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSend()}
                />
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center gap-1"
                    onClick={onSend}
                >
                    <Send className="w-4 h-4" />
                    <span>Enviar</span>
                </button>
            </div>
        </div>
    );
}
