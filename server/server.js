const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 8000;

function onConnection(socket) {
  console.log("user connected with id", socket.id);
}

io.on("connection", onConnection);

server.listen(PORT, (err) => {
  if (err) throw new Error(err);
  console.log(`listening on port ${PORT}`);
});
