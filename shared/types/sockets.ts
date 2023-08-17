import { RoomExists, RoomStatus } from "./room";

export interface ClientToServerEvents {
	joinroom: (roomId: string) => void;
	findroom: (
		roomId: string,
		checkRoom: (roomExistance: RoomExists) => void,
	) => void;
	roomstatus: (status: RoomStatus) => void;
}

export interface ServerToClientEvents {
	roomstatus: (status: RoomStatus) => void;
}
