import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { connectDatabase } from "./config/database";
import Chat from "./models/Chat";

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

type User = {
  userId: string;
  socketId: string;
};

let usersOnline: User[] = [];

function addUser(userId: string, socketId: string) {
  usersOnline.push({ userId, socketId });
}

function removeUser(userId: string) {
  usersOnline = usersOnline.filter((user) => user.userId !== userId);
}

io.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    // const { userId, socketId } = user;
    console.log(user);
    // addUser(userId, socketId);
  });

  socket.on("message", async ({ message, roomName, sender, receiver }) => {
    // receives message from sender
    console.log("Message received");

    const chat = new Chat({ message, sender, receiver });

    await chat.save();
    await chat.populate({ path: "sender", model: "User" });
    await chat.populate({ path: "receiver", model: "User" });

    if (roomName.length) {
      io.to(roomName).emit("message", chat); // send message to specific room (if any)
      console.log("Message sent");
    } else {
      io.emit("message", chat); // send message to everyone
      console.log("Message sent");
    }
  });

  socket.on("joinRoom", (roomName) => {
    // console.log(roomName);
    socket.join(roomName);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

const port = process.env.PORT || 3300;

connectDatabase().then(() => {
  server.listen(port, () => {
    console.log(`[server]: server listening on port ${port}`);
  });
});
