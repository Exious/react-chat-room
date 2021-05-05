import React from "react";

import socket from "../socket";

import "../styles/MessageForm.css";

function MessageForm({ roomId, userName }) {
  const [message, setMessage] = React.useState("");

  const onSend = () => {
    if (message) {
      const obj = {
        roomId,
        userName,
        type: "message",
        text: message,
        timestamp: Date.now(),
      };
      socket.emit("ROOM:NEW-MESSAGE", obj);
      setMessage("");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") onSend();
  };

  return (
    <div className="bottom-panel-wrapper">
      <div className="separator horizontal"></div>
      <div className="bottom-panel">
        <input
          className="bottom-panel__input"
          type="text"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnter}
        />
        <button className="bottom-panel__button" onClick={onSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageForm;
