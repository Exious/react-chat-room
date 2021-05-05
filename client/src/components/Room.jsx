import React from "react";
import { useParams } from "react-router-dom";

import socket from "../socket";
import reducer from "../reducer";

import MessageForm from "./MessageForm";
import History from "./History";
import Side from "./Side";
import Loading from "./Loading";
import ChatHeader from "./ChatHeader";

import "../styles/Room.css";

import { useAuth } from "./AuthContext";

function Room() {
  const { id } = useParams();

  const { isLogged, setRoomId } = useAuth();

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

  return state.joined ? (
    <div className="room">
      <ChatHeader {...state} />
      <div className="separator horizontal shheader"></div>
      <div className="room-content">
        <div className="chat">
          <History {...state} dispatch={dispatch} />
          <MessageForm {...state} />
        </div>
        <Side {...state} dispatch={dispatch} />
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default Room;
