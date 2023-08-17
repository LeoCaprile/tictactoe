import { socket } from "@/apps/client/src/services/socket";
import { useEffect, useState } from "react";
import { generateShortUuid } from "custom-uuid";
import { RoomStatus } from "@/shared/types/room";

export const getServerSideProps = async () => {
	const id = generateShortUuid();

	return {
		props: {
			id,
		},
	};
};

const RoomStatusMsg = {
	error: "Something went wrong",
	waiting: "Waiting for a player to join",
	connected: "Player connected, starting game",
	playing: "Game started",
};

const RoomStatusColor = {
	error: "text-red-500",
	waiting: "text-yellow-500",
	connected: "text-green-500",
	playing: "text-green-500",
};

const CreatePage = ({ id }: { id: string }) => {
	const [roomId] = useState(id);
	const [roomStatus, setRoomStatus] = useState<RoomStatus>("waiting");

	function startGame() {
		socket.emit("roomstatus", "playing");
	}

	useEffect(() => {
		socket.emit("joinroom", roomId);
		socket.on("roomstatus", setRoomStatus);
	}, [roomId]);

	return (
		<main
			className={"flex min-h-screen flex-col items-center justify-center p-24"}
		>
			{roomStatus === "playing" ? (
				<>juego</>
			) : (
				<>
					<h1 className="text-6xl font-bold mb-5">Connect four</h1>
					<h2 className="mb-5">
						This is your room id share it, when a player joins the game will
						start
					</h2>
					<input value={roomId} disabled />

					<p className={RoomStatusColor[roomStatus]}>
						{RoomStatusMsg[roomStatus]}
					</p>
					<small>{roomStatus === "connected" ? "2/2" : "1/2"}</small>
					{roomStatus === "connected" && (
						<button type="button" onClick={startGame}>
							Start Game
						</button>
					)}
				</>
			)}
		</main>
	);
};

export default CreatePage;
