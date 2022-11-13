import { Alert } from "react-native";
import { io } from "socket.io-client";
const server = "http://192.168.1.9:3000";
const socket = io(server);
export default socket;
