import { Socket, io } from "socket.io-client";
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "@/shared/types/sockets";
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	"http://localhost:4000",
);
