import { io } from "socket.io-client";
var server = "http://192.168.1.9:3000"; //"https://server-tombola.onrender.com";
let socket = io(server);
export default socket;
