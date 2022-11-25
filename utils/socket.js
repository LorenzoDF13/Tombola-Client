import { io } from "socket.io-client";
var server = "http://37.116.162.7:3000"; //"https://server-tombola.onrender.com";
let socket = io(server);
export default socket;
