import { io } from "socket.io-client";
var server = "http://2.47.193.210:3000"; //"https://server-tombola.onrender.com";
let socket = io(server);
export default socket;
