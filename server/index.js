const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5000;

const router = require("./router");
const { Socket } = require("dgram");

const app = express();

const server = http.createServer(app);

app.use(router);
const io = socketio(server);

io.on("connection", (socket) => {
	console.log("Socket connection is going on");
	socket.on("disconnect", () => {
		console.log("User Had Left");
	});
});

server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
