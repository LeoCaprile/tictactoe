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

	useEffect(() => {
		socket.emit("joinroom", roomId);
		socket.on("roomstatus", (status) => {
			setRoomStatus(status);
		});
	}, [roomId]);

	return (
		<main
			className={"flex min-h-screen flex-col items-center justify-center p-24"}
		>
			<h1 className="text-6xl font-bold mb-5">Connect four</h1>
			<h2 className="mb-5">
				This is your room id share it, when a player joins the game will start
			</h2>
			<input value={roomId} disabled />

			<p className={RoomStatusColor[roomStatus]}>{RoomStatusMsg[roomStatus]}</p>
		</main>
	);
};

export default CreatePage;
