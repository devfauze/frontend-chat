import { Send } from "lucide-react";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    sendMessage: () => void;
}

export default function ChatInput({ input, setInput, sendMessage }: ChatInputProps) {
    return (
        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
                type="text"
                className="flex-1 px-4 py-2 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
                className="px-4 py-2 bg-gray-900 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-1"
                onClick={sendMessage}
            >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
            </button>
        </div>
    );
}
