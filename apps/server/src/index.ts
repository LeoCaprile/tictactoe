import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "@/shared/types/sockets";

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
	cors: {
		origin: "http://localhost:3000",
	},
});

const getSocketsInRoom = async (roomId: string) => {
	const room = await io.in(roomId).fetchSockets();
	return room.length;
};

io.on("connection", (socket) => {
	socket.on("findroom", async (roomId, checkRoom) => {
		const sockets = await getSocketsInRoom(roomId);
		if (sockets === 0) {
			checkRoom("not exist");
		} else if (sockets === 1) {
			checkRoom("exists");
		} else if (sockets >= 2) {
			checkRoom("full");
		}
	});

	socket.on("joinroom", async (roomId) => {
		const sockets = await getSocketsInRoom(roomId);

		// check if room is ready to start
		if (sockets <= 1) {
			await socket.join(roomId);
			const socketsAfter = await getSocketsInRoom(roomId);

			if (socketsAfter === 2) {
				io.to(roomId).emit("roomstatus", "connected");
			} else {
				io.to(roomId).emit("roomstatus", "waiting");
			}
		}

		socket.on("roomstatus", (status) => {
			io.to(roomId).emit("roomstatus", status);
		});

		socket.on("disconnect", () => {
			io.to(roomId).emit("roomstatus", "waiting");
		});
	});
});

httpServer.listen(4000, () => {
	console.log("listening on for http and ws *:4000");
});
