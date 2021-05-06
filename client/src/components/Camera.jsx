import React from "react";

import socket from "../socket";

import "../styles/Camera.css";

function Camera() {
  const videoStream = React.useRef();
  const stream = React.useRef();
  const peerRef = React.useRef();
  const opponent = React.useRef();
  const [isStream, setIsStream] = React.useState(false);
  const [watching, setWatching] = React.useState(false);
  const [videoClass, setVideoClass] = React.useState("non-displayed");

  const handleNegotiationNeededEvent = (userID) => {
    peerRef.current
      .createOffer()
      .then((offer) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socket.id,
          sdp: peerRef.current.localDescription,
        };
        socket.emit("ROOM:OFFER", payload);
      });
  };

  const handleTrackEvent = (e) => {
    videoStream.current.srcObject = e.streams[0];
  };

  const handleICECandidateEvent = (e) => {
    if (e.candidate) {
      const payload = {
        target: opponent.current,
        candidate: e.candidate,
      };
      socket.emit("ROOM:ICE-CANDIDATE", payload);
    }
  };

  const createPeer = React.useCallback((userID) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }, []);

  const handleAnswer = (message) => {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc);
  };

  const handleRecieveCall = React.useCallback(
    (incoming) => {
      peerRef.current = createPeer();
      const desc = new RTCSessionDescription(incoming.sdp);
      peerRef.current
        .setRemoteDescription(desc)
        .then(() => {
          return peerRef.current.createAnswer();
        })
        .then((answer) => {
          return peerRef.current.setLocalDescription(answer);
        })
        .then(() => {
          const payload = {
            target: incoming.caller,
            caller: socket.id,
            sdp: peerRef.current.localDescription,
          };
          socket.emit("ROOM:ANSWER", payload);
        });
    },
    [createPeer]
  );

  const handleNewICECandidateMsg = (incoming) => {
    const candidate = new RTCIceCandidate(incoming);
    peerRef.current.addIceCandidate(candidate);
  };

  const callUser = React.useCallback(
    (userId) => {
      peerRef.current = createPeer(userId);
      stream.current
        .getTracks()
        .forEach((track) => peerRef.current.addTrack(track, stream.current));
      opponent.current = userId;
    },
    [createPeer]
  );

  const streamCheck = (streamObj) => {
    stream.current = streamObj;
    setIsStream((prev) => (!!stream.current ? true : prev));
  };

  const startWatching = () => {
    socket.emit("ROOM:STREAM-WANT-TO-WATCH");
    setWatching(true);
    setVideoClass("displayed");
  };

  const startStreaming = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((streamObj) => {
        videoStream.current.srcObject = streamObj;
        stream.current = streamObj;
        socket.emit("ROOM:STREAMING-START", { streamId: streamObj.id });
        setIsStream(true);
        setWatching(true);
        setVideoClass("displayed");
      });
  };

  React.useEffect(() => {
    socket.on("ROOM:STREAMING-CHECK", streamCheck);
    socket.on("ROOM:STREAM-CALL", callUser);
    socket.on("ROOM:ICE-CANDIDATE-RECIEVED", handleNewICECandidateMsg);
    socket.on("ROOM:OFFER-RECIEVED", handleRecieveCall);
    socket.on("ROOM:ANSWER-RECIEVED", handleAnswer);
  }, [callUser, handleRecieveCall]);

  return (
    <div className="video">
      <div className="video_name">
        Stream is now{" "}
        <span className={"video_" + (isStream ? "online" : "offline")}>
          {isStream ? "online" : "offline"}
        </span>
      </div>
      <video playsInline ref={videoStream} autoPlay className={videoClass} />
      {!isStream && (
        <button className="video__button" onClick={startStreaming}>
          Start stream
        </button>
      )}
      {isStream && !watching && (
        <button className="video__button" onClick={startWatching}>
          Start watching
        </button>
      )}
    </div>
  );
}

export default Camera;
