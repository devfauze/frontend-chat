import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
    if (socket) {
        socket.disconnect();
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:3333";

    socket = io(socketUrl, {
        auth: { token },
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
    });

    socket.on("connect_error", (err) => {
        console.error("Erro ao conectar ao WebSocket:", err.message);
    });

    return socket;
};

export const getSocket = (): Socket | null => socket;
