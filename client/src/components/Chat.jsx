import React from "react";

import socket from "../socket";

import History from "./History";

function Chat({ joined, roomId, userName, users, messages }) {
  const [message, setMessage] = React.useState("");

  const onSend = () => {
    const obj = {
      roomId,
      userName,
      message,
      timestamp: Date.now(),
    };

    socket.emit("ROOM:NEW-MESSAGE", obj);
  };

  return (
    <div className="chat-wrapper">
      <History />
      <div className="bottom-panel-wrapper">
        <input
          type="text"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={onSend} className="btn btn-success">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
