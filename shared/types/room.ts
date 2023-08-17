export type RoomStatus = "error" | "waiting" | "connected" | "playing";
export type RoomStatusCb = (status: RoomStatus) => void;
export type RoomExists = "exists" | "not exist" | "full";
