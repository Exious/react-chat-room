import React from "react";

import socket from "../socket";

import "../styles/Side.css";

import Users from "./Users";
import Online from "./Online";
import Camera from "./Camera";

function Side({ roomId, users, dispatch }) {
  React.useEffect(() => {
    socket.emit("ROOM:FIND-USERS");
    socket.on("ROOM:GET-USERS", (obj) => {
      console.log(obj);
      dispatch({
        type: "SET-USERS",
        payload: obj,
      });
    });
  }, [dispatch]);

  return (
    <div className="sidebar">
      <div className="separator vertical"></div>
      <div className="sidebar__content">
        <h1 className="sidebar__content_info">Information</h1>
        <div className="sidebar__content_activities">
          <Users users={users} />
          <Online users={users} />
          <Camera roomId={roomId} />
        </div>
      </div>
    </div>
  );
}

export default Side;
