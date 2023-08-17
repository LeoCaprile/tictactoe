import { socket } from "@/apps/client/src/services/socket";
import { useEffect, useState } from "react";
import { RoomExists, RoomStatus } from "@/shared/types/room";

const RoomStatusMsg = {
	error: "Something went wrong",
	waiting: "Join a room to start playing",
	connected: "Player connected, starting game",
	playing: "Game started",
};

const RoomStatusColor = {
	error: "text-red-500",
	waiting: "text-yellow-500",
	connected: "text-green-500",
	playing: "text-green-500",
};

const JoinPage = () => {
	const [roomId, setRoomId] = useState("");
	const [roomExists, setRoomExists] = useState<RoomExists | null>(null);
	const [roomStatus, setRoomStatus] = useState<RoomStatus>("waiting");

	const onRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRoomId(e.target.value);
	};

	const checkRoom = () => {
		socket.emit("findroom", roomId, (exists: RoomExists) => {
			setRoomExists(exists);
		});
	};

	useEffect(() => {
		if (!roomId) return;
		if (roomExists === null || roomExists === "not exist") return;
		socket.emit("joinroom", roomId);
		socket.on("roomstatus", setRoomStatus);
	}, [roomId, roomExists]);

	return (
		<main
			className={"flex min-h-screen flex-col items-center justify-center p-24"}
		>
			<h1 className="text-6xl font-bold mb-5">Connect four</h1>
			<h2 className="mb-5">
				This is your room id share it, when a player joins the game will start
			</h2>
			<input
				className="bg-black text-white border-2 border-white rounded-md p-2"
				onChange={onRoomIdChange}
				value={roomId}
				disabled={roomStatus === "connected"}
			/>
			<button type="button" onClick={checkRoom}>
				Join Room
			</button>
			<p className={RoomStatusColor[roomStatus]}>{RoomStatusMsg[roomStatus]}</p>
			<small className="text-red-500">
				{roomExists === "not exist" && "La sala no existe"}
				{roomExists === "full" && "La sala esta llena"}
			</small>
		</main>
	);
};

export default JoinPage;

/*{
    concept: 'Esto es u,
    types: ['general', 'deductible']
}*/
