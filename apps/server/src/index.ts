import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import { generateShortUuid } from "custom-uuid";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", (socket) => {
	socket.on("create room", (roomId, cb) => {
		socket.join(roomId);
		cb("joined room");
	});
});

app.get("/create", (_, res) => {
	const roomId = generateShortUuid();

	res.status(200).json({ roomId });
	res.end();
});

httpServer.listen(4000, () => {
	console.log("listening on for http and ws *:4000");
});
