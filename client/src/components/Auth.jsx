import React from "react";
import { Redirect } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { useAuth } from "./AuthContext";

export default function Auth() {
  const { isLogged, roomId } = useAuth();

  return (
    <div className="auth-wrapper">
      {isLogged ? (
        roomId ? (
          <Redirect to={`/room/${roomId}`} />
        ) : (
          <Redirect to={`/room/${uuidV4()}`} />
        )
      ) : (
        <Redirect to="/login" />
      )}
    </div>
  );
}
