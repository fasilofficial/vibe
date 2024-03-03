import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { connectDatabase } from "./config/database";

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (message, roomName) => {
    if (roomName.length) {
      io.to(roomName).emit("message", message); // send message to specific room (if any)
    } else {
      io.emit("message", message); // send message to everyone
    }
  });

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
  });

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
