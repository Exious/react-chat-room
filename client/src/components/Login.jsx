import React from "react";

import socket from "../socket";

import { useHistory } from "react-router-dom";

import { useAuth } from "./AuthContext";

import "../styles/Login.css";

function Login() {
  const [userName, setUserName] = React.useState("");

  const { setIsLogged } = useAuth();

  const history = useHistory();

  const onEnter = async () => {
    if (!userName) {
      return alert("Неверные данные");
    }

    const obj = {
      name: userName,
      timestamp: Date.now(),
    };

    socket.emit("USER:CREATED", obj);

    setIsLogged(true);

    history.push("/");
  };

  return (
    <div className="login-wrapper">
      <div className="login">
        <input
          className="login__input"
          type="text"
          placeholder="Your nickname"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button className="login__button" onClick={onEnter}>
          Enter
        </button>
      </div>
    </div>
  );
}

export default Login;
