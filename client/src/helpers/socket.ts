import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from '../common/SocketEvents.ts';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(window.location.host);

export default function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
    return socket;
}