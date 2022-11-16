import { io } from "socket.io-client";
var server = "http://37.116.160.184:3000";
let socket = io(server);
export const setServer = (s) => {
  socket.disconnect();
  socket = io(s, { forceNew: true });
  console.log("Server cambiato in " + s);
};
export default socket;
