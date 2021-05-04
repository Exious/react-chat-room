import React from "react";

import socket from "../socket";

import { useHistory } from "react-router-dom";

function Login({ setIsLogged }) {
  const [userName, setUserName] = React.useState("");

  const history = useHistory();

  const onEnter = async () => {
    if (!userName) {
      return alert("Неверные данные");
    }

    const obj = {
      name: userName,
      timestamp: Date.now(),
    };

    socket.emit("CREATED:USER", obj);

    setIsLogged(true);

    history.push("/");
  };

  return (
    <div className="login-block">
      <input
        type="text"
        placeholder="Ваше имя"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={onEnter} className="btn btn-success">
        ВОЙТИ
      </button>
    </div>
  );
}

export default Login;
