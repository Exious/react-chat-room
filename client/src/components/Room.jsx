import React from "react";
import { useParams } from "react-router-dom";

import socket from "../socket";
import reducer from "../reducer";

import MessageForm from "./MessageForm";
import History from "./History";
import Side from "./Side";
import Loading from "./Loading";

import "../styles/Room.css";

function Room({ setRoomId, isLogged }) {
  const { id } = useParams();

  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: id,
    userName: null,
    users: [],
    messages: [],
  });

  React.useEffect(() => {
    if (isLogged) {
      socket.emit("ROOM:ID-CHECK", state.roomId);
      socket.emit("ROOM:USER-JOINED", state.roomId);
      socket.on("ROOM:USER-DATA", (obj) => {
        dispatch({
          type: "JOINED",
          payload: obj,
        });
      });
    } else {
      setRoomId(state.roomId);
    }
  }, [state.roomId, setRoomId, isLogged]);

  return (
    <div>
      {state.joined ? (
        <div>
          <div className="chat-wrapper">
            <History {...state} dispatch={dispatch} />
            <MessageForm {...state} />
          </div>
          <Side {...state} dispatch={dispatch} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Room;
