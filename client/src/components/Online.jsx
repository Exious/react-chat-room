import React from "react";

import "../styles/Online.css";

function Online({ users }) {
  return (
    <div className="online">
      {"Online: "}
      <span>{users.length}</span>
    </div>
  );
}

export default Online;
