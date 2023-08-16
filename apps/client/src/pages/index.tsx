import { Inter } from "next/font/google";
import { useEffect } from "react";
import { io } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });
const socket = io("http://localhost:4000");

export default function Home() {
	useEffect(() => {
		socket.on("connect", () => {
			console.log("conected");
		});

		socket.on("disconect", () => {
			console.log("disconected");
		});

		return () => {
			socket.off("connect", () => {
				console.log("conected");
			});
			socket.off("disconect", () => {
				console.log("disconected");
			});
		};
	}, [socket]);

	const createRoom = async () => {
		const res = await fetch("http://localhost:4000/create");
		const data = await res.json();
		console.log(data);
		socket.emit("create room", data.roomId, (msg: string) => {
			console.log(msg, socket.id);
		});
	};
	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
		>
			<h1 className="text-6xl font-bold mb-5">Connect four</h1>
			<div className="flex gap-10">
				<button type="button" onClick={createRoom}>
					create room
				</button>
				<button type="button" onClick={createRoom}>
					join room
				</button>
			</div>
		</main>
	);
}
