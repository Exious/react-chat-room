import React from "react";

import "../styles/ChatHeader.css";

function ChatHeader({ roomId }) {
  return (
    <div className="room-header">
      <div className="room-header_id">
        <div className="room-header_id_blur"></div>
        <span className="room-header_id_text">Conference {roomId}</span>
      </div>
    </div>
  );
}

export default ChatHeader;
