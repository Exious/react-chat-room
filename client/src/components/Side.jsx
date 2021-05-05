import React from "react";

import socket from "../socket";

import "../styles/Side.css";

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
    <div className="sidebar">
      <div className="separator vertical"></div>
      <div className="sidebar__content">
        <h1 className="sidebar__content_info">Information</h1>
        <div className="sidebar__content_activities">
          <div className="users">
            <h3 className="users_name">Users</h3>
            <ul className="users_list">
              {users.map((user) => (
                <li className="users_list__item" key={user}>
                  {user}
                </li>
              ))}
            </ul>
          </div>
          <div className='online'>{'Online: '}<span>{users.length}</span></div>
          <div className="camera">Camera</div>
        </div>
      </div>
    </div>
  );
}

export default Side;
