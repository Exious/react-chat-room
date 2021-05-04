import React from "react";

import socket from "../socket";

function MessageForm({ roomId, userName }) {
  const [message, setMessage] = React.useState("");

  const onSend = () => {
    if (message) {
      const obj = {
        roomId,
        userName,
        text: message,
        timestamp: Date.now(),
      };
      socket.emit("ROOM:NEW-MESSAGE", obj);
      setMessage("");
    }
  };

  return (
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
  );
}

export default MessageForm;
