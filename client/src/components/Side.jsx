import React from "react";

import socket from "../socket";

function Side({ roomId, users, dispatch }) {
  React.useEffect(() => {
    socket.emit("ROOM:FIND-USERS");
    socket.on("ROOM:GET-USERS", (obj) => {
      dispatch({
        type: "SET-USERS",
        payload: obj,
      });
    });
  }, [dispatch]);

  return (
    <div className="sidebar-wrapper">
      <h1>Side</h1>
      <div>Room {roomId}</div>
      <div>Users</div>
      <ul>
        {users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

export default Side;
