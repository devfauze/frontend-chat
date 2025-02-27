export interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    sendMessage: () => void;
    currentRoom: string;
}