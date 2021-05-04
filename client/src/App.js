import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

import "./styles/App.css";

import Login from "./components/Login";
import Room from "./components/Room";

function App() {
  const [isLogged, setIsLogged] = React.useState(false);
  const [roomId, setRoomId] = React.useState(null);

  return (
    <Router>
      <Route path="/">
        {isLogged ? (
          roomId ? (
            <Redirect to={`/room/${roomId}`} />
          ) : (
            <Redirect to={`/room/${uuidV4()}`} />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/room/:id" exact>
        <Room setRoomId={setRoomId} />
      </Route>
      <Route path="/login">
        <Login setIsLogged={setIsLogged} />
      </Route>
    </Router>
  );
}

export default App;
