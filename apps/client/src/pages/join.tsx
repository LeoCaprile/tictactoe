import { socket } from "@/apps/client/src/services/socket";
import { useEffect, useState } from "react";
import { RoomExists, RoomStatus } from "@/shared/types/room";
import Board from "../components/Board";

const RoomStatusMsg = {
	error: "Something went wrong",
	waiting: "Join a room to start playing",
	connected: "Player connected, starting game",
	playing: "Game started",
	gameover: "Game over",
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
			<h1 className="text-6xl font-bold mb-5">Tic tac toe</h1>
			{roomStatus === "playing" ? (
				<Board playerSymbol="o" />
			) : (
				<>
					<h2 className="mb-5">
						Type or copy the room id to join a room and start playing
					</h2>
					<input
						className="bg-black text-white border-2 border-white rounded-md p-2"
						onChange={onRoomIdChange}
						value={roomId}
						disabled={roomStatus === "connected"}
					/>
					<button
						type="button"
						onClick={checkRoom}
						disabled={roomStatus === "connected"}
					>
						Join Room
					</button>
					<p className={RoomStatusColor[roomStatus]}>
						{RoomStatusMsg[roomStatus]}
					</p>
					<small className="text-red-500">
						{roomExists === "not exist" && "La sala no existe"}
						{roomExists === "full" && "La sala esta llena"}
					</small>
					<small>
						{roomStatus === "connected"
							? "2/2 waiting for host to start"
							: "1/2"}
					</small>
				</>
			)}
		</main>
	);
};

export default JoinPage;
