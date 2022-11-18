import { io } from "socket.io-client";
var server = "https://server-tombola.onrender.com";
let socket = io(server);
export default socket;
