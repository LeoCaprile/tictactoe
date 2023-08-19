import { GameState } from "./game";
import { RoomExists, RoomStatus } from "./room";

export interface ClientToServerEvents {
	joinroom: (roomId: string) => void;
	findroom: (
		roomId: string,
		checkRoom: (roomExistance: RoomExists) => void,
	) => void;
	roomstatus: (status: RoomStatus) => void;
	playeroneturn: (id: number, symbol: string) => void;
	gamestate: (state: GameState) => void;
}

export interface ServerToClientEvents {
	roomstatus: (status: RoomStatus) => void;
	playertwoturn: (id: number, symbol: string) => void;
	gamestate: (state: GameState) => void;
}
