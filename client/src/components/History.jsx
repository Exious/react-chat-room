import React from "react";

import socket from "../socket";

function History({ roomId, messages, dispatch }) {
  const messagesRef = React.useRef(null);

  const prettifyTime = (str) => (str < 10 ? `0${str}` : str);

  const getTime = (message) => {
    const date = new Date(message.timestamp);
    return `${prettifyTime(date.getHours())}:${prettifyTime(
      date.getMinutes()
    )}`;
  };

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

  return (
    <div className="history-wrapper">
      <div ref={messagesRef} className="messages">
        {messages.map((message) => (
          <div className="message" key={message.timestamp}>
            <p>{message.text}</p>
            <div>
              <span>{message.userName}</span>
              <span>{getTime(message)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
