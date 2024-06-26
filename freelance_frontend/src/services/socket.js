import io from "socket.io-client";
import { isAuthenticated } from "./auth/auth";

export const connectToSocketServer = () => {
	let authData = isAuthenticated();
	let socket = io("socket IO server link", {autoConnect: true, transports: ['websocket'], upgrade: false});
	socket.on("connect", () => {
		socket.emit("joinroom", authData.user._id);
	})

	return socket;
}

export const subscribeToSocketService = (socket, event, cb) => {
	socket.on(event, msg => cb(msg));
}

export default connectToSocketServer;