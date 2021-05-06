import React from "react";

import "../styles/Users.css";

function Users({ users }) {
  const usersRef = React.useRef(null);

  return (
    <div className="users">
      <h3 className="users_name">Users</h3>
      <ul className="users_list" ref={usersRef}>
        {users.map(([userName, timestamp]) => (
          <li className="users_list__item" key={userName + timestamp}>
            {userName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
