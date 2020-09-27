const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5000;

const router = require("./router");
const { Socket } = require("dgram");
const { use } = require("./router");

const app = express();

const server = http.createServer(app);

app.use(router);
const io = socketio(server);

io.on("connection", (socket) => {
	socket.on("join", ({ name, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, name, room });

		if (error) return callback(error);

		socket.emit("message", {
			user: "admin",
			text: `${user.name}, welcome to the room ${user.room}`,
		});
		socket.broadcast.to(user.room).emit("message", {
			user: "admin",
			text: `${user.name}, has joined!`,
		});
		socket.join(user.room);
	});

	socket.on("disconnect", () => {
		console.log("User Had Left");
	});
});

server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
