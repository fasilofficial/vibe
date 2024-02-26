import http from "http";
import socketio from "socket.io";
import app from "./app";
import { connectDatabase } from "./config/database";

const server = http.createServer(app);
const io = new socketio.Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 3300;

connectDatabase().then(() => {
  server.listen(port, () => {
    console.log(`[server]: server listening on port ${port}`);
  });
});
