import React from "react";

import socket from "../socket";

import renderedMessage from "../messageRenderer";

import "../styles/History.css";

function History({ roomId, messages, dispatch }) {
  const messagesRef = React.useRef(null);

  React.useEffect(() => {
    socket.emit("ROOM:GET-MESSAGE-HISTORY", roomId);
  }, [roomId]);

  React.useEffect(() => {
    socket.on("ROOM:RECIEVE-MESSAGE-HISTORY", (messages) => {
      dispatch({
        type: "SET-MESSAGES-LIST",
        payload: messages,
      });
    });

    socket.on("ROOM:RECIEVE-MESSAGE", (message) => {
      dispatch({
        type: "NEW-MESSAGE",
        payload: message,
      });
    });
  }, [dispatch]);

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, messages.length * 100);
  }, [messages]);

  return (
    <div ref={messagesRef} className="history-wrapper">
      {messages.map(renderedMessage)}
    </div>
  );
}

export default History;
