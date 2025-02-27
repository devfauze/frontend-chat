"use client"

interface ChatRoomsProps {
    rooms: string[];
    currentRoom: string;
    onSelectRoom: (room: string) => void;
}

export default function ChatRooms({ rooms, currentRoom, onSelectRoom }: ChatRoomsProps) {
    return (
        <div className="p-4 bg-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Salas disponíveis:</h3>
            <div className="flex gap-2 flex-wrap">
                {rooms.map((room) => (
                    <button
                        key={room}
                        className={`px-4 py-2 text-sm rounded-lg transition-all ${
                            currentRoom === room ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                        }`}
                        onClick={() => onSelectRoom(room)}
                    >
                        {room}
                    </button>
                ))}
            </div>
        </div>
    );
}
