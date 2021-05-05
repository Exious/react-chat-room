const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = 8000;

class User {
  constructor(socket) {
    this.socket = socket;
    this.id = socket.id;
    this.name = null;
    this.timestamp = null;
    this.currentlyChat = null;
  }
}

class Rooms {
  constructor() {
    this.rooms = new Map();
  }
}

const roomsList = new Rooms();

function onConnection(socket) {
  const user = new User(socket);
  socket.on("USER:CREATED", ({ name, timestamp }) => {
    user.name = name;
    user.timestamp = timestamp;
  });

  socket.on("ROOM:ID-CHECK", (id) => {
    if (!roomsList.rooms.get(id)) {
      roomsList.rooms.set(
        id,
        new Map([
          ["users", new Map()],
          ["messages", []],
        ])
      );
    }
    roomsList.rooms.get(id).get("users").set(user.id, user.name);
    socket.join(id);
  });

  socket.on("ROOM:USER-JOINED", (id) => {
    user.currentlyChat = id;
    const obj = {
      userName: user.name,
      roomId: user.currentlyChat,
    };
    const message = {
      userName: user.name,
      userId: user.id,
      type: "system",
      text: `${user.name} joined`,
      timestamp: Date.now(),
    };
    roomsList.rooms.get(user.currentlyChat).get("messages").push(message);
    socket.emit("ROOM:USER-DATA", obj);
    socket.broadcast
      .to(user.currentlyChat)
      .emit("ROOM:RECIEVE-MESSAGE", message);
  });

  socket.on("ROOM:FIND-USERS", () => {
    const users = [
      ...roomsList.rooms.get(user.currentlyChat).get("users").values(),
    ];
    io.to(user.currentlyChat).emit("ROOM:GET-USERS", users);
  });

  socket.on(
    "ROOM:NEW-MESSAGE",
    ({ roomId, userName, type, text, timestamp }) => {
      const obj = {
        userName,
        userId: user.id,
        type,
        text,
        timestamp,
      };
      roomsList.rooms
        .get(roomId)
        .get("messages")
        .push({
          ...obj,
          affiliation: "others",
        });
      socket.emit("ROOM:RECIEVE-MESSAGE", { ...obj, affiliation: "my" });
      socket.broadcast.to(user.currentlyChat).emit("ROOM:RECIEVE-MESSAGE", {
        ...obj,
        affiliation: "others",
      });
    }
  );

  socket.on("ROOM:GET-MESSAGE-HISTORY", (roomId) => {
    socket.emit(
      "ROOM:RECIEVE-MESSAGE-HISTORY",
      roomsList.rooms.get(roomId).get("messages")
    );
  });

  socket.on("disconnect", () => {
    if (
      user.currentlyChat &&
      roomsList.rooms.get(user.currentlyChat).get("users").delete(user.id)
    ) {
      const users = [
        ...roomsList.rooms.get(user.currentlyChat).get("users").values(),
      ];
      const message = {
        userName: user.name,
        userId: user.id,
        type: "system",
        text: `${user.name} disconnected`,
        timestamp: Date.now(),
      };
      io.to(user.currentlyChat).emit("ROOM:RECIEVE-MESSAGE", message);
      roomsList.rooms.get(user.currentlyChat).get("messages").push(message);
      socket.broadcast.to(user.currentlyChat).emit("ROOM:GET-USERS", users);
    }
  });

  console.log("user connected with id", socket.id);
}

io.on("connection", onConnection);

server.listen(PORT, (err) => {
  if (err) throw new Error(err);
  console.log(`listening on port ${PORT}`);
});
